'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { adminApi } from '@/lib/core';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

export default function CreateNewsletterPage() {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    scheduledAt: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject.trim()) {
      setError('Тема рассылки обязательна для заполнения');
      return;
    }

    if (!formData.content.trim()) {
      setError('Содержание рассылки обязательно для заполнения');
      return;
    }

    setIsLoading(true);

    try {
      const result = await adminApi.newsletters.create(formData);

      if (result.success) {
        toast.success('Рассылка успешно создана!');
        router.push('/admin/newsletter');
      } else {
        setError(result.error || 'Не удалось создать рассылку');
      }
    } catch (error) {
      console.error('Error creating newsletter:', error);
      setError('Произошла ошибка при создании рассылки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/newsletter">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к рассылкам
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Создать рассылку
          </h1>
          <p className="text-muted-foreground">
            Создание новой email рассылки для подписчиков
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Содержание рассылки</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="subject">Тема письма *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Например: Новости института за месяц"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Запланировать отправку (необязательно)</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))
                    }
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Если не указано, рассылка будет сохранена как черновик
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Содержание письма *</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={handleContentChange}
                    placeholder="Введите содержание рассылки..."
                  />
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                      disabled={isLoading}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {showPreview ? 'Скрыть' : 'Предварительный просмотр'}
                    </Button>
                  </div>

                  <div className="flex gap-2">
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
                      Сохранить рассылку
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <strong>Статус:</strong>{' '}
                <span className="text-muted-foreground">
                  {formData.scheduledAt ? 'Запланирована' : 'Черновик'}
                </span>
              </div>
              
              <div className="text-sm">
                <strong>Получатели:</strong>{' '}
                <span className="text-muted-foreground">
                  Все активные подписчики
                </span>
              </div>

              {formData.scheduledAt && (
                <div className="text-sm">
                  <strong>Время отправки:</strong>{' '}
                  <span className="text-muted-foreground">
                    {new Date(formData.scheduledAt).toLocaleString('ru-RU')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {showPreview && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Предварительный просмотр</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="text-sm font-semibold border-b pb-2 mb-3">
                    {formData.subject || 'Без темы'}
                  </div>
                  <div 
                    className="text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.content || '<p class="text-muted-foreground">Содержание не указано</p>' 
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}