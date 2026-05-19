-- LS Auto Shop — Supabase Schema with User Cabinet (West Coast / Lowrider Edition)
-- Выполни этот SQL в Supabase SQL Editor для полной инициализации базы данных

-- 1. Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT CHECK (char_length(full_name) <= 100),
  phone TEXT CHECK (char_length(phone) <= 20),
  car_model TEXT CHECK (char_length(car_model) <= 100),
  avatar_url TEXT CHECK (char_length(avatar_url) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Услуги
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL CHECK (char_length(category) <= 100),
  image_url TEXT CHECK (char_length(image_url) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Сотрудники (Коллектив)
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL CHECK (char_length(first_name) <= 100),
  last_name TEXT NOT NULL CHECK (char_length(last_name) <= 100),
  position TEXT NOT NULL CHECK (char_length(position) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  photo_url TEXT CHECK (char_length(photo_url) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Записи на ремонт
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL CHECK (char_length(client_name) <= 100),
  phone TEXT NOT NULL CHECK (char_length(phone) <= 20),
  email TEXT CHECK (char_length(email) <= 200),
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT CHECK (char_length(preferred_time) <= 20),
  car_model TEXT CHECK (char_length(car_model) <= 100),
  comment TEXT CHECK (char_length(comment) <= 1000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','in_progress','done','cancelled')),
  admin_notes TEXT CHECK (char_length(admin_notes) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Заказы деталей
CREATE TABLE IF NOT EXISTS part_orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL CHECK (char_length(client_name) <= 100),
  phone TEXT NOT NULL CHECK (char_length(phone) <= 20),
  email TEXT CHECK (char_length(email) <= 200),
  part_name TEXT NOT NULL CHECK (char_length(part_name) <= 200),
  car_model TEXT NOT NULL CHECK (char_length(car_model) <= 100),
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  comment TEXT CHECK (char_length(comment) <= 1000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','processing','ordered','arrived','done','cancelled')),
  price NUMERIC(10,2) CHECK (price >= 0),
  admin_notes TEXT CHECK (char_length(admin_notes) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Галерея (Новостная лента проектов)
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  image_url TEXT NOT NULL CHECK (char_length(image_url) <= 500),
  category TEXT NOT NULL CHECK (char_length(category) <= 100),
  description TEXT CHECK (char_length(description) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Отзывы
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL CHECK (char_length(author_name) <= 100),
  text TEXT NOT NULL CHECK (char_length(text) <= 1000),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Вакансии
CREATE TABLE IF NOT EXISTS vacancies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) <= 1000),
  requirements TEXT NOT NULL CHECK (char_length(requirements) <= 1000),
  salary TEXT CHECK (char_length(salary) <= 100),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Заявки на работу
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  vacancy_id INTEGER REFERENCES vacancies(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL CHECK (char_length(applicant_name) <= 100),
  phone TEXT NOT NULL CHECK (char_length(phone) <= 20),
  email TEXT CHECK (char_length(email) <= 200),
  message TEXT CHECK (char_length(message) <= 1000),
  resume_url TEXT CHECK (char_length(resume_url) <= 500),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','reviewed','interview','accepted','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Контакты
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  discord TEXT CHECK (char_length(discord) <= 200),
  telegram TEXT CHECK (char_length(telegram) <= 100),
  phone TEXT CHECK (char_length(phone) <= 50),
  email TEXT CHECK (char_length(email) <= 200),
  address TEXT CHECK (char_length(address) <= 300),
  map_url TEXT CHECK (char_length(map_url) <= 500),
  working_hours TEXT CHECK (char_length(working_hours) <= 200),
  gps TEXT CHECK (char_length(gps) <= 50)
);

-- 11. Уведомления для кабинета
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  type TEXT NOT NULL CHECK (type IN ('booking','part_order','review','system')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) и политики доступа
-- =============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Профили: пользователи видят и меняют свой, админы видят все
CREATE POLICY "user_profiles_select_own" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_update_own" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_insert_own" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_profiles_all" ON user_profiles FOR ALL USING (auth.role() = 'authenticated');

-- Публичные таблицы (чтение разрешено всем)
CREATE POLICY "public_read_services" ON services FOR SELECT USING (true);
CREATE POLICY "public_read_employees" ON employees FOR SELECT USING (true);
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_vacancies" ON vacancies FOR SELECT USING (active = true);
CREATE POLICY "public_read_contacts" ON contacts FOR SELECT USING (true);

-- Заказы и Записи (пользователи видят собственные, админы — все)
CREATE POLICY "users_read_own_bookings" ON bookings FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "users_read_own_part_orders" ON part_orders FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "users_read_own_reviews" ON reviews FOR SELECT USING (auth.uid() = user_id OR is_published = true);

-- Публичное добавление (отправка форм без авторизации)
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_part_orders" ON part_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT WITH CHECK (is_published = false);
CREATE POLICY "public_insert_job_applications" ON job_applications FOR INSERT WITH CHECK (true);

-- Уведомления (только владелец видит и меняет)
CREATE POLICY "users_read_own_notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_update_own_notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "admins_insert_notifications" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Полный административный доступ ко всем таблицам
CREATE POLICY "admin_all_services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_employees" ON employees FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_part_orders" ON part_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_vacancies" ON vacancies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_job_applications" ON job_applications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_notifications" ON notifications FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Триггеры для автоматического обновления updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_part_orders_updated_at BEFORE UPDATE ON part_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Триггер для автоматического создания профиля при регистрации
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
