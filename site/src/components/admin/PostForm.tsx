'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Eye } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { FileUpload } from './FileUpload';
import { ImagePreview } from './ImagePreview';
import { adminApi } from '@/lib/core';

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    excerpt: string;
    category: 'NEWS' | 'VACANCY' | 'ANNOUNCEMENT' | 'EVENT';
    imageUrl?: string;
    published: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function PostForm({ initialData, onSubmit, isLoading = false }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || 'NEWS' as const,
    imageUrl: initialData?.imageUrl || '',
    published: initialData?.published || false,
    // Поля для вакансий
    location: (initialData as any)?.location || '',
    employmentType: (initialData as any)?.employmentType || '',
    salary: (initialData as any)?.salary || '',
    requirements: (initialData as any)?.requirements || ''
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Поле заголовка обязательно.');
      return;
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      setError('Содержимое статьи обязательно.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Произошла ошибка при сохранении.');
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await adminApi.uploads.image(formData);
    
    if (!result.success) {
      throw new Error(result.error || 'Ошибка при загрузке изображения');
    }
    
    const url = result.data?.filePath || '';
    setFormData(prev => ({ ...prev, imageUrl: url }));
    return url;
  };

  const categoryOptions = [
    { value: 'NEWS', label: 'Новости' },
    { value: 'VACANCY', label: 'Вакансии' },
    { value: 'ANNOUNCEMENT', label: 'Объявления' },
    { value: 'EVENT', label: 'События' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
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
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Введите заголовок..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Краткое описание для предпросмотра..."
                  disabled={isLoading}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {formData.excerpt.length}/160 символов
                </p>
              </div>

              <RichTextEditor
                label="Содержимое *"
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Введите текст статьи..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Настройки публикации */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Категория</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'NEWS' | 'VACANCY' | 'ANNOUNCEMENT' | 'EVENT') => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  disabled={isLoading}
                  className="h-4 w-4"
                />
                <Label htmlFor="published">Опубликовано</Label>
              </div>
            </CardContent>
          </Card>

          {/* Поля для вакансий */}
          {formData.category === 'VACANCY' && (
            <Card>
              <CardHeader>
                <CardTitle>Детали вакансии</CardTitle>
                <CardDescription>
                  Дополнительная информация для вакансии
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Местоположение</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Например: Донецк, Москва"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Тип занятости</Label>
                  <Input
                    id="employmentType"
                    value={formData.employmentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
                    placeholder="Например: Полная занятость, Частичная занятость"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Зарплата</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="Например: 50000-70000 руб."
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Требования</Label>
                  <textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Опишите требования к кандидату..."
                    disabled={isLoading}
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Изображение</CardTitle>
              <CardDescription>
                Загрузите изображение для статьи
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.imageUrl ? (
                <div className="space-y-4">
                  <ImagePreview
                    src={formData.imageUrl}
                    alt={formData.title || 'Изображение статьи'}
                    showRemove
                    onRemove={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    width={300}
                    height={200}
                  />
                </div>
              ) : (
                <FileUpload
                  onFileUpload={handleImageUpload}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  showPreview={false}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {initialData?.id ? 'Сохранить изменения' : 'Создать'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full"
            >
              Назад
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
