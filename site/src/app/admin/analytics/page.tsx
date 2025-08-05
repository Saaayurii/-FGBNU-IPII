'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, Eye, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  return (
   
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600 mt-1">
            Детальная аналитика посещаемости и активности на сайте
          </p>
        </div>

        {/* Общая статистика */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Общая статистика
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Всего посетителей
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% с прошлого месяца
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Просмотры страниц
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,678</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% с прошлого месяца
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Опубликовано новостей
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +8 в этом месяце
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Подписчиков
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  +12 в этом месяце
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* График посещаемости */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Посещаемость за последние 30 дней
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                График посещений
              </CardTitle>
              <CardDescription>
                Количество уникальных посетителей по дням
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    График будет здесь
                  </p>
                  <p className="text-sm text-gray-400">
                    Подключите систему аналитики для отображения графиков
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Популярные страницы */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Популярные страницы</CardTitle>
              <CardDescription>
                Самые посещаемые страницы сайта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Главная страница</p>
                    <p className="text-sm text-gray-500">/</p>
                  </div>
                  <div className="text-sm text-gray-600">1,234 просмотра</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Новости</p>
                    <p className="text-sm text-gray-500">/news</p>
                  </div>
                  <div className="text-sm text-gray-600">567 просмотров</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">О нас</p>
                    <p className="text-sm text-gray-500">/about</p>
                  </div>
                  <div className="text-sm text-gray-600">234 просмотра</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Контакты</p>
                    <p className="text-sm text-gray-500">/contacts</p>
                  </div>
                  <div className="text-sm text-gray-600">123 просмотра</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Активность по времени</CardTitle>
              <CardDescription>
                Время наибольшей активности пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Понедельник</span>
                  </div>
                  <div className="text-sm text-gray-600">18% трафика</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Вторник</span>
                  </div>
                  <div className="text-sm text-gray-600">16% трафика</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Среда</span>
                  </div>
                  <div className="text-sm text-gray-600">15% трафика</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Четверг</span>
                  </div>
                  <div className="text-sm text-gray-600">14% трафика</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}