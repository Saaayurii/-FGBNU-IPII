import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // @>25@O5< ?>4:;NG5=85 : 1075 40==KE
    await prisma.$queryRaw`SELECT 1`;
    
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp,
      database: 'connected',
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}