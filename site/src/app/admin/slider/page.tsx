"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Image as ImageIcon,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const mockSlides = [
  {
    id: 1,
    title: "Конференция молодых учёных 2024",
    description:
      "Приглашаем принять участие в конференции молодых учёных 2024 года",
    imageUrl: "/api/placeholder/800/400",
    isActive: true,
    order: 1,
    createdAt: "2024-01-15",
    link: "/news/conference-2024",
  },
  {
    id: 2,
    title: "Программа грантов 2024",
    description:
      "Актуальная информация о программе грантов для молодых исследователей",
    imageUrl: "/api/placeholder/800/400",
    isActive: true,
    order: 2,
    createdAt: "2024-01-20",
    link: "/programs/grants",
  },
  {
    id: 3,
    title: "Летняя школа 2024",
    description: "Запись на летнюю школу для молодых учёных и аспирантов",
    imageUrl: "/api/placeholder/800/400",
    isActive: false,
    order: 3,
    createdAt: "2024-02-01",
    link: "/events/summer-school",
  },
];

export default function SliderPage() {
  const { 0: slides, 1: setSlides } = useState(mockSlides);

  const activeSlides = slides.filter((slide) => slide.isActive).length;
  const totalSlides = slides.length;

  const handleToggleActive = (id: number) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === id ? { ...slide, isActive: !slide.isActive } : slide
      )
    );
  };

  const handleDelete = (id: number) => {
    setSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const handleMoveUp = (id: number) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === id);
      if (index > 0) {
        const newSlides = [...prev];
        [newSlides[index], newSlides[index - 1]] = [
          newSlides[index - 1],
          newSlides[index],
        ];
        return newSlides.map((slide, idx) => ({ ...slide, order: idx + 1 }));
      }
      return prev;
    });
  };

  const handleMoveDown = (id: number) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === id);
      if (index < prev.length - 1) {
        const newSlides = [...prev];
        [newSlides[index], newSlides[index + 1]] = [
          newSlides[index + 1],
          newSlides[index],
        ];
        return newSlides.map((slide, idx) => ({ ...slide, order: idx + 1 }));
      }
      return prev;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Слайды</h1>
          <p className="text-gray-600 mt-1">
            Управление слайдами для главной страницы
          </p>
        </div>
        <Link href="/admin/slider/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить слайд
          </Button>
        </Link>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего слайдов</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlides}</div>
            <p className="text-xs text-muted-foreground">
              Общее количество слайдов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные слайды
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSlides}</div>
            <p className="text-xs text-muted-foreground">
              Слайды, которые отображаются
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Неактивные слайды
            </CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSlides - activeSlides}
            </div>
            <p className="text-xs text-muted-foreground">
              Слайды, которые не отображаются
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Список слайдов */}
      <Card>
        <CardHeader>
          <CardTitle>Список слайдов</CardTitle>
          <CardDescription>
            Управление слайдами, их порядком и статусом
          </CardDescription>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2 text-gray-500">
                Нет слайдов
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Вы можете добавить слайд для отображения на главной странице
              </p>
              <Link href="/admin/slider/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить слайд
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div key={slide.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Превью картинки */}
                    <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/128/80";
                        }}
                      />
                    </div>

                    {/* Информация о слайде */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {slide.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {slide.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Порядок: {slide.order}</span>
                            <span>
                              Дата создания:{" "}
                              {new Date(slide.createdAt).toLocaleDateString(
                                "ru-RU"
                              )}
                            </span>
                            {slide.link && <span>Ссылка: {slide.link}</span>}
                          </div>
                        </div>

                        {/* Управление слайдом */}
                        <div className="flex items-center gap-2 ml-4">
                          <Badge
                            variant={slide.isActive ? "default" : "secondary"}
                            className={
                              slide.isActive
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {slide.isActive ? "Активен" : "Не активен"}
                          </Badge>

                          {/* Кнопки поднять/опустить */}
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveUp(slide.id)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveDown(slide.id)}
                              disabled={index === slides.length - 1}
                            >
                              <MoveDown className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Меню с действиями */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
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
                                onClick={() => handleToggleActive(slide.id)}
                              >
                                {slide.isActive ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Деактивировать
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Активировать
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={slide.link || "#"} target="_blank">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Просмотреть
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(slide.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Информация по картинкам */}
      <Card>
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Все слайды, которые вы добавляете, будут отображаться на главной
              странице.
            </p>
            <p>Рекомендуемый размер изображения: примерно 1200x600 пикселей.</p>
            <p>
              Активные слайды отображаются посетителям сайта, неактивные скрыты.
            </p>
            <p>
              Вы можете менять порядок слайдов с помощью стрелок вверх и вниз.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
