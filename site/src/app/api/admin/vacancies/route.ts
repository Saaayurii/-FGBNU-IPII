import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vacancies = await prisma.vacancy.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(vacancies);
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        requirements: requirements || '',
        location,
        salary: salary || null,
        employment,
        isActive: isActive ?? true
      }
    });

    return NextResponse.json(vacancy, { status: 201 });
  } catch (error) {
    console.error('Error creating vacancy:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}