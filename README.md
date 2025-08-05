# 📰 Сайт совета молодых учёных ФГБНУ ИПИИ

Современный веб-сайт для публикации новостей и вакансий с административной панелью. Построен на Next.js 15 с использованием Server Actions и PostgreSQL.

## 🌟 Функциональность

### Для пользователей
- 🎯 **Главная страница** с интерактивным слайдером
- 📰 **Просмотр новостей** с категоризацией
- 🔍 **Детальный просмотр** новостей в модальном окне
- 📧 **Подписка через Resend(почта)** с автоматической отправкой
- 📱 **Адаптивный дизайн** для всех устройств
- ⚡ **Быстрая навигация** между страницами

### Для администраторов
- 🔐 **Безопасная авторизация** с NextAuth.js
- ✍️ **Создание и редактирование** новостей и вакансий
- 🖼️ **Управление слайдером** с загрузкой изображений
- 📊 **Просмотр подписчиков** и статистики
- 📁 **Загрузка файлов** с автоматической оптимизацией
- 🎨 **Rich text editor** для контента

## 🛠️ Технологический стек

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - статическая типизация
- **Tailwind CSS** - утилитарный CSS фреймворк
- **shadcn/ui** - современные UI компоненты
- **React Hook Form** - управление формами
- **Zod** - валидация данных
- **Lucide React** - иконки

### Backend
- **Next.js Server Actions** - серверная логика
- **Prisma ORM** - работа с базой данных
- **PostgreSQL** (Neon DB) - основная база данных
- **NextAuth.js** - аутентификация
- **bcryptjs** - хеширование паролей

### Дополнительно
- **Resend API** - отправка email
- **Sharp** - оптимизация изображений
- **Swiper** - слайдер компонент
- **React Quill** - rich text editor, для админки inputs
- **Sonner** - уведомления

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ или Bun
- PostgreSQL база данных (рекомендуется Neon DB)
- Аккаунт Resend для email

### Установка

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd news-website
```

2. **Установите зависимости**
```bash
# С Bun (рекомендуется)
bun install

# Или с npm
npm install
```

3. **Настройте переменные окружения**
```bash
cp .env.example .env.local
```

Заполните файл `.env.local`:
```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-32-char-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Resend API
RESEND_API_KEY="your-resend-api-key"

# Admin credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-password"
```

4. **Настройте базу данных**
```bash
# Отправить схему в БД
bunx prisma db push

# Генерировать Prisma клиент
bunx prisma generate

# Заполнить тестовыми данными
bun run db:seed
```

5. **Создайте папки для загрузок**
```bash
mkdir -p public/uploads/images
mkdir -p public/uploads/slider
```

6. **Запустите проект**
```bash
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

```
news-website/
├── src/
│   ├── app/                 # App Router страницы
│   │   ├── admin/          # Административная панель
│   │   ├── news/           # Страницы новостей
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Главная страница
│   ├── components/         # React компоненты
│   │   ├── ui/            # shadcn/ui компоненты
│   │   ├── admin/         # Админские компоненты
│   │   ├── news/          # Компоненты новостей
│   │   └── layout/        # Лейаут компоненты
│   ├── actions/           # Server Actions
│   ├── lib/               # Утилиты и конфигурация
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript типы
├── prisma/
│   ├── schema.prisma      # Схема базы данных
│   └── seed.ts           # Начальные данные
└── public/
    └── uploads/          # Загруженные файлы
```

## 🔧 Скрипты

```bash
# Разработка
bun dev                    # Запуск в режиме разработки
bun build                  # Сборка для продакшена
bun start                  # Запуск продакшен версии

# База данных
bun run db:push           # Обновить схему БД
bun run db:studio         # Открыть Prisma Studio
bun run db:generate       # Генерировать Prisma клиент
bun run db:seed           # Заполнить тестовыми данными
bun run db:reset          # Сбросить БД и заполнить заново

# Линтинг и форматирование
bun run lint              # Проверка кода
bun run lint:fix          # Исправление ошибок
```

## 🎯 Использование

### Административная панель

1. Перейдите на `/admin`
2. Войдите используя credentials из `.env.local`
3. Управляйте контентом через интуитивный интерфейс

**Возможности админки:**
- Создание/редактирование новостей и вакансий
- Управление слайдером главной страницы
- Просмотр и управление подписчиками
- Загрузка и оптимизация изображений

### API Endpoints

```bash
# Аутентификация
POST /api/auth/signin
POST /api/auth/signout

# Загрузка файлов
POST /api/upload/image     # Загрузка изображений для новостей
POST /api/upload/slider    # Загрузка изображений для слайдера

# Newsletter
POST /api/newsletter       # Подписка на новости
```

## 🔒 Безопасность

- Хеширование паролей с bcryptjs
- Валидация данных с Zod
- Безопасная загрузка файлов
- CSRF protection через NextAuth.js
- Санитизация HTML контента
- Rate limiting для API endpoints

## 📱 Адаптивность

Проект полностью адаптивен для:
- 📱 Мобильные устройства (320px+)
- 📱 Планшеты (768px+)
- 💻 Десктопы (1024px+)
- 🖥️ Большие экраны (1440px+)

## 🎨 Кастомизация

### Изменение темы
Измените цвета в `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Добавление новых компонентов
```bash
bunx shadcn@latest add calendar
bunx shadcn@latest add data-table
```

## 🚀 Деплой

### Vercel (рекомендуется)
1. Подключите GitHub репозиторий к Vercel
2. Добавьте переменные окружения в Vercel Dashboard
3. Измените `NEXTAUTH_URL` и `APP_URL` на production URL

### Другие платформы
- Railway
- Netlify
- DigitalOcean App Platform

## 🐛 Troubleshooting

### Частые проблемы

**База данных не подключается:**
```bash
# Проверьте CONNECTION_STRING
bunx prisma db push --preview-feature
```

**Ошибки Prisma:**
```bash
# Очистите и переустановите
rm -rf node_modules/.prisma
bunx prisma generate
```

**Проблемы с загрузкой файлов:**
```bash
# Проверьте права доступа
chmod 755 public/uploads
```

## 📊 Производительность

- ⚡ **Core Web Vitals** оптимизированы
- 🖼️ **Автоматическая оптимизация** изображений
- 📦 **Code splitting** и lazy loading
- 🗄️ **Database indexing** для быстрых запросов
- 🔄 **ISR** для статических страниц

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Коммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Пушьте в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - смотрите файл [LICENSE](LICENSE) для деталей.

## 👥 Авторы

- **Ваше имя** - *Разработчик* - [GitHub](https://github.com/Saaayurii)

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) - за отличный фреймворк
- [shadcn/ui](https://ui.shadcn.com/) - за красивые компоненты
- [Prisma](https://prisma.io/) - за удобную работу с БД
- [Tailwind CSS](https://tailwindcss.com/) - за utility-first CSS

---

⭐ **Поставьте звездочку, если проект оказался полезным!**