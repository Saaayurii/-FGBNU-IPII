'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Calendar, MapPin, Edit, Trash2, Search, Filter, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { adminApi } from '@/lib/core';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary?: string;
  employment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchVacancies();
  }, []);

  useEffect(() => {
    let filtered = vacancies;
    
    if (searchTerm) {
      filtered = filtered.filter(vacancy => 
        vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vacancy => 
        statusFilter === 'active' ? vacancy.isActive : !vacancy.isActive
      );
    }
    
    setFilteredVacancies(filtered);
  }, [vacancies, searchTerm, statusFilter]);

  const fetchVacancies = async () => {
    try {
      const data = await adminApi.vacancies.getAll();
      setVacancies(data);
      setFilteredVacancies(data);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      toast.error('Произошла ошибка при загрузке вакансий');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.vacancies.delete(id);
      toast.success('Вакансия удалена');
      fetchVacancies();
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      toast.error('Произошла ошибка при удалении вакансии');
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await adminApi.vacancies.toggleStatus(id, { isActive: !isActive });
      toast.success(`Вакансия ${!isActive ? 'активирована' : 'деактивирована'}`);
      fetchVacancies();
    } catch (error) {
      console.error('Error updating vacancy status:', error);
      toast.error('Произошла ошибка при изменении статуса');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Вакансии</h1>
            <p className="text-muted-foreground">Управление вакансиями института</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = {
    total: vacancies.length,
    active: vacancies.filter(v => v.isActive).length,
    inactive: vacancies.filter(v => !v.isActive).length,
    thisMonth: vacancies.filter(v => {
      const created = new Date(v.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Вакансии</h1>
          <p className="text-muted-foreground">
            Управление вакансиями института
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/vacancies/create">
            <Plus className="h-4 w-4 mr-2" />
            Добавить вакансию
          </Link>
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Всего</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Активные</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">За месяц</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Неактивные</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, описанию или местоположению..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="inactive">Неактивные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredVacancies.length === 0 && !isLoading ? (
        searchTerm || statusFilter !== 'all' ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground text-center mb-4">
                По вашему запросу не найдено ни одной вакансии. Попробуйте изменить критерии поиска.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        ) : vacancies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет вакансий</h3>
            <p className="text-muted-foreground text-center mb-4">
              Вы еще не создали ни одной вакансии. Создайте первую вакансию для привлечения талантов.
            </p>
            <Button asChild>
              <Link href="/admin/vacancies/create">
                <Plus className="h-4 w-4 mr-2" />
                Создать вакансию
              </Link>
            </Button>
          </CardContent>
        </Card>
        ) : null
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Показано {filteredVacancies.length} из {vacancies.length} вакансий
            </p>
          </div>
          {filteredVacancies.map((vacancy) => (
            <Card key={vacancy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                      <Badge 
                        variant={vacancy.isActive ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(vacancy.id, vacancy.isActive)}
                      >
                        {vacancy.isActive ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {vacancy.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="text-sm">
                        {vacancy.employment}
                      </div>
                      {vacancy.salary && (
                        <div className="text-sm font-medium">
                          {vacancy.salary}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/vacancies/${vacancy.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие нельзя отменить. Вакансия &quot;{vacancy.title}&quot; будет удалена навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(vacancy.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {vacancy.description}
                </p>
                {vacancy.requirements && (
                  <div className="text-sm">
                    <span className="font-medium">Требования:</span>
                    <p className="text-muted-foreground line-clamp-2 mt-1">
                      {vacancy.requirements}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}