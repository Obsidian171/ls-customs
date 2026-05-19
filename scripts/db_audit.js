import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

try {
  const envContent = fs.readFileSync('.env', 'utf8')
  const env = {}
  envContent.split('\n').forEach(line => {
    const parts = line.split('=')
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim()
    }
  })

  const supabaseUrl = env['VITE_SUPABASE_URL']
  const supabaseKey = env['VITE_SUPABASE_ANON_KEY']

  console.log('==================================================')
  console.log('🌐 АУДИТ ПОДКЛЮЧЕНИЯ И СТРУКТУРЫ SUPABASE')
  console.log('==================================================')
  console.log(`URL базы данных: ${supabaseUrl}`)
  console.log(`Ключ доступа (Anon): ${supabaseKey ? supabaseKey.substring(0, 15) + '...' : 'отсутствует'}`)
  console.log('--------------------------------------------------')

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Ошибка: В файле .env отсутствуют переменные Supabase!')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const tables = [
    { name: 'user_profiles', description: 'Профили и роли пользователей' },
    { name: 'services', description: 'Список услуг тюнинга' },
    { name: 'employees', description: 'Коллектив автомехаников' },
    { name: 'bookings', description: 'Записи клиентов на ремонт' },
    { name: 'part_orders', description: 'Заказы запчастей' },
    { name: 'gallery', description: 'Лента новостей и проектов' },
    { name: 'reviews', description: 'Отзывы о СТО' },
    { name: 'vacancies', description: 'Вакансии СТО' },
    { name: 'job_applications', description: 'Заявки на работу' },
    { name: 'contacts', description: 'Контакты и GPS' },
    { name: 'notifications', description: 'Оповещения в кабинете' },
    { name: 'vacations_requests', description: 'Заявки на отпуск' },
    { name: 'employee_reports', description: 'Отчёты смен сотрудников' }
  ]

  console.log('🔎 Проверка доступности таблиц базы данных...')
  console.log('--------------------------------------------------')

  let missingTables = 0

  for (const table of tables) {
    const { error } = await supabase
      .from(table.name)
      .select('*')
      .limit(0)

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('not found') || error.message.includes('does not exist')) {
        console.log(`❌ Таблица [${table.name}] — ОТСУТСТВУЕТ В БД! (${table.description})`);
        missingTables++
      } else {
        console.log(`✅ Таблица [${table.name}] — Существует (RLS активен: ${error.message})`);
      }
    } else {
      console.log(`✅ Таблица [${table.name}] — Существует и доступна (${table.description})`);
    }
  }

  console.log('--------------------------------------------------')
  if (missingTables === 0) {
    console.log('🎉 ОТЛИЧНО! Все необходимые таблицы успешно развернуты в вашей базе данных Supabase!')
  } else {
    console.log(`⚠️ ВНИМАНИЕ: Обнаружено ${missingTables} отсутствующих таблиц.`)
    console.log('Пожалуйста, зайдите в Supabase SQL Editor и выполните файлы:')
    console.log('1. f:/sait/supabase_schema.sql (Базовая схема)')
    console.log('2. f:/sait/supabase_new_updates.sql (Дополнительные таблицы ролей и отпусков)')
  }
  console.log('==================================================')

} catch (err) {
  console.error('Ошибка при запуске скрипта диагностики:', err.message)
}
