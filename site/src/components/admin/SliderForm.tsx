'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { ImagePreview } from './ImagePreview';
import { adminApi } from '@/lib/core';

interface SliderFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
    isActive: boolean;
    order: number;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
    isActive: boolean;
    order: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function SliderForm({ initialData, onSubmit, isLoading = false }: SliderFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    link: initialData?.link || '',
    isActive: initialData?.isActive ?? true,
    order: initialData?.order || 1
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Поле "Заголовок" обязательно для заполнения.');
      return;
    }

    if (!formData.imageUrl) {
      setError('Пожалуйста, загрузите изображение.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Произошла ошибка при сохранении. Попробуйте снова.');
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);

    const result = await adminApi.uploads.slider(form);

    if (!result.success) {
      throw new Error(result.error || 'Ошибка при загрузке изображения');
    }

    const url = result.data?.filePath || '';
    setFormData(prev => ({ ...prev, imageUrl: url }));
    return url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Введите заголовок..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Введите описание..."
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Ссылка</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="Например: /news/example или https://example.com"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Порядок</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        order: parseInt(e.target.value) || 1
                      }))
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, isActive: e.target.checked }))
                    }
                    disabled={isLoading}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Активен</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Изображение *</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.imageUrl ? (
                <div className="space-y-4">
                  <ImagePreview
                    src={formData.imageUrl}
                    alt={formData.title || 'Слайд'}
                    showRemove
                    onRemove={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    width={400}
                    height={250}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Рекомендуемый размер: 1200x600 пикселей
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileUpload
                    onFileUpload={handleImageUpload}
                    accept="image/*"
                    maxSize={10 * 1024 * 1024} // 10MB
                    showPreview={false}
                  />
                  <p className="text-xs text-muted-foreground">
                    Рекомендуемый размер: 1200x600 пикселей
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Отмена
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {initialData?.id ? 'Сохранить изменения' : 'Создать слайд'}
        </Button>
      </div>
    </form>
  );
}
