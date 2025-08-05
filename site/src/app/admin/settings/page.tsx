'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Database,
  Upload,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="text-gray-600 mt-1">
            Управление настройками сайта и административной панели
          </p>
        </div>

        {/* Общие настройки сайта */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Общие настройки сайта
            </CardTitle>
            <CardDescription>
              Основная информация о сайте и организации
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Название сайта</Label>
                <Input 
                  id="site-title" 
                  placeholder="Совет молодых ученых ИПИИ" 
                  defaultValue="Совет молодых ученых ИПИИ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-url">URL сайта</Label>
                <Input 
                  id="site-url" 
                  placeholder="https://young-scientists.ru" 
                  defaultValue="https://young-scientists.ru"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-description">Описание сайта</Label>
              <Textarea 
                id="site-description" 
                placeholder="Официальный сайт Совета молодых ученых..."
                defaultValue="Официальный сайт Совета молодых ученых Института проблем информатики и искусственного интеллекта"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Контактный email</Label>
                <Input 
                  id="contact-email" 
                  type="email"
                  placeholder="info@young-scientists.ru"
                  defaultValue="info@young-scientists.ru"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Контактный телефон</Label>
                <Input 
                  id="contact-phone" 
                  placeholder="+7 (xxx) xxx-xx-xx"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки уведомлений */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </CardTitle>
            <CardDescription>
              Настройка системы уведомлений и рассылок
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email уведомления</Label>
                <p className="text-sm text-gray-500">
                  Получать уведомления о новых подписчиках и комментариях
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Автоматическая рассылка</Label>
                <p className="text-sm text-gray-500">
                  Автоматически отправлять новости подписчикам
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email администратора</Label>
              <Input 
                id="admin-email" 
                type="email"
                placeholder="admin@young-scientists.ru"
                defaultValue="admin@young-scientists.ru"
              />
            </div>
          </CardContent>
        </Card>

        {/* Настройки безопасности */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>
              Настройки безопасности и доступа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Двухфакторная аутентификация</Label>
                <p className="text-sm text-gray-500">
                  Включить дополнительную защиту для администраторов
                </p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Логирование действий</Label>
                <p className="text-sm text-gray-500">
                  Записывать все действия администраторов
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Время сессии (минуты)</Label>
                <Input 
                  id="session-timeout" 
                  type="number"
                  placeholder="60"
                  defaultValue="60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Макс. попыток входа</Label>
                <Input 
                  id="max-login-attempts" 
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки файлов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Загрузка файлов
            </CardTitle>
            <CardDescription>
              Настройки для загрузки изображений и документов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Максимальный размер файла (МБ)</Label>
                <Input 
                  id="max-file-size" 
                  type="number"
                  placeholder="10"
                  defaultValue="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowed-formats">Разрешенные форматы</Label>
                <Input 
                  id="allowed-formats" 
                  placeholder="jpg, png, gif, pdf, doc, docx"
                  defaultValue="jpg, png, gif, pdf, doc, docx"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Автоматическое сжатие изображений</Label>
                <p className="text-sm text-gray-500">
                  Сжимать изображения при загрузке для экономии места
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Настройки базы данных */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              База данных
            </CardTitle>
            <CardDescription>
              Настройки резервного копирования и обслуживания базы данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Автоматическое резервное копирование</Label>
                <p className="text-sm text-gray-500">
                  Создавать резервные копии базы данных ежедневно
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="backup-time">Время создания резервной копии</Label>
              <Input 
                id="backup-time" 
                type="time"
                defaultValue="03:00"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                Создать резервную копию сейчас
              </Button>
              <Button variant="outline">
                Оптимизировать базу данных
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Кнопка сохранения */}
        <div className="flex justify-end">
          <Button size="lg" className="px-8">
            <Save className="h-4 w-4 mr-2" />
            Сохранить настройки
          </Button>
        </div>
      </div>
  );
}