-- =========================================================================
-- ⚡ НОВЫЕ ТАБЛИЦЫ И ОБНОВЛЕНИЯ ДЛЯ ЛИЧНОГО КАБИНЕТА LS CUSTOMS
-- Выполните этот SQL в Supabase SQL Editor для обновления вашей базы данных.
-- =========================================================================

-- 1. Добавление колонки ролей в таблицу профилей пользователей
-- Поддерживаемые роли: user (пользователь), member (сотрудник), admin (администратор), owner (владелец)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'member', 'admin', 'owner'));

-- 2. Защита роли владельца (Owner) на уровне СУБД PostgreSQL
-- Владельца СТО нельзя удалить, разжаловать или изменить его роль.
CREATE OR REPLACE FUNCTION protect_owner_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Запрещаем изменять роль с 'owner' на любую другую
  IF OLD.role = 'owner' AND NEW.role <> 'owner' THEN
    RAISE EXCEPTION 'Безопасность системы: Нельзя понизить владельца СТО в должности!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION protect_owner_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Запрещаем удаление аккаунтов владельцев
  IF OLD.role = 'owner' THEN
    RAISE EXCEPTION 'Безопасность системы: Нельзя удалить владельца СТО из базы данных!';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Создание триггеров безопасности для таблицы user_profiles
DROP TRIGGER IF EXISTS trg_protect_owner_role ON public.user_profiles;
CREATE TRIGGER trg_protect_owner_role
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION protect_owner_role();

DROP TRIGGER IF EXISTS trg_protect_owner_delete ON public.user_profiles;
CREATE TRIGGER trg_protect_owner_delete
  BEFORE DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION protect_owner_delete();


-- 3. Таблица системы отпусков (для сотрудников 'member' и 'admin')
CREATE TABLE IF NOT EXISTS public.vacations_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT CHECK (char_length(reason) <= 500),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_comment TEXT CHECK (char_length(admin_comment) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 4. Таблица системы отчётности сотрудников (для 'member')
CREATE TABLE IF NOT EXISTS public.employee_reports (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL CHECK (char_length(employee_name) <= 200),
  work_date DATE NOT NULL,
  screenshot_url TEXT NOT NULL CHECK (char_length(screenshot_url) <= 500),
  comment TEXT CHECK (char_length(comment) <= 1000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_comment TEXT CHECK (char_length(admin_comment) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. Включение Row Level Security (RLS) безопасности для новых таблиц
ALTER TABLE public.vacations_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_reports ENABLE ROW LEVEL SECURITY;


-- 6. Настройка политик безопасности RLS для отпусков (vacations_requests)
DROP POLICY IF EXISTS "Users can read own vacations" ON public.vacations_requests;
CREATE POLICY "Users can read own vacations" 
ON public.vacations_requests FOR SELECT 
USING (auth.uid() = user_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can submit vacations" ON public.vacations_requests;
CREATE POLICY "Users can submit vacations" 
ON public.vacations_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update vacations" ON public.vacations_requests;
CREATE POLICY "Admins can update vacations" 
ON public.vacations_requests FOR ALL 
USING (auth.role() = 'authenticated');


-- 7. Настройка политик безопасности RLS для отчетов (employee_reports)
DROP POLICY IF EXISTS "Users can read own reports" ON public.employee_reports;
CREATE POLICY "Users can read own reports" 
ON public.employee_reports FOR SELECT 
USING (auth.uid() = user_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can submit reports" ON public.employee_reports;
CREATE POLICY "Users can submit reports" 
ON public.employee_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update reports" ON public.employee_reports;
CREATE POLICY "Admins can update reports" 
ON public.employee_reports FOR ALL 
USING (auth.role() = 'authenticated');


-- 8. Триггеры обновления дат updated_at для новых таблиц
DROP TRIGGER IF EXISTS update_vacations_requests_updated_at ON public.vacations_requests;
CREATE TRIGGER update_vacations_requests_updated_at BEFORE UPDATE ON public.vacations_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employee_reports_updated_at ON public.employee_reports;
CREATE TRIGGER update_employee_reports_updated_at BEFORE UPDATE ON public.employee_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
