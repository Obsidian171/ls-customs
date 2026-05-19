import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { checkRateLimit, formatRetryAfter } from '../lib/rateLimit'
import { sanitizeString } from '../lib/sanitize'
import type { Review } from '../types'

type FormData = { author: string; text: string; rating: string }

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rateLimited, setRateLimited] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    // Получение списка опубликованных отзывов
    const fetchReviews = async () => {
      try {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
        setReviews(data || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()

    // Проверка авторизации
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
          if (data) {
            setValue('author', data.full_name || '')
          }
        })
      }
    })
  }, [setValue])

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Оставлять отзывы могут только зарегистрированные пользователи!')
      return
    }

    const rl = checkRateLimit('review')
    if (!rl.allowed) {
      setRateLimited(`Слишком много отзывов. Попробуйте через ${formatRetryAfter(rl.retryAfterMs)}.`)
      return
    }
    setRateLimited(null)
    setSubmitting(true)

    const { error } = await supabase.from('reviews').insert({
      author_name: sanitizeString(data.author),
      text: sanitizeString(data.text),
      rating: parseInt(data.rating),
      is_published: false,
    })
    setSubmitting(false)

    if (error) {
      toast.error('Ошибка при отправке.')
    } else {
      toast.success('Отзыв успешно отправлен на модерацию мастерам!')
      reset()
      // Восстанавливаем имя автора
      if (user) {
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
          if (data) setValue('author', data.full_name || '')
        })
      }
    }
  }

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Отзывы клиентов</h1>
        <p style={{ color: 'var(--gray-light)', marginBottom: 40 }}>
          Честные мнения наших клиентов о качестве обслуживания и кастомных доработках.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
          {/* Список отзывов */}
          <div>
            {loading ? (
              <div className="loader">Загрузка отзывов...</div>
            ) : reviews.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed rgba(200, 168, 130, 0.2)' }}>
                <p style={{ color: 'var(--gray-light)', margin: 0, fontSize: '0.95rem' }}>
                  Пока отзывов нет. Будьте первыми, кто оставит свой отзыв об LS CUSTOMS!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map(r => (
                  <div key={r.id} className="card glow-on-hover" style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em' }}>{r.author_name}</strong>
                      <span className="stars" style={{ fontSize: '1rem', color: 'var(--primary)', letterSpacing: '2px' }}>{stars(r.rating)}</span>
                    </div>
                    <p style={{ color: 'var(--gray-light)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                    {r.created_at && (
                      <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.78rem', marginTop: 14, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                        Опубликован: {new Date(r.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Панель отправки отзыва */}
          <div>
            {user ? (
              /* Форма для зарегистрированных */
              <div className="card" style={{ padding: '28px 24px' }}>
                <h3 style={{ marginBottom: 16, fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--white)', letterSpacing: '0.04em' }}>
                  Оставить отзыв
                </h3>
                {rateLimited && <div className="rate-limit-notice">⚠ {rateLimited}</div>}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="form-group">
                    <label>Ваше имя *</label>
                    <input {...register('author', { required: 'Введите имя', maxLength: 100 })} placeholder="Например: Carl Johnson" />
                    {errors.author && <div className="form-error">{errors.author.message}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>Оценка качества *</label>
                    <select {...register('rating', { required: 'Выберите оценку' })} style={{ cursor: 'pointer' }}>
                      <option value="">— Выбрать звезды —</option>
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
                      ))}
                    </select>
                    {errors.rating && <div className="form-error">{errors.rating.message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Текст отзыва *</label>
                    <textarea
                      {...register('text', {
                        required: 'Напишите отзыв',
                        minLength: { value: 10, message: 'Минимум 10 символов' },
                        maxLength: 1000
                      })}
                      placeholder="Опишите ваши впечатления от выполненного тюнинга..."
                      rows={4}
                    />
                    {errors.text && <div className="form-error">{errors.text.message}</div>}
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', padding: '14px 0', fontSize: '0.9rem', fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {submitting ? 'Отправка отзыва...' : 'Отправить отзыв'}
                  </button>
                  <p style={{ color: 'var(--gray-light)', fontSize: '0.75rem', marginTop: 10, textAlign: 'center', lineHeight: 1.4 }}>
                    Отзыв появится на сайте сразу после одобрения администрацией СТО.
                  </p>
                </form>
              </div>
            ) : (
              /* Заглушка для неавторизованных */
              <div className="card" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(200, 168, 130, 0.25)',
                padding: '36px 24px',
                textAlign: 'center',
                borderRadius: 2
              }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.85 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--white)', fontSize: '1.15rem', marginBottom: 12, letterSpacing: '0.04em' }}>
                  ОТЗЫВЫ ОГРАНИЧЕНЫ
                </h3>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: 24 }}>
                  Оставлять отзывы могут только авторизованные клиенты СТО <strong style={{ color: 'var(--primary)', fontWeight: 'bold' }}>LS CUSTOMS</strong>.
                </p>
                <a
                  href="/login"
                  className="btn btn-primary"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 0',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-condensed)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: 2,
                    textAlign: 'center'
                  }}
                >
                  Войти в профиль
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
