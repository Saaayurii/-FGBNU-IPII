import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Простой запрос для проверки подключения
    await prisma.$queryRaw`SELECT 1 as status`;
    
    return NextResponse.json({ 
      status: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json({ 
      status: 'error',
      error: error.message || 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}