/**
 * ⚡ AUTOMATED TAGGER SYNC SCRIPT FOR LS CUSTOMS
 * ----------------------------------------------------
 * Этот скрипт позволяет автоматически импортировать новые посты из профиля
 * LS Customs в TAGGER (https://tagger.gambit-rp.com/pages/LSCustoms) прямо в БД Supabase.
 * 
 * Как запустить:
 * 1. Установите зависимости: npm install dotenv node-fetch
 * 2. Укажите ваши ключи Supabase и Tagger Session Cookie в файле .env:
 *    VITE_SUPABASE_URL=https://ваша-бд.supabase.co
 *    VITE_SUPABASE_ANON_KEY=ваш-анон-ключ
 *    TAGGER_SESSION_COOKIE=значение_куки_session_из_браузера
 * 3. Запустите скрипт: node scripts/tagger_sync.js
 */

const fetch = require('node-fetch');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const TAGGER_COOKIE = process.env.TAGGER_SESSION_COOKIE;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Ошибка: Укажите VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env файле.');
  process.exit(1);
}

if (!TAGGER_COOKIE) {
  console.error('❌ Ошибка: Укажите TAGGER_SESSION_COOKIE в .env файле для обхода Login Wall.');
  process.exit(1);
}

// Вспомогательная функция для расчета точной даты по тексту
function parseRelativeDate(relativeStr) {
  const now = Date.now();
  const cleanStr = relativeStr.toLowerCase();
  
  if (cleanStr.includes('секунд') || cleanStr.includes('только что')) {
    return new Date(now);
  } else if (cleanStr.includes('минут')) {
    const match = cleanStr.match(/(\d+)/);
    const mins = match ? parseInt(match[1]) : 5;
    return new Date(now - mins * 60 * 1000);
  } else if (cleanStr.includes('час')) {
    const match = cleanStr.match(/(\d+)/);
    const hrs = match ? parseInt(match[1]) : 1;
    return new Date(now - hrs * 60 * 60 * 1000);
  } else if (cleanStr.includes('ден') || cleanStr.includes('дня') || cleanStr.includes('дней')) {
    const match = cleanStr.match(/(\d+)/);
    const days = match ? parseInt(match[1]) : 1;
    return new Date(now - days * 24 * 60 * 60 * 1000);
  } else if (cleanStr.includes('вчера')) {
    return new Date(now - 24 * 60 * 60 * 1000);
  } else if (cleanStr.includes('месяц')) {
    const match = cleanStr.match(/(\d+)/);
    const mos = match ? parseInt(match[1]) : 1;
    return new Date(now - mos * 30 * 24 * 60 * 60 * 1000);
  }
  return new Date(now);
}

async function syncTagger() {
  console.log('⏳ Подключение к Tagger...');
  
  try {
    const response = await fetch('https://tagger.gambit-rp.com/pages/LSCustoms', {
      headers: {
        'Cookie': `session=${TAGGER_COOKIE}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    
    if (html.includes('Войти в систему') || response.url.includes('/login')) {
      console.error('❌ Ошибка: TAGGER_SESSION_COOKIE устарел или неверен! Требуется обновить сессию.');
      return;
    }
    
    console.log('✅ Страница успешно загружена. Выполняется парсинг постов...');
    
    // Регулярное выражение для поиска контейнеров постов, текстов, изображений и дат
    // Tagger использует современную React/Vue верстку. Парсим блоки:
    // (Примечание: Скрипт адаптирован под стандартные селекторы постов Tagger)
    
    const posts = [];
    
    // Эвристический парсинг постов по структуре HTML
    const postBlocks = html.split(/class="[^"]*post[^"]*"/g).slice(1);
    
    for (const block of postBlocks) {
      // Ищем текст поста
      const textMatch = block.match(/<div class="[^"]*text[^"]*">([\s\S]*?)<\/div>/i) || 
                        block.match(/<p class="[^"]*">([\s\S]*?)<\/p>/i);
      const text = textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      
      if (!text || text.length < 5) continue;
      
      // Ищем медиа/изображения постов
      const imgMatch = block.match(/src="([^"]*(?:uploads|media|tagger)[^"]*(?:jpg|jpeg|png))"/i) ||
                       block.match(/background-image:\s*url\(['"]?([^'")]+)/i);
      const imageUrl = imgMatch ? imgMatch[1] : null;
      
      // Ищем относительную дату публикации
      const dateMatch = block.match(/(\d+\s+(?:минут|час|дня|дней|месяц)\s+назад|вчера|несколько секунд назад)/i);
      const relativeDate = dateMatch ? dateMatch[1] : 'несколько секунд назад';
      
      // Рассчитываем точную дату
      const exactDate = parseRelativeDate(relativeDate);
      
      // Формируем красивый заголовок
      const firstLine = text.split('\n')[0].trim();
      const title = firstLine.length > 80 ? firstLine.slice(0, 77) + '...' : firstLine;
      
      posts.push({
        title: title || 'Новая публикация',
        description: text,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
        category: 'Тюнинг',
        created_at: exactDate.toISOString()
      });
    }
    
    console.log(`📋 Найденных постов на странице: ${posts.length}`);
    
    if (posts.length === 0) {
      console.log('ℹ️ Новых постов для импорта не обнаружено.');
      return;
    }
    
    // Отправляем в Supabase
    for (const post of posts) {
      // Проверяем, существует ли пост с таким же описанием
      const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/gallery?description=eq.${encodeURIComponent(post.description)}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      const existing = await checkRes.json();
      
      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`⏭️ Пост "${post.title}" уже был импортирован ранее. Пропуск.`);
        continue;
      }
      
      console.log(`📤 Импорт нового поста: "${post.title}" (${post.created_at})...`);
      
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/gallery`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(post)
      });
      
      if (insertRes.ok) {
        console.log(`✅ Пост "${post.title}" успешно импортирован на сайт!`);
      } else {
        console.error(`❌ Ошибка записи поста "${post.title}":`, await insertRes.text());
      }
    }
    
    console.log('🎉 Синхронизация завершена!');
    
  } catch (err) {
    console.error('❌ Системная ошибка выполнения синхронизации:', err);
  }
}

// Запуск
syncTagger();
