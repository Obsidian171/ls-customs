-- =========================================================================
-- ⚡ LS CUSTOMS — ИСПРАВЛЕНИЕ РОЛЕЙ И БЛОКИРОВКА ПОЛЬЗОВАТЕЛЕЙ (MIGRATION)
-- Выполните этот SQL в Supabase SQL Editor для применения изменений!
-- =========================================================================

-- 1. Добавление колонки блокировки в таблицу профилей пользователей
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Обновленная функция защиты ролей (с поддержкой SQL Editor / auth.uid() IS NULL)
CREATE OR REPLACE FUNCTION protect_role_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Если роль пытается изменить человек через API, который НЕ является админом/владельцем, сбрасываем роль на старую
  IF NEW.role <> OLD.role AND auth.uid() IS NOT NULL AND NOT public.is_admin_or_owner(auth.uid()) THEN
    NEW.role = OLD.role;
  END IF;
  
  -- Никто (даже админ) не может понизить владельца или сделать кого-то владельцем, кроме самого владельца
  -- Это ограничение применяется только если изменения вносятся через API (auth.uid() IS NOT NULL)
  IF (OLD.role = 'owner' AND NEW.role <> 'owner') OR (NEW.role = 'owner' AND OLD.role <> 'owner') THEN
    IF auth.uid() IS NOT NULL AND public.get_user_role(auth.uid()) <> 'owner' THEN
      RAISE EXCEPTION 'Безопасность системы: Права владельца неприкосновенны!';
    END IF;
  END IF;

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Пропускаем ошибки для внутренних системных вызовов
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Пересоздаем триггер безопасности
DROP TRIGGER IF EXISTS trg_protect_role_update_advanced ON public.user_profiles;
CREATE TRIGGER trg_protect_role_update_advanced
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION protect_role_update();

-- 4. Обновим политику обновления профилей администраторами, чтобы можно было банить и удалять
DROP POLICY IF EXISTS "admin_profiles_all_secure" ON public.user_profiles;
CREATE POLICY "admin_profiles_all_secure" ON public.user_profiles FOR ALL USING (
  public.is_admin_or_owner(auth.uid())
);
