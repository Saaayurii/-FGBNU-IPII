import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const imagePath = resolvedParams.path.join('/');
    
    // Безопасность: проверяем, что путь не содержит попыток выхода за пределы директории
    if (imagePath.includes('../') || imagePath.includes('..\\')) {
      return NextResponse.json({ error: 'Не правильный путь' }, { status: 400 });
    }

    const fullPath = join(process.cwd(), 'public/uploads', imagePath);
    
    // Проверяем существование файла
    try {
      await access(fullPath, constants.F_OK);
    } catch {
      return NextResponse.json({ error: 'Изображение не найдено' }, { status: 404 });
    }

    // Читаем файл
    const imageBuffer = await readFile(fullPath);
    
    // Определяем MIME тип по расширению файла
    const extension = imagePath.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Возвращаем изображение с правильными заголовками
    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}