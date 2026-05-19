/**
 * Базовая санитизация строк — удаляет HTML-теги и опасные символы.
 * Supabase использует параметризованные запросы, поэтому SQL-инъекции исключены на уровне SDK.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // убираем HTML-теги
    .replace(/[<>"'`]/g, '')           // убираем опасные символы
    .trim()
    .slice(0, 1000)                    // ограничиваем длину
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-() ]/g, '').trim().slice(0, 20)
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj }
  for (const key in result) {
    if (typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeString(result[key] as string)
    }
  }
  return result
}
