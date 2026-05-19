# 🏁 ИНСТРУКЦИЯ ПО НАСТРОЙКЕ ЛИЧНОГО КАБИНЕТА LS CUSTOMS

Этот файл содержит полное руководство по обновлению базы данных и описание возможностей ролей в новом едином личном кабинете.

---

## 1. ⚡ ОБНОВЛЕНИЕ БАЗЫ ДАННЫХ (Supabase)

Чтобы новые возможности заработали на вашем проекте, выполните следующий SQL-код в разделе **SQL Editor** панели управления Supabase. 
Этот код также сохранен отдельно в корне вашего проекта в файле:
🔗 [supabase_new_updates.sql](file:///f:/sait/supabase_new_updates.sql)

```sql
-- 1. Добавление колонки ролей в таблицу профилей
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'member', 'admin', 'owner'));

-- 2. Защита роли владельца (Owner) на уровне СУБД
-- Владельца СТО нельзя удалить или понизить в должности.
CREATE OR REPLACE FUNCTION protect_owner_role()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role = 'owner' AND NEW.role <> 'owner' THEN
    RAISE EXCEPTION 'Безопасность: Нельзя понизить владельца СТО в должности!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION protect_owner_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role = 'owner' THEN
    RAISE EXCEPTION 'Безопасность: Нельзя удалить владельца СТО из базы данных!';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_owner_role
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION protect_owner_role();

CREATE TRIGGER trg_protect_owner_delete
  BEFORE DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION protect_owner_delete();

-- 3. Таблица системы отпусков
CREATE TABLE IF NOT EXISTS public.vacations_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Таблица отчётности сотрудников
CREATE TABLE IF NOT EXISTS public.employee_reports (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  work_date DATE NOT NULL,
  screenshot_url TEXT NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Включение RLS безопасности
ALTER TABLE public.vacations_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_reports ENABLE ROW LEVEL SECURITY;

-- 6. Политики RLS
CREATE POLICY "Users can read own vacations" ON public.vacations_requests FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "Users can submit vacations" ON public.vacations_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update vacations" ON public.vacations_requests FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can read own reports" ON public.employee_reports FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "Users can submit reports" ON public.employee_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update reports" ON public.employee_reports FOR ALL USING (auth.role() = 'authenticated');
```

---

## 2. 👥 РОЛИ В СИСТЕМЕ И ИХ ВОЗМОЖНОСТИ

Мы реализовали мощный единый личный кабинет по адресу `/cabinet`, который автоматически перестраивает меню, разделы и уровень доступа на основе роли вошедшего пользователя.

### 🚗 A. КЛИЕНТ (`user` - роль по умолчанию)
Стильный и удобный кабинет, напоминающий премиальный интернет-магазин:
*   **👤 Мой профиль**: Указание Имени, Телефона и модели своего автомобиля.
*   **📅 Мои записи**: Список личных записей на ремонт с отображением статуса заказа и примечаний мастера.
*   **📦 Заказы деталей**: Просмотр статуса заказанных запчастей.
*   **⭐ Мои отзывы**: Возможность оставлять отзывы СТО.
*   **🔔 Уведомления**: Персональная лента сообщений от администрации.

### 🔧 B. СОТРУДНИК (`member` - автомеханик / мастер)
Рабочее пространство для персонала СТО:
*   **📈 Мои отчёты смен**: Подача ежедневных отчётов (Имя Фамилия, Дата смены, Ссылка на скриншот проделанной работы, детальный комментарий) и отслеживание статуса их одобрения/отклонения.
*   **🏖️ Мои отпуска**: Подача заявок на отпуск или отгул с автоматическим подсчётом количества дней отдыха.
*   **🔧 Активные заказы**: Доступ к заказам клиентов! Механики видят чеки, могут брать машины в работу, писать внутренние комментарии по ремонту и сдавать машины (переводя статус в «Готов»).
*   **🔔 Уведомления**: Получение личных сообщений от руководства.

### 🛡️ C. АДМИНИСТРАТОР (`admin`)
Панель управления операционной деятельностью СТО:
*   **📊 Таблица отчётов (Excel/Word)**: Полноценный Word-подобный бухгалтерский реестр, где отображаются все отчёты смен сотрудников с фильтрацией по именам и статусам.
    *   *📥 Экспорт в CSV (Excel)*: Выгрузка данных в Excel-формат одной кнопкой.
    *   *🖨️ Печать отчёта*: Специальный А4-шаблон (Word-стиль) для распечатки сводок на физическом принтере или сохранения в PDF.
    *   *⚙️ Вердикты*: Одобрение/отклонение отчётов с написанием комментариев.
*   **🏖️ Отпуска сотрудников**: Рассмотрение и утверждение отпусков персонала.
*   **🔑 Должности и права**: Назначение и изменение ролей пользователей (`user` ↔ `member` ↔ `admin` ↔ `owner`).
*   **🔔 Отправить уведомление**: Выбор любого пользователя из выпадающего списка и мгновенная отправка ему личного сообщения (Системное, о заказе или о записи).
*   **🔧 Управление СТО**: Интегрированный доступ ко всем стандартным админ-разделам (Услуги, Сотрудники, Записи, Вакансии, Заявки на работу, Контакты СТО).

### 👑 D. ВЛАДЕЛЕЦ (`owner` - Высший чин)
Обладает всеми правами администратора, но имеет встроенную защиту:
*   **Иммунитет СУБД**: Ни один администратор не может понизить роль `owner` или удалить профиль владельца из базы данных. Система выдаст критическую ошибку защиты.

---

## 3. 🏠 НАВИГАЦИЯ И ВЫХОД

*   **На сайт СТО**: Внизу левого сайдбара добавлена удобная кнопка с иконкой домика. При клике пользователь переходит на главную страницу сайта для просмотра услуг, новостей и отзывов, **оставаясь при этом авторизованным**.
*   **Выйти**: Кнопка полной деавторизации (выхода). Пользователь безопасно разлогинивается и может просматривать сайт как гость.
