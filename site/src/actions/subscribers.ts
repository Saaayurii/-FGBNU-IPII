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
    console.error("H81:0 ?>;CG5=8O ?>4?8AG8:>2:", error);
    return [];
  }
}

export async function getActiveSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: {
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return subscribers;
  } catch (error) {
    console.error("H81:0 ?>;CG5=8O 0:B82=KE ?>4?8AG8:>2:", error);
    return [];
  }
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    });
    
    return subscriber;
  } catch (error) {
    console.error("H81:0 ?>;CG5=8O ?>4?8AG8:0:", error);
    return null;
  }
}

export async function createSubscriber(email: string) {
  try {
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      return { success: false, error: ">4?8AG8: A B0:8< email C65 ACI5AB2C5B" };
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        active: true
      }
    });

    revalidatePath('/admin/subscribers');
    return { success: true, data: subscriber };
  } catch (error) {
    console.error("H81:0 A>740=8O ?>4?8AG8:0:", error);
    return { success: false, error: "H81:0 ?@8 A>740=88 ?>4?8AG8:0" };
  }
}

export async function updateSubscriber(id: string, data: {
  email?: string;
  active?: boolean;
}) {
  try {
    // A;8 >1=>2;O5BAO email, ?@>25@O5< C=8:0;L=>ABL
    if (data.email) {
      const existingSubscriber = await prisma.subscriber.findFirst({
        where: {
          email: data.email,
          NOT: { id }
        }
      });

      if (existingSubscriber) {
        return { success: false, error: ">4?8AG8: A B0:8< email C65 ACI5AB2C5B" };
      }
    }

    const subscriber = await prisma.subscriber.update({
      where: { id },
      data
    });

    revalidatePath('/admin/subscribers');
    return { success: true, data: subscriber };
  } catch (error) {
    console.error("H81:0 >1=>2;5=8O ?>4?8AG8:0:", error);
    return { success: false, error: "H81:0 ?@8 >1=>2;5=88 ?>4?8AG8:0" };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await prisma.subscriber.delete({
      where: { id }
    });

    revalidatePath('/admin/subscribers');
    return { success: true };
  } catch (error) {
    console.error("H81:0 C40;5=8O ?>4?8AG8:0:", error);
    return { success: false, error: "H81:0 ?@8 C40;5=88 ?>4?8AG8:0" };
  }
}

export async function toggleSubscriberStatus(id: string) {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { id }
    });

    if (!subscriber) {
      return { success: false, error: ">4?8AG8: =5 =0945=" };
    }

    const updatedSubscriber = await prisma.subscriber.update({
      where: { id },
      data: {
        active: !subscriber.active
      }
    });

    revalidatePath('/admin/subscribers');
    return { success: true, data: updatedSubscriber };
  } catch (error) {
    console.error("H81:0 87<5=5=8O AB0BCA0 ?>4?8AG8:0:", error);
    return { success: false, error: "H81:0 ?@8 87<5=5=88 AB0BCA0 ?>4?8AG8:0" };
  }
}

export async function bulkDeleteSubscribers(ids: string[]) {
  try {
    const result = await prisma.subscriber.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    revalidatePath('/admin/subscribers');
    return { success: true, count: result.count };
  } catch (error) {
    console.error("H81:0 <0AA>2>3> C40;5=8O ?>4?8AG8:>2:", error);
    return { success: false, error: "H81:0 ?@8 C40;5=88 ?>4?8AG8:>2" };
  }
}

export async function bulkToggleSubscribersStatus(ids: string[], active: boolean) {
  try {
    const result = await prisma.subscriber.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        active
      }
    });

    revalidatePath('/admin/subscribers');
    return { success: true, count: result.count };
  } catch (error) {
    console.error("H81:0 <0AA>2>3> 87<5=5=8O AB0BCA0 ?>4?8AG8:>2:", error);
    return { success: false, error: "H81:0 ?@8 87<5=5=88 AB0BCA0 ?>4?8AG8:>2" };
  }
}

export async function getSubscribersStats() {
  try {
    const total = await prisma.subscriber.count();
    const active = await prisma.subscriber.count({
      where: { active: true }
    });
    const inactive = total - active;

    // >4?8AG8:8 70 ?>A;54=89 <5AOF
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const newThisMonth = await prisma.subscriber.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });

    return {
      total,
      active,
      inactive,
      newThisMonth,
      activeRate: total > 0 ? (active / total) * 100 : 0
    };
  } catch (error) {
    console.error("H81:0 ?>;CG5=8O AB0B8AB8:8 ?>4?8AG8:>2:", error);
    return {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      activeRate: 0
    };
  }
}

export async function searchSubscribers(query: string) {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: {
        email: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return subscribers;
  } catch (error) {
    console.error("H81:0 ?>8A:0 ?>4?8AG8:>2:", error);
    return [];
  }
}