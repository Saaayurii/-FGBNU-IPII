import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  transactionOptions: {
    timeout: 30000, // 30 seconds
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Gracefully disconnect on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Хелперы для часто используемых запросов
export const postHelpers = {
  // Получить опубликованные посты
  getPublished: () => prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true, email: true } } },
    orderBy: { publishedAt: 'desc' },
  }),

  // Получить последние новости для главной
  getLatestNews: (limit = 6) => prisma.post.findMany({
    where: { 
      published: true,
      category: { in: ['NEWS', 'ANNOUNCEMENT'] }
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  }),

  // Получить рекомендуемые посты
  getFeatured: () => prisma.post.findMany({
    where: { 
      published: true,
      featured: true 
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
  }),

  // Получить по категории
  getByCategory: (category: string) => prisma.post.findMany({
    where: { 
      published: true,
      category: category as any
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
  }),
}

export const sliderHelpers = {
  // Получить активные изображения слайдера
  getActive: () => prisma.sliderImage.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  }),
}

export const subscriberHelpers = {
  // Получить активных подписчиков
  getActive: () => prisma.subscriber.findMany({
    where: { active: true },
  }),

  // Добавить подписчика
  subscribe: (email: string) => prisma.subscriber.upsert({
    where: { email },
    update: { active: true },
    create: { email },
  }),
}