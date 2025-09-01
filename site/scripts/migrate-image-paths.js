const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateImagePaths() {
  try {
    console.log('Начинаем миграцию путей изображений...');
    
    // Обновляем пути в постах
    const posts = await prisma.post.findMany({
      where: {
        imageUrl: {
          startsWith: '/uploads/'
        }
      }
    });
    
    console.log(`Найдено ${posts.length} постов с изображениями`);
    
    for (const post of posts) {
      if (post.imageUrl && post.imageUrl.startsWith('/uploads/')) {
        const newPath = post.imageUrl.replace('/uploads/', '/api/images/');
        await prisma.post.update({
          where: { id: post.id },
          data: { imageUrl: newPath }
        });
        console.log(`Обновлен пост ${post.id}: ${post.imageUrl} -> ${newPath}`);
      }
    }
    
    // Обновляем пути в слайдере
    const sliderImages = await prisma.sliderImage.findMany({
      where: {
        imageUrl: {
          startsWith: '/uploads/'
        }
      }
    });
    
    console.log(`Найдено ${sliderImages.length} изображений слайдера`);
    
    for (const image of sliderImages) {
      if (image.imageUrl && image.imageUrl.startsWith('/uploads/')) {
        const newPath = image.imageUrl.replace('/uploads/', '/api/images/');
        await prisma.sliderImage.update({
          where: { id: image.id },
          data: { imageUrl: newPath }
        });
        console.log(`Обновлено изображение слайдера ${image.id}: ${image.imageUrl} -> ${newPath}`);
      }
    }
    
    console.log('Миграция завершена успешно!');
  } catch (error) {
    console.error('Ошибка при миграции:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateImagePaths();