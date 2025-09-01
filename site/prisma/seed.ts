import { PrismaClient, Role, Category } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

import { createHash } from 'crypto';

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Создаем хэш из заголовка для уникальности
  const hash = createHash('md5').update(title + Date.now().toString()).digest('hex').substring(0, 8);
  const slug = `${baseSlug}-${hash}`;
  
  // Проверяем уникальность
  const existing = await prisma.post.findUnique({
    where: { slug }
  });
  
  if (!existing) {
    return slug;
  }
  
  // Если вдруг коллизия, добавляем timestamp
  return `${baseSlug}-${hash}-${Date.now()}`;
}

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создание админа
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Администратор',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log('✅ Администратор создан:', admin.email)

  // Создание тестовых новостей
  const news = [
    {
      title: 'Важные новости компании',
      description: 'Краткое описание важных новостей нашего института',
      content: 'Полный текст новости с подробной информацией о важных событиях в компании. Мы рады сообщить о новых достижениях и планах развития нашего института.',
      category: Category.NEWS,
      published: true,
      featured: true,
    },
    {
      title: 'Открыта вакансия младшего научного сотрудника',
      description: 'Ищем талантливого исследователя в нашу команду',
      content: 'Подробное описание вакансии младшего научного сотрудника. Требования: высшее образование, опыт исследований, знание Python. Мы предлагаем интересные проекты и возможности для профессионального роста.',
      category: Category.VACANCY,
      published: true,
      featured: false,
    },
    {
      title: 'Объявление о научной конференции',
      description: 'Приглашаем всех сотрудников на научную конференцию',
      content: 'Информация о предстоящей научной конференции и программе. Будут представлены последние исследования в области искусственного интеллекта и машинного обучения.',
      category: Category.ANNOUNCEMENT,
      published: true,
      featured: false,
    },
  ]

  for (const newsItem of news) {
    const slug = await generateUniqueSlug(newsItem.title);
    await prisma.post.create({
      data: {
        ...newsItem,
        slug,
        authorId: admin.id,
        publishedAt: new Date(),
      },
    })
  }

  console.log('✅ Тестовые новости созданы')

  // Создание тестовых изображений слайдера
  const sliderImages = [
    {
      title: 'Добро пожаловать на наш сайт',
      imageUrl: '/uploads/slider/welcome.jpg',
      order: 1,
      active: true,
    },
    {
      title: 'Наши достижения',
      imageUrl: '/uploads/slider/achievements.jpg',
      order: 2,
      active: true,
    },
  ]

  for (const image of sliderImages) {
    await prisma.sliderImage.create({
      data: image,
    })
  }

  console.log('✅ Тестовые изображения слайдера созданы')

  // Создание тестовых подписчиков
  const subscribers = [
    'user1@example.com',
    'user2@example.com',
    'user3@example.com',
  ]

  for (const email of subscribers) {
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })
  }

  console.log('✅ Тестовые подписчики созданы')

  console.log('🎉 Заполнение базы данных завершено!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })