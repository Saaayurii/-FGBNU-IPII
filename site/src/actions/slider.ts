"use server";

import { prisma } from "@/lib/prisma";
import { SliderImage } from "@prisma/client";

export async function getSliderImages(): Promise<SliderImage[]> {
  try {
    // Добавляем повторные попытки подключения
    let retries = 3;
    while (retries > 0) {
      try {
        const images = await prisma.sliderImage.findMany({
          where: {
            active: true
          },
          orderBy: {
            order: 'asc'
          }
        });
        
        return images;
      } catch (dbError: any) {
        retries--;
        if (retries === 0 || !dbError.message?.includes("Can't reach database")) {
          throw dbError;
        }
        console.warn(`Database connection failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
}

export async function createSliderImage(data: {
  title?: string;
  imageUrl: string;
  link?: string;
  order: number;
}) {
  try {
    const sliderImage = await prisma.sliderImage.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        link: data.link,
        order: data.order,
        active: true
      }
    });
    
    return { success: true, data: sliderImage };
  } catch (error) {
    console.error("Error creating slider image:", error);
    return { success: false, error: "Failed to create slider image" };
  }
}

export async function updateSliderImage(id: string, data: {
  title?: string;
  imageUrl?: string;
  link?: string;
  order?: number;
  active?: boolean;
}) {
  try {
    const sliderImage = await prisma.sliderImage.update({
      where: { id },
      data
    });
    
    return { success: true, data: sliderImage };
  } catch (error) {
    console.error("Error updating slider image:", error);
    return { success: false, error: "Failed to update slider image" };
  }
}

export async function deleteSliderImage(id: string) {
  try {
    await prisma.sliderImage.delete({
      where: { id }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting slider image:", error);
    return { success: false, error: "Failed to delete slider image" };
  }
}

// Административные функции для слайдера
export async function getAllSliderImagesForAdmin(): Promise<SliderImage[]> {
  try {
    const images = await prisma.sliderImage.findMany({
      orderBy: {
        order: 'asc'
      }
    });
    
    return images;
  } catch (error) {
    console.error("Error fetching all slider images:", error);
    return [];
  }
}

export async function reorderSliderImages(imageOrders: { id: string; order: number }[]) {
  try {
    // Используем транзакцию для обновления порядка всех изображений
    await prisma.$transaction(
      imageOrders.map(({ id, order }) =>
        prisma.sliderImage.update({
          where: { id },
          data: { order }
        })
      )
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error reordering slider images:", error);
    return { success: false, error: "Failed to reorder slider images" };
  }
}

export async function bulkDeleteSliderImages(ids: string[]) {
  try {
    const result = await prisma.sliderImage.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error bulk deleting slider images:", error);
    return { success: false, error: "Failed to delete slider images" };
  }
}

export async function bulkToggleSliderImagesStatus(ids: string[], active: boolean) {
  try {
    const result = await prisma.sliderImage.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        active
      }
    });
    
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error bulk toggling slider images status:", error);
    return { success: false, error: "Failed to toggle slider images status" };
  }
}

export async function getSliderStats() {
  try {
    const totalImages = await prisma.sliderImage.count();
    const activeImages = await prisma.sliderImage.count({
      where: { active: true }
    });
    const inactiveImages = totalImages - activeImages;

    return {
      totalImages,
      activeImages,
      inactiveImages
    };
  } catch (error) {
    console.error("Error fetching slider stats:", error);
    return {
      totalImages: 0,
      activeImages: 0,
      inactiveImages: 0
    };
  }
}