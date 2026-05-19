import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'
import type { UserProfile } from '../../../types'

type FormData = {
  full_name: string
  phone: string
  car_model: string
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setProfile(data as UserProfile)
      reset({
        full_name: data.full_name || '',
        phone: data.phone || '',
        car_model: data.car_model || '',
      })
    }
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: sanitizeString(data.full_name),
        phone: sanitizeString(data.phone),
        car_model: sanitizeString(data.car_model),
      })
      .eq('user_id', user.id)

    setSubmitting(false)

    if (error) {
      toast.error('Ошибка при сохранении профиля')
    } else {
      toast.success('Профиль обновлён')
      loadProfile()
    }
  }

  if (loading) return <div style={{ padding: 40 }}>Загрузка...</div>

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)' }}>Мой профиль</h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 24 }}>
        Обновите свои данные для быстрого оформления заявок и работы с порталом
      </p>

      {/* Карточка учетных данных с правами роли */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(200, 168, 130, 0.04) 100%)', border: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #c8a882 0%, #a6845c 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)', color: '#101012', fontWeight: 'bold', fontSize: '1.8rem',
          flexShrink: 0
        }}>
          {(profile?.full_name || profile?.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '0 0 4px 0' }}>{profile?.full_name || 'Участник'}</h3>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', margin: '0 0 8px 0' }}>{profile?.email}</p>
          <span style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            padding: '4px 10px',
            borderRadius: 2,
            color: profile?.role === 'owner' ? 'var(--primary)' : profile?.role === 'admin' ? '#e74c3c' : profile?.role === 'member' ? '#3498db' : '#2ebd59',
            border: `1px solid ${profile?.role === 'owner' ? 'var(--primary)' : profile?.role === 'admin' ? '#e74c3c' : profile?.role === 'member' ? '#3498db' : '#2ebd59'}`,
            background: 'rgba(255,255,255,0.01)'
          }}>
            {profile?.role === 'owner' ? '👑 Владелец СТО' : profile?.role === 'admin' ? '🛡️ Администратор' : profile?.role === 'member' ? '🔧 Сотрудник СТО' : '🚗 Клиент СТО'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label>Имя и фамилия *</label>
          <input
            {...register('full_name', { required: 'Введите имя', maxLength: 100 })}
            placeholder="John Doe"
          />
          {errors.full_name && <div className="form-error">{errors.full_name.message}</div>}
        </div>

        <div className="form-group">
          <label>Телефон (формат xxx-xxx) *</label>
          <input
            type="text"
            {...register('phone', {
              required: 'Введите телефон',
              pattern: { value: /^\d{3}-\d{3}$/, message: 'Некорректный формат. Пример: 123-456' },
              onChange: (e) => {
                const val = e.target.value
                const digits = val.replace(/\D/g, '').slice(0, 6)
                if (digits.length <= 3) {
                  e.target.value = digits
                } else {
                  e.target.value = `${digits.slice(0, 3)}-${digits.slice(3)}`
                }
              }
            })}
            placeholder="123-456"
          />
          {errors.phone && <div className="form-error">{errors.phone.message}</div>}
        </div>

        <div className="form-group">
          <label>Марка и модель авто</label>
          <input
            {...register('car_model', { maxLength: 100 })}
            placeholder="Toyota Camry 2018"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}
