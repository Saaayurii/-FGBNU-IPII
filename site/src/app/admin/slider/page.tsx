"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Upload,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllSliderImagesForAdmin, updateSliderImage, deleteSliderImage, createSliderImage, getSliderStats } from "@/actions/slider";
import { DatabaseStatus } from "@/components/DatabaseStatus";
import type { SliderImage } from "@prisma/client";


export default function SliderPage() {
  const [slides, setSlides] = useState<SliderImage[]>([]);
  const [stats, setStats] = useState({ totalImages: 0, activeImages: 0, inactiveImages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<SliderImage | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({ title: '', imageUrl: '', link: '' });

  useEffect(() => {
    loadSlides();
    loadStats();
  }, []);

  const loadSlides = async () => {
    setIsLoading(true);
    const slidesData = await getAllSliderImagesForAdmin();
    setSlides(slidesData);
    setIsLoading(false);
  };

  const loadStats = async () => {
    const statsData = await getSliderStats();
    setStats(statsData);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const result = await updateSliderImage(id, { active: !currentActive });
    if (result.success) {
      await loadSlides();
      await loadStats();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот слайд?')) {
      const result = await deleteSliderImage(id);
      if (result.success) {
        await loadSlides();
        await loadStats();
      }
    }
  };

  const handleMoveUp = async (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id);
    if (index > 0) {
      const currentSlide = slides[index];
      const prevSlide = slides[index - 1];
      
      await updateSliderImage(currentSlide.id, { order: prevSlide.order });
      await updateSliderImage(prevSlide.id, { order: currentSlide.order });
      
      await loadSlides();
    }
  };

  const handleMoveDown = async (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id);
    if (index < slides.length - 1) {
      const currentSlide = slides[index];
      const nextSlide = slides[index + 1];
      
      await updateSliderImage(currentSlide.id, { order: nextSlide.order });
      await updateSliderImage(nextSlide.id, { order: currentSlide.order });
      
      await loadSlides();
    }
  };

  const handleCreateSlide = async () => {
    if (!newSlide.imageUrl) return;
    
    const result = await createSliderImage({
      title: newSlide.title,
      imageUrl: newSlide.imageUrl,
      link: newSlide.link || undefined,
      order: slides.length + 1,
    });
    
    if (result.success) {
      setNewSlide({ title: '', imageUrl: '', link: '' });
      setIsCreateDialogOpen(false);
      await loadSlides();
      await loadStats();
    }
  };

  const handleEditSlide = async () => {
    if (!editingSlide) return;
    
    const result = await updateSliderImage(editingSlide.id, {
      title: editingSlide.title || undefined,
      imageUrl: editingSlide.imageUrl,
      link: editingSlide.link || undefined,
    });
    
    if (result.success) {
      setEditingSlide(null);
      await loadSlides();
    }
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
        <div className="flex items-center gap-3">
          <DatabaseStatus />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-gray-700 to-slate-600 hover:from-gray-800 hover:to-slate-700">
                <Plus className="h-4 w-4 mr-2" />
                Добавить слайд
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Добавить новый слайд</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  placeholder="Введите заголовок слайда"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL изображения</Label>
                <div className="space-y-3">
                  <Input
                    id="imageUrl"
                    value={newSlide.imageUrl}
                    onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg или выберите файл ниже"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setNewSlide({ ...newSlide, imageUrl: url });
                        }
                      }}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <Upload className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Или загрузите изображение с компьютера</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Рекомендуемый размер: 1200x600 пикселей</p>
                </div>
              </div>
              <div>
                <Label htmlFor="link">Ссылка (опционально)</Label>
                <Input
                  id="link"
                  value={newSlide.link}
                  onChange={(e) => setNewSlide({ ...newSlide, link: e.target.value })}
                  placeholder="/news/example"
                />
              </div>
              {newSlide.imageUrl && (
                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={newSlide.imageUrl}
                    alt="Превью"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/400/200";
                    }}
                  />
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
                <Button onClick={handleCreateSlide} disabled={!newSlide.imageUrl}>
                  <Save className="h-4 w-4 mr-2" />
                  Создать слайд
                </Button>
              </div>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего слайдов</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImages}</div>
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
            <div className="text-2xl font-bold">{stats.activeImages}</div>
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
            <div className="text-2xl font-bold">{stats.inactiveImages}</div>
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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Загрузка слайдов...</p>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2 text-gray-500">
                Нет слайдов
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Вы можете добавить слайд для отображения на главной странице
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить слайд
              </Button>
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
                        alt={slide.title || "Слайд"}
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
                            variant={slide.active ? "default" : "secondary"}
                            className={
                              slide.active
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {slide.active ? "Активен" : "Не активен"}
                          </Badge>

                          {/* Кнопки поднять/опустить */}
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveUp(slide.id)}
                              disabled={index === 0 || isLoading}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveDown(slide.id)}
                              disabled={index === slides.length - 1 || isLoading}
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
                              <DropdownMenuItem
                                onClick={() => setEditingSlide(slide)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(slide.id, slide.active)}
                              >
                                {slide.active ? (
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
                              {slide.link && (
                                <DropdownMenuItem asChild>
                                  <Link href={slide.link} target="_blank">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Просмотреть
                                  </Link>
                                </DropdownMenuItem>
                              )}
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

      {/* Диалог редактирования слайда */}
      <Dialog open={!!editingSlide} onOpenChange={(open) => !open && setEditingSlide(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать слайд</DialogTitle>
          </DialogHeader>
          {editingSlide && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Заголовок</Label>
                <Input
                  id="edit-title"
                  value={editingSlide.title || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value || null })}
                  placeholder="Введите заголовок слайда"
                />
              </div>
              <div>
                <Label htmlFor="edit-imageUrl">URL изображения</Label>
                <div className="space-y-3">
                  <Input
                    id="edit-imageUrl"
                    value={editingSlide.imageUrl}
                    onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg или выберите файл ниже"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setEditingSlide({ ...editingSlide, imageUrl: url });
                        }
                      }}
                      className="hidden"
                      id="editImageUpload"
                    />
                    <label
                      htmlFor="editImageUpload"
                      className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <Upload className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Или загрузите новое изображение</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Рекомендуемый размер: 1200x600 пикселей</p>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-link">Ссылка (опционально)</Label>
                <Input
                  id="edit-link"
                  value={editingSlide.link || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, link: e.target.value })}
                  placeholder="/news/example"
                />
              </div>
              {editingSlide.imageUrl && (
                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={editingSlide.imageUrl}
                    alt="Превью"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/400/200";
                    }}
                  />
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingSlide(null)}>
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
                <Button onClick={handleEditSlide}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
