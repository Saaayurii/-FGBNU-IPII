"use server";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { welcomeEmailTemplate, newsNotificationTemplate } from "@/lib/email-templates";
import { EmailStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(email: string) {
  try {
    // Проверяем, существует ли подписчик с таким email
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      if (existingSubscriber.active) {
        return { success: false, error: "Этот email уже подписан на рассылку." };
      } else {
        // Активируем подписку, если ранее была деактивирована
        await prisma.subscriber.update({
          where: { email },
          data: { active: true }
        });
      }
    } else {
      // Создаем нового подписчика
      await prisma.subscriber.create({
        data: { email, active: true }
      });
    }

    // Отправляем приветственное письмо
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        to: email,
        subject: 'Добро пожаловать в нашу рассылку!',
        html: welcomeEmailTemplate(email),
      });

      // Логируем успешную отправку
      await prisma.newsletterLog.create({
        data: {
          email,
          subject: 'Добро пожаловать в нашу рассылку!',
          status: EmailStatus.SENT,
          sentAt: new Date(),
        }
      });
    } catch (emailError) {
      console.error("Ошибка при отправке приветственного письма:", emailError);

      // Логируем ошибку отправки
      await prisma.newsletterLog.create({
        data: {
          email,
          subject: 'Добро пожаловать в нашу рассылку!',
          status: EmailStatus.FAILED,
          errorMsg: emailError instanceof Error ? emailError.message : 'Неизвестная ошибка',
        }
      });
    }

    revalidatePath('/admin/subscribers');
    return { success: true, message: "Вы успешно подписаны на рассылку!" };
  } catch (error) {
    console.error("Ошибка при подписке на рассылку:", error);
    return { success: false, error: "Ошибка при подписке на рассылку." };
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      return { success: false, error: "Подписчик с таким email не найден." };
    }

    await prisma.subscriber.update({
      where: { email },
      data: { active: false }
    });

    revalidatePath('/admin/subscribers');
    return { success: true, message: "Вы успешно отписаны от рассылки." };
  } catch (error) {
    console.error("Ошибка при отписке от рассылки:", error);
    return { success: false, error: "Ошибка при отписке от рассылки." };
  }
}

export async function sendNewsletterToSubscribers(postId: string) {
  try {
    // Получаем публикацию по ID
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!post || !post.published) {
      return { success: false, error: "Публикация не найдена или не опубликована." };
    }

    // Получаем активных подписчиков
    const subscribers = await prisma.subscriber.findMany({
      where: { active: true }
    });

    if (subscribers.length === 0) {
      return { success: false, error: "Нет активных подписчиков для рассылки." };
    }

    let successCount = 0;
    let failureCount = 0;

    // Отправляем письма каждому подписчику
    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
          to: subscriber.email,
          subject: `Новая публикация: ${post.title}`,
          html: newsNotificationTemplate(subscriber.email, post.title, post.description, post.slug),
        });

        // Логируем успешную отправку письма
        await prisma.newsletterLog.create({
          data: {
            email: subscriber.email,
            postId: post.id,
            subject: `Новая публикация: ${post.title}`,
            status: EmailStatus.SENT,
            sentAt: new Date(),
          }
        });

        successCount++;
      } catch (emailError) {
        console.error(`Ошибка при отправке письма на ${subscriber.email}:`, emailError);

        // Логируем ошибку отправки письма
        await prisma.newsletterLog.create({
          data: {
            email: subscriber.email,
            postId: post.id,
            subject: `Новая публикация: ${post.title}`,
            status: EmailStatus.FAILED,
            errorMsg: emailError instanceof Error ? emailError.message : 'Неизвестная ошибка',
          }
        });

        failureCount++;
      }
    }

    return {
      success: true,
      message: `Рассылка завершена. Успешно: ${successCount}, Ошибок: ${failureCount}`
    };
  } catch (error) {
    console.error("Ошибка при рассылке:", error);
    return { success: false, error: "Ошибка при отправке рассылки." };
  }
}

export async function getNewsletterStats() {
  try {
    const totalSubscribers = await prisma.subscriber.count();
    const activeSubscribers = await prisma.subscriber.count({
      where: { active: true }
    });
    const totalEmails = await prisma.newsletterLog.count();
    const successfulEmails = await prisma.newsletterLog.count({
      where: { status: EmailStatus.SENT }
    });
    const failedEmails = await prisma.newsletterLog.count({
      where: { status: EmailStatus.FAILED }
    });

    return {
      totalSubscribers,
      activeSubscribers,
      totalEmails,
      successfulEmails,
      failedEmails,
      successRate: totalEmails > 0 ? (successfulEmails / totalEmails) * 100 : 0
    };
  } catch (error) {
    console.error("Ошибка получения статистики рассылок:", error);
    return null;
  }
}

export async function getNewsletterLogs(limit = 50) {
  try {
    const logs = await prisma.newsletterLog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return logs;
  } catch (error) {
    console.error("Ошибка получения логов рассылок:", error);
    return [];
  }
}
