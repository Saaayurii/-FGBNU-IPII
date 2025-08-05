"use client"
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Основная часть футера */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Информация об институте */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">ФГБНУ ИПИИ</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Федеральное государственное бюджетное научное учреждение 
              «Институт проблем искусственного интеллекта»
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>г. Донецк, ул. Артема, 118Б</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>+7 (XXX) XXX-XX-XX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>info@ipii-ai.ru</span>
              </div>
            </div>
          </div>

          {/* Навигация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Навигация</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white text-sm transition-colors">Главная</a></li>
              <li><a href="#news" className="text-slate-300 hover:text-white text-sm transition-colors">Новости</a></li>
              <li><a href="#vacancies" className="text-slate-300 hover:text-white text-sm transition-colors">Вакансии</a></li>
              <li><a href="/admin" className="text-slate-300 hover:text-white text-sm transition-colors">Админ-панель</a></li>
            </ul>
          </div>

          {/* Лаборатория ИИ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">ЛИСАД</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Лаборатория интеллектуальных систем и анализа данных
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Компьютерное зрение</li>
              <li>• Навигация роботов</li>
              <li>• Нейронные сети</li>
              <li>• Анализ данных</li>
            </ul>
          </div>

          {/* Подписка на новости */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Подписка на новости</h3>
            <p className="text-slate-300 text-sm">
              Получайте последние новости и обновления о нашей деятельности
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                autoComplete="email"
                suppressHydrationWarning
              />
              <Button className="w-full bg-primary hover:bg-primary/90">
                Подписаться
              </Button>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="py-8 border-t border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Режим работы</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Понедельник - Пятница: 9:00 - 18:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Суббота - Воскресенье: Выходные</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Полезные ссылки</h4>
              <div className="space-y-2">
                <a 
                  href="https://minobrnauki.gov.ru" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Министерство науки и высшего образования РФ
                </a>
                <a 
                  href="https://ras.ru" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Российская академия наук
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 ФГБНУ ИПИИ. Все права защищены.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}