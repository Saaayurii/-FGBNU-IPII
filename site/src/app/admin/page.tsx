"use client";
import { AdminStats } from '@/components/admin/AdminStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Image as ImageIcon, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Панель администратора</h1>
            <p className="text-muted-foreground mt-1">
              Управление новостями, слайдером, подписчиками и рассылками
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/news/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Создать новость
              </Button>
            </Link>
          </div>
        </div>

        {/* Статистика */}
        <AdminStats />

        {/* Быстрые ссылки */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Быстрый доступ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/news/create">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-sm">Новости</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Создавайте и редактируйте новости и публикации
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/slider/create">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <CardTitle className="text-sm">Слайдер</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Управление изображениями в слайдере на главной странице
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/subscribers">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="text-sm">Подписчики</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Просмотр и управление подписчиками рассылки
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/analytics">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    <CardTitle className="text-sm">Рассылки</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Аналитика и управление email-рассылками
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Информационный блок */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Быстрая помощь
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted" />
                <p className="text-lg font-medium mb-2">
                  Добро пожаловать в админ-панель
                </p>
                <p className="text-sm text-muted-foreground">
                  Здесь вы можете управлять контентом сайта, подписчиками и рассылками.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
