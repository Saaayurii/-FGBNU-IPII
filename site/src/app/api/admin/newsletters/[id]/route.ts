import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newsletter = await prisma.newsletter.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!newsletter) {
      return NextResponse.json({ error: 'Рассылка не найдена' }, { status: 404 });
    }

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, content, scheduledAt } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Тема и содержание рассылки обязательны' },
        { status: 400 }
      );
    }

    // Подсчитаем количество активных подписчиков
    const subscribersCount = await prisma.subscriber.count({
      where: { active: true }
    });

    const newsletter = await prisma.newsletter.update({
      where: { id: resolvedParams.id },
      data: {
        subject,
        content,
        recipientsCount: subscribersCount,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Error updating newsletter:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.newsletter.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({ message: 'Рассылка удалена' });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}