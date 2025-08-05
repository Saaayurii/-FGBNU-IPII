import { PrismaClient, Role, Category } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создание админа
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
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
      title: 'Важные новости',
      slug: 'vazhnye-novosti-kompanii',
      description: 'Краткое описание важных новостей нашего института',
      content: 'Полный текст новости с подробной информацией о важных событиях в компании.',
      category: Category.NEWS,
      published: true,
      featured: true,
    },
    {
      title: 'Открыта новая вакансия разработчика',
      slug: 'otkryta-novaya-vakansiya-razrabotchika',
      description: 'Ищем талантливого разработчика в нашу команду',
      content: 'Подробное описание вакансии разработчика с требованиями и условиями работы.',
      category: Category.VACANCY,
      published: true,
      featured: false,
    },
    {
      title: 'Объявление о корпоративном мероприятии',
      slug: 'obyavlenie-o-korporativnom-meropriyatii',
      description: 'Приглашаем всех сотрудников на корпоративное мероприятие',
      content: 'Информация о предстоящем корпоративном мероприятии и программе.',
      category: Category.ANNOUNCEMENT,
      published: true,
      featured: false,
    },
  ]

  for (const newsItem of news) {
    await prisma.post.upsert({
      where: { slug: newsItem.slug },
      update: {},
      create: {
        ...newsItem,
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