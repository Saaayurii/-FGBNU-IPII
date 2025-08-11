"use server";

import { prisma } from "@/lib/prisma";
import { Subscriber } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return subscribers;
  } catch (error) {
    console.error("Ошибка получения подписчиков:", error);
    return [];
  }
}

export async function getActiveSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });
    return subscribers;
  } catch (error) {
    console.error("Ошибка получения активных подписчиков:", error);
    return [];
  }
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  try {
    return await prisma.subscriber.findUnique({ where: { email } });
  } catch (error) {
    console.error("Ошибка получения подписчика:", error);
    return null;
  }
}

export async function createSubscriber(email: string) {
  try {
    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });
    if (existingSubscriber) {
      return { success: false, error: "Подписчик с таким email уже существует" };
    }
    const subscriber = await prisma.subscriber.create({
      data: { email, active: true }
    });
    revalidatePath('/admin/subscribers');
    return { success: true, data: subscriber };
  } catch (error) {
    console.error("Ошибка создания подписчика:", error);
    return { success: false, error: "Ошибка при создании подписчика" };
  }
}

export async function updateSubscriber(id: string, data: { email?: string; active?: boolean }) {
  try {
    if (data.email) {
      const existingSubscriber = await prisma.subscriber.findFirst({
        where: { email: data.email, NOT: { id } }
      });
      if (existingSubscriber) {
        return { success: false, error: "Подписчик с таким email уже существует" };
      }
    }
    const subscriber = await prisma.subscriber.update({ where: { id }, data });
    revalidatePath('/admin/subscribers');
    return { success: true, data: subscriber };
  } catch (error) {
    console.error("Ошибка обновления подписчика:", error);
    return { success: false, error: "Ошибка при обновлении подписчика" };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await prisma.subscriber.delete({ where: { id } });
    revalidatePath('/admin/subscribers');
    return { success: true };
  } catch (error) {
    console.error("Ошибка удаления подписчика:", error);
    return { success: false, error: "Ошибка при удалении подписчика" };
  }
}

export async function toggleSubscriberStatus(id: string) {
  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { id } });
    if (!subscriber) {
      return { success: false, error: "Подписчик не найден" };
    }
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id },
      data: { active: !subscriber.active }
    });
    revalidatePath('/admin/subscribers');
    return { success: true, data: updatedSubscriber };
  } catch (error) {
    console.error("Ошибка при изменении статуса подписчика:", error);
    return { success: false, error: "Ошибка при изменении статуса подписчика" };
  }
}

export async function bulkDeleteSubscribers(ids: string[]) {
  try {
    const result = await prisma.subscriber.deleteMany({ where: { id: { in: ids } } });
    revalidatePath('/admin/subscribers');
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Ошибка массового удаления подписчиков:", error);
    return { success: false, error: "Ошибка при массовом удалении подписчиков" };
  }
}

export async function bulkToggleSubscribersStatus(ids: string[], active: boolean) {
  try {
    const result = await prisma.subscriber.updateMany({
      where: { id: { in: ids } },
      data: { active }
    });
    revalidatePath('/admin/subscribers');
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Ошибка массового изменения статуса подписчиков:", error);
    return { success: false, error: "Ошибка при массовом изменении статуса подписчиков" };
  }
}

export async function getSubscribersStats() {
  try {
    const total = await prisma.subscriber.count();
    const active = await prisma.subscriber.count({ where: { active: true } });
    const inactive = total - active;
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const newThisMonth = await prisma.subscriber.count({
      where: { createdAt: { gte: lastMonth } }
    });
    return {
      total,
      active,
      inactive,
      newThisMonth,
      activeRate: total > 0 ? (active / total) * 100 : 0
    };
  } catch (error) {
    console.error("Ошибка получения статистики подписчиков:", error);
    return { total: 0, active: 0, inactive: 0, newThisMonth: 0, activeRate: 0 };
  }
}

export async function searchSubscribers(query: string) {
  try {
    return await prisma.subscriber.findMany({
      where: { email: { contains: query, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Ошибка поиска подписчиков:", error);
    return [];
  }
}
