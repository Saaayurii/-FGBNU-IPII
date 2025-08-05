'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateVacancyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    employment: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Заголовок обязателен для заполнения');
      return;
    }

    if (!formData.description.trim()) {
      setError('Описание обязательно для заполнения');
      return;
    }

    if (!formData.location.trim()) {
      setError('Местоположение обязательно для заполнения');
      return;
    }

    if (!formData.employment) {
      setError('Тип занятости обязателен для заполнения');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Вакансия успешно создана!');
        router.push('/admin/vacancies');
      } else {
        const data = await response.json();
        setError(data.error || 'Не удалось создать вакансию');
      }
    } catch (error) {
      console.error('Error creating vacancy:', error);
      setError('Произошла ошибка при создании вакансии');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/vacancies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к вакансиям
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Создать вакансию
          </h1>
          <p className="text-muted-foreground">
            Добавление новой вакансии в систему
          </p>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Информация о вакансии</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название вакансии *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Например: Младший научный сотрудник"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Местоположение *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="г. Донецк"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment">Тип занятости *</Label>
                  <Select
                    value={formData.employment}
                    onValueChange={(value) =>
                      setFormData(prev => ({ ...prev, employment: value }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип занятости" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Полная занятость">Полная занятость</SelectItem>
                      <SelectItem value="Частичная занятость">Частичная занятость</SelectItem>
                      <SelectItem value="Проектная работа">Проектная работа</SelectItem>
                      <SelectItem value="Стажировка">Стажировка</SelectItem>
                      <SelectItem value="Удаленная работа">Удаленная работа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Зарплата (необязательно)</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, salary: e.target.value }))
                    }
                    placeholder="Например: от 40 000 руб."
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Описание вакансии *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Подробное описание вакансии, обязанности, условия..."
                    required
                    disabled={isLoading}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Требования</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, requirements: e.target.value }))
                    }
                    placeholder="Требования к кандидату: образование, опыт, навыки..."
                    disabled={isLoading}
                    rows={6}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
              <Label htmlFor="isActive">Активная вакансия</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
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
                Создать вакансию
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}