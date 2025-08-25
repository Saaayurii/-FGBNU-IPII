'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X, Eye, Download } from 'lucide-react';
import { apiCore } from '@/lib/core';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onRemove?: () => void;
  showRemove?: boolean;
  showDownload?: boolean;
}

export function ImagePreview({ 
  src, 
  alt, 
  className = '',
  width = 200,
  height = 150,
  onRemove,
  showRemove = false,
  showDownload = false
}: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = async () => {
    try {
      const blob = await apiCore.download(src);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = alt || 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
    }
  };

  if (imageError) {
    return (
      <div 
        className={`relative border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-sm">Не удалось загрузить</div>
          <div className="text-xs mt-1">Попробуйте другое изображение</div>
        </div>
        {showRemove && onRemove && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div 
        className="relative overflow-hidden rounded-lg border"
        style={{ width, height }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="text-sm text-gray-500">Загрузка...</div>
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-opacity duration-200"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImageError(true);
          }}
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              </div>
            </DialogContent>
          </Dialog>

          {showDownload && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showRemove && onRemove && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
