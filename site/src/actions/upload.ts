"use server";

import { validateFile, generateFileName, optimizeImage, saveFile, deleteFile } from "@/lib/upload";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: "Файл не найден" };
    }

    // Проверка файла на корректность
    await validateFile(file, 'images');

    // Генерация уникального имени файла
    const fileName = await generateFileName(file.name);

    // Получение буфера из файла
    const arrayBuffer = await file.arrayBuffer();

    // Оптимизация изображения
    const optimizedBuffer = await optimizeImage(arrayBuffer, 'images');

    // Сохранение файла
    const filePath = await saveFile(optimizedBuffer, fileName, 'images');

    return {
      success: true,
      data: {
        fileName,
        filePath,
        originalName: file.name,
        size: optimizedBuffer.length,
        type: file.type
      }
    };
  } catch (error) {
    console.error("Ошибка при загрузке изображения:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка загрузки"
    };
  }
}

export async function uploadSliderImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: "Файл не найден" };
    }

    // Проверка файла на корректность
    await validateFile(file, 'slider');

    // Генерация уникального имени файла
    const fileName = await generateFileName(file.name);

    // Получение буфера из файла
    const arrayBuffer = await file.arrayBuffer();

    // Оптимизация изображения
    const optimizedBuffer = await optimizeImage(arrayBuffer, 'slider');

    // Сохранение файла
    const filePath = await saveFile(optimizedBuffer, fileName, 'slider');

    return {
      success: true,
      data: {
        fileName,
        filePath,
        originalName: file.name,
        size: optimizedBuffer.length,
        type: file.type
      }
    };
  } catch (error) {
    console.error("Ошибка при загрузке слайдера:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка загрузки"
    };
  }
}

export async function deleteUploadedFile(filePath: string) {
  try {
    const deleted = await deleteFile(filePath);
    
    if (deleted) {
      return { success: true };
    } else {
      return { success: false, error: "Не удалось удалить файл" };
    }
  } catch (error) {
    console.error("Ошибка удаления файла:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка удаления"
    };
  }
}

export async function uploadMultipleImages(formData: FormData) {
  try {
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return { success: false, error: "Файлы не найдены" };
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        // Проверка файла
        await validateFile(file, 'images');

        // Генерация имени
        const fileName = await generateFileName(file.name);

        // Получение буфера
        const arrayBuffer = await file.arrayBuffer();

        // Оптимизация
        const optimizedBuffer = await optimizeImage(arrayBuffer, 'images');

        // Сохранение
        const filePath = await saveFile(optimizedBuffer, fileName, 'images');

        results.push({
          fileName,
          filePath,
          originalName: file.name,
          size: optimizedBuffer.length,
          type: file.type
        });
      } catch (fileError) {
        errors.push({
          fileName: file.name,
          error: fileError instanceof Error ? fileError.message : "Неизвестная ошибка при загрузке файла"
        });
      }
    }

    return {
      success: true,
      data: {
        uploaded: results,
        errors: errors,
        totalUploaded: results.length,
        totalErrors: errors.length
      }
    };
  } catch (error) {
    console.error("Ошибка при загрузке нескольких изображений:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка при загрузке нескольких файлов"
    };
  }
}
