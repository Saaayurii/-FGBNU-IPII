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

    const vacancy = await prisma.vacancy.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!vacancy) {
      return NextResponse.json({ error: 'Вакансия не найдена' }, { status: 404 });
    }

    return NextResponse.json(vacancy);
  } catch (error) {
    console.error('Error fetching vacancy:', error);
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
    const { title, description, requirements, location, salary, employment, isActive } = body;

    if (!title || !description || !location || !employment) {
      return NextResponse.json(
        { error: 'Заголовок, описание, местоположение и тип занятости обязательны' },
        { status: 400 }
      );
    }

    const vacancy = await prisma.vacancy.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        description,
        requirements: requirements || '',
        location,
        salary: salary || null,
        employment,
        isActive: isActive ?? true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(vacancy);
  } catch (error) {
    console.error('Error updating vacancy:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { isActive } = body;

    const vacancy = await prisma.vacancy.update({
      where: { id: resolvedParams.id },
      data: {
        isActive,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(vacancy);
  } catch (error) {
    console.error('Error updating vacancy status:', error);
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

    await prisma.vacancy.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({ message: 'Вакансия удалена' });
  } catch (error) {
    console.error('Error deleting vacancy:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}