/**
 * Клиентский rate-limiter на основе localStorage.
 * Для серьёзной защиты используйте серверный rate-limit (Supabase Edge Functions / nginx).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  booking: { max: 3, windowMs: 60 * 60 * 1000 },      // 3 записи в час
  parts: { max: 3, windowMs: 60 * 60 * 1000 },         // 3 заказа деталей в час
  review: { max: 2, windowMs: 24 * 60 * 60 * 1000 },   // 2 отзыва в сутки
  vacancy: { max: 2, windowMs: 24 * 60 * 60 * 1000 },  // 2 заявки в сутки
  admin_login: { max: 5, windowMs: 15 * 60 * 1000 },   // 5 попыток за 15 мин
}

export function checkRateLimit(action: string): { allowed: boolean; retryAfterMs: number } {
  const limit = LIMITS[action]
  if (!limit) return { allowed: true, retryAfterMs: 0 }

  const key = `rl_${action}`
  const now = Date.now()
  const raw = localStorage.getItem(key)
  let entry: RateLimitEntry = raw ? JSON.parse(raw) : { count: 0, resetAt: now + limit.windowMs }

  if (now > entry.resetAt) {
    entry = { count: 0, resetAt: now + limit.windowMs }
  }

  if (entry.count >= limit.max) {
    return { allowed: false, retryAfterMs: entry.resetAt - now }
  }

  entry.count += 1
  localStorage.setItem(key, JSON.stringify(entry))
  return { allowed: true, retryAfterMs: 0 }
}

export function formatRetryAfter(ms: number): string {
  const minutes = Math.ceil(ms / 60000)
  if (minutes < 60) return `${minutes} мин.`
  const hours = Math.ceil(minutes / 60)
  return `${hours} ч.`
}
