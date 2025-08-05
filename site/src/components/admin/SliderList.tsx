'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { ImagePreview } from './ImagePreview';

interface SlideItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface SliderListProps {
  slides: SlideItem[];
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onReorder: (id: string, newOrder: number) => Promise<void>;
  isLoading?: boolean;
}

export function SliderList({
  slides,
  onDelete,
  onToggleActive,
  onReorder,
  isLoading = false,
}: SliderListProps) {
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Удалить слайд "${title}"?`)) {
      await onDelete(id);
    }
  };

  const handleMoveUp = async (slide: SlideItem) => {
    const currentIndex = sortedSlides.findIndex((s) => s.id === slide.id);
    if (currentIndex > 0) {
      const newOrder = sortedSlides[currentIndex - 1].order;
      await onReorder(slide.id, newOrder - 0.5);
    }
  };

  const handleMoveDown = async (slide: SlideItem) => {
    const currentIndex = sortedSlides.findIndex((s) => s.id === slide.id);
    if (currentIndex < sortedSlides.length - 1) {
      const newOrder = sortedSlides[currentIndex + 1].order;
      await onReorder(slide.id, newOrder + 0.5);
    }
  };

  if (sortedSlides.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">Слайдов нет</div>
            <p className="text-sm text-gray-400 mb-4">
              Вы ещё не добавили ни одного слайда. Начните с первого!
            </p>
            <Link href="/admin/slider/create">
              <Button>Создать слайд</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedSlides.map((slide, index) => (
        <Card key={slide.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Изображение */}
              <div className="flex-shrink-0">
                <ImagePreview
                  src={slide.imageUrl}
                  alt={slide.title}
                  width={150}
                  height={100}
                  showDownload
                />
              </div>

              {/* Информация */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {slide.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    {/* Кнопки сортировки */}
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleMoveUp(slide)}
                        disabled={index === 0 || isLoading}
                      >
                        <MoveUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleMoveDown(slide)}
                        disabled={index === sortedSlides.length - 1 || isLoading}
                      >
                        <MoveDown className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Меню действий */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={isLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/slider/${slide.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Редактировать
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            onToggleActive(slide.id, !slide.isActive)
                          }
                        >
                          {slide.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Скрыть
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Показать
                            </>
                          )}
                        </DropdownMenuItem>

                        {slide.link && (
                          <DropdownMenuItem asChild>
                            <Link href={slide.link} target="_blank">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Перейти по ссылке
                            </Link>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() => handleDelete(slide.id, slide.title)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {slide.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {slide.description}
                  </p>
                )}

                <div className="flex items-center gap-4 flex-wrap">
                  <Badge
                    variant={slide.isActive ? 'default' : 'secondary'}
                    className={
                      slide.isActive ? 'bg-green-100 text-green-800' : ''
                    }
                  >
                    {slide.isActive ? 'Активен' : 'Неактивен'}
                  </Badge>

                  <div className="text-xs text-gray-500">
                    Порядок: {slide.order}
                  </div>

                  <div className="text-xs text-gray-500">
                    Создан: {new Date(slide.createdAt).toLocaleDateString('ru-RU')}
                  </div>

                  {slide.link && (
                    <div className="text-xs text-blue-600 truncate max-w-xs">
                      {slide.link}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
