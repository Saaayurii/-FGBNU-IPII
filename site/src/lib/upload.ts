import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export const UPLOAD_CONFIG = {
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
  },
  slider: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    quality: 90,
    maxWidth: 1920,
    maxHeight: 800,
  }
};

export async function validateFile(file: File, type: 'images' | 'slider') {
  const config = UPLOAD_CONFIG[type];
  
  // @>25@:0 @07<5@0
  if (file.size > config.maxSize) {
    throw new Error(`$09; A;8H:>< 1>;LH>9. 0:A8<0;L=K9 @07<5@: ${config.maxSize / 1024 / 1024}MB`);
  }
  
  // @>25@:0 B8?0
  if (!config.allowedTypes.includes(file.type)) {
    throw new Error(`5?>445@68205<K9 B8? D09;0.  07@5H5=K: ${config.allowedTypes.join(', ')}`);
  }
  
  return true;
}

export async function generateFileName(originalName: string): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

export async function optimizeImage(
  buffer: ArrayBuffer,
  type: 'images' | 'slider'
): Promise<Buffer> {
  const config = UPLOAD_CONFIG[type];
  
  return await sharp(buffer)
    .resize(config.maxWidth, config.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: config.quality })
    .png({ quality: config.quality })
    .webp({ quality: config.quality })
    .toBuffer();
}

export async function saveFile(
  optimizedBuffer: Buffer,
  fileName: string,
  type: 'images' | 'slider'
): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads', type);
  const filePath = join(uploadDir, fileName);
  
  await writeFile(filePath, optimizedBuffer);
  
  return `/uploads/${type}/${fileName}`;
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fs = require('fs').promises;
    const fullPath = join(process.cwd(), 'public', filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('H81:0 C40;5=8O D09;0:', error);
    return false;
  }
}