# 🔧 LS Auto Shop — СТО San Andreas

Современный веб-сайт автосервиса в стиле GTA San Andreas с полным функционалом записи, заказа деталей, галереей работ и скрытой админкой.

## ✨ Возможности

### Публичная часть
- 🏠 **Главная** — hero-секция с анимациями, статистика, призыв к действию
- 🔧 **Услуги** — каталог с фильтрацией по категориям
- 👥 **Коллектив** — карточки сотрудников с фото и описанием
- 📅 **Запись** — форма записи на ремонт с rate-limit защитой
- 📦 **Детали** — заказ запчастей с указанием авто
- 🖼 **Галерея** — фото работ с lightbox и фильтрами
- ⭐ **Отзывы** — отзывы клиентов с модерацией
- 📞 **Контакты** — Discord, Telegram, телефон, карта
- 💼 **Вакансии** — открытые позиции с формой отклика

### Админка (скрытая)
- 🔐 Вход через Supabase Auth
- 📊 CRUD для всех 9 таблиц:
  - Услуги
  - Сотрудники
  - Записи на ремонт
  - Заказы деталей
  - Галерея
  - Отзывы (с модерацией)
  - Вакансии
  - Заявки на работу
  - Контакты

### Безопасность
- ✅ Rate-limit на все формы (localStorage)
- ✅ Санитизация всех входных данных
- ✅ Supabase RLS (Row Level Security)
- ✅ Параметризованные запросы (защита от SQL-инъекций)
- ✅ CSP заголовки в HTML
- ✅ Скрытый путь админки через env

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка Supabase

1. Создай проект на [supabase.com](https://supabase.com)
2. Выполни SQL из `supabase_schema.sql` в SQL Editor
3. Создай пользователя в Authentication → Users

### 3. Настройка переменных окружения

Скопируй `.env.example` в `.env` и заполни:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_SECRET=your-secret-path
```

### 4. Запуск

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production
npm run preview
```

## 🎨 Дизайн

- **Стиль**: GTA San Andreas / West Coast
- **Цвета**: Синий (#1a6bcc), Фиолетовый (#9d4edd), Золотой (#f0c040)
- **Шрифты**: Oswald (заголовки), Roboto (текст), Pricedown (GTA-стиль)
- **Эффекты**: Градиенты, тени, анимации, glassmorphism

## 📁 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Страницы
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── Team.tsx
│   ├── Booking.tsx
│   ├── Parts.tsx
│   ├── Gallery.tsx
│   ├── Reviews.tsx
│   ├── Contacts.tsx
│   ├── Vacancies.tsx
│   └── admin/          # Админка
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       └── sections/   # CRUD-секции
├── lib/                # Утилиты
│   ├── supabase.ts     # Supabase клиент
│   ├── rateLimit.ts    # Rate limiting
│   └── sanitize.ts     # Санитизация данных
├── types/              # TypeScript типы
└── index.css           # Глобальные стили
```

## 🔒 Доступ к админке

URL: `https://your-site.com/{VITE_ADMIN_SECRET}/login`

Пример: если `VITE_ADMIN_SECRET=x-panel`, то админка по адресу `/x-panel/login`

## 📊 База данных (Supabase)

### Таблицы
- `services` — услуги
- `employees` — сотрудники
- `bookings` — записи на ремонт
- `part_orders` — заказы деталей
- `gallery` — галерея работ
- `reviews` — отзывы (с полем `approved`)
- `vacancies` — вакансии
- `job_applications` — заявки на работу
- `contacts` — контактная информация

### RLS Policies
- Публичное чтение (кроме неодобренных отзывов)
- Публичная запись в формы
- Полный доступ для авторизованных (admin)

## 🛡️ Rate Limits

| Форма | Лимит |
|-------|-------|
| Запись на ремонт | 3 заявки / час |
| Заказ деталей | 3 заявки / час |
| Отзывы | 2 отзыва / сутки |
| Вакансии | 2 заявки / сутки |
| Вход в админку | 5 попыток / 15 мин |

## 🔧 Технологии

- **Frontend**: React 19 + TypeScript
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Build**: Vite 6
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **Styling**: CSS Modules + Custom CSS

## 📝 Лицензия

Проект создан для SAMP сервера. Все права защищены.

## 🤝 Поддержка

Для вопросов и предложений:
- Discord: discord.gg/ls-auto
- Telegram: @ls_auto_shop
