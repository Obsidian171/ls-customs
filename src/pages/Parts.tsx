import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { checkRateLimit, formatRetryAfter } from '../lib/rateLimit'
import { sanitizeString, sanitizePhone } from '../lib/sanitize'
import { useState, useEffect } from 'react'
import type { PartOrder } from '../types'

type FormData = {
  client_name: string
  phone: string
  part_name: string
  car_model: string
  comment: string
}

export default function Parts() {
  const [submitting, setSubmitting] = useState(false)
  const [rateLimited, setRateLimited] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
          if (data) {
            setValue('client_name', data.full_name || '')
            setValue('phone', data.phone || '')
            setValue('car_model', data.car_model || '')
          }
        })
      }
    })
  }, [])

  const onSubmit = async (data: FormData) => {
    const rl = checkRateLimit('parts')
    if (!rl.allowed) {
      setRateLimited(`Слишком много заявок. Попробуйте через ${formatRetryAfter(rl.retryAfterMs)}.`)
      return
    }
    setRateLimited(null)
    setSubmitting(true)

    const payload: PartOrder = {
      client_name: sanitizeString(data.client_name),
      phone: sanitizePhone(data.phone),
      part_name: sanitizeString(data.part_name),
      car_model: sanitizeString(data.car_model),
      comment: sanitizeString(data.comment || ''),
      status: 'new',
      user_id: user?.id,
      email: user?.email,
    }

    const { error } = await supabase.from('part_orders').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error('Ошибка при отправке. Попробуйте позже.')
    } else {
      toast.success('Заявка на деталь принята!')
      reset()
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Детали и запчасти</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--gray-light)', marginBottom: 24, lineHeight: 1.7 }}>
              Заказываем оригинальные и аналоговые запчасти под любой автомобиль.
              Укажи что нужно — найдём и сообщим цену.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Оригинальные запчасти', 'Аналоги от проверенных производителей', 'Быстрая доставка', 'Гарантия на детали'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray-light)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--green)' }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            {rateLimited && <div className="rate-limit-notice">⚠ {rateLimited}</div>}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-group">
                <label>Имя *</label>
                <input {...register('client_name', { required: 'Введите имя', maxLength: 100 })} placeholder="Ваше имя" />
                {errors.client_name && <div className="form-error">{errors.client_name.message}</div>}
              </div>

              <div className="form-group">
                <label>Телефон (международный формат) *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Введите телефон', pattern: { value: /^[\d+\-() ]{6,20}$/, message: 'Некорректный номер' } })}
                  placeholder="+1 (800) 555-35-35"
                />
                {errors.phone && <div className="form-error">{errors.phone.message}</div>}
              </div>

              <div className="form-group">
                <label>Название детали *</label>
                <input {...register('part_name', { required: 'Укажите деталь', maxLength: 200 })} placeholder="Например: тормозные колодки передние" />
                {errors.part_name && <div className="form-error">{errors.part_name.message}</div>}
              </div>

              <div className="form-group">
                <label>Марка и модель авто *</label>
                <input {...register('car_model', { required: 'Укажите авто', maxLength: 100 })} placeholder="Например: Toyota Camry 2018" />
                {errors.car_model && <div className="form-error">{errors.car_model.message}</div>}
              </div>

              <div className="form-group">
                <label>Комментарий</label>
                <textarea {...register('comment', { maxLength: 500 })} placeholder="Дополнительная информация" rows={2} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? 'Отправка...' : 'Заказать деталь'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
