import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'

type FormData = {
  full_name: string
  start_date: string
  end_date: string
  reason: string
}

export default function EmployeeVacations() {
  const [vacations, setVacations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)

    // Заполняем имя по умолчанию из профиля
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single()

    if (profile?.full_name) {
      setValue('full_name', profile.full_name)
    }

    loadVacations(user.id)
  }

  const loadVacations = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('vacations_requests')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false })

    setVacations(data || [])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    // Валидация логики дат
    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    
    if (end < start) {
      toast.error('Дата окончания не может быть раньше даты начала отпуска')
      return
    }

    setSubmitting(true)
    
    const payload = {
      user_id: user.id,
      full_name: sanitizeString(data.full_name),
      start_date: data.start_date,
      end_date: data.end_date,
      reason: sanitizeString(data.reason || ''),
      status: 'pending'
    }

    const { error } = await supabase.from('vacations_requests').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error('Ошибка при отправке заявки на отпуск')
    } else {
      toast.success('Заявка на отпуск успешно отправлена!')
      reset({
        full_name: data.full_name,
        start_date: '',
        end_date: '',
        reason: ''
      })
      loadVacations(user.id)
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 1000 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
        🏖️ Мои отпуска и отгулы
      </h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
        Планируйте свой отдых заранее. Подайте заявку на отпуск, и руководство СТО рассмотрит её в кратчайшие сроки.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
        {/* Форма подачи */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 20, color: 'var(--white)' }}>
            Подать заявку на отпуск
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label>Имя и фамилия сотрудника *</label>
              <input
                {...register('full_name', { required: 'Введите имя', maxLength: 100 })}
                placeholder="Имя Фамилия"
              />
              {errors.full_name && <div className="form-error">{errors.full_name.message}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Дата начала *</label>
                <input
                  type="date"
                  {...register('start_date', { required: 'Обязательно' })}
                />
                {errors.start_date && <div className="form-error">{errors.start_date.message}</div>}
              </div>

              <div className="form-group">
                <label>Дата окончания *</label>
                <input
                  type="date"
                  {...register('end_date', { required: 'Обязательно' })}
                />
                {errors.end_date && <div className="form-error">{errors.end_date.message}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Причина отпуска / комментарий</label>
              <textarea
                {...register('reason', { maxLength: 500 })}
                placeholder="По семейным обстоятельствам, поездка в Лас-Вентурас на выходные..."
                rows={3}
                style={{
                  width: '100%',
                  background: '#141414',
                  border: '1px solid rgba(200, 168, 130, 0.2)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
              {errors.reason && <div className="form-error">{errors.reason.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0' }} disabled={submitting}>
              {submitting ? 'Отправка...' : '🌴 Подать заявку на отпуск'}
            </button>
          </form>
        </div>

        {/* История отпусков */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 20, color: 'var(--white)' }}>
            Статус моих заявок
          </h3>

          {loading ? (
            <div className="loader">Загрузка заявок...</div>
          ) : vacations.length === 0 ? (
            <div style={{ padding: '40px 20px', border: '1px dashed rgba(255,255,255,0.06)', textAlign: 'center', color: 'var(--gray)' }}>
              Вы ещё не подавали заявки на отпуск.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {vacations.map((vac) => {
                const start = new Date(vac.start_date).toLocaleDateString('ru-RU')
                const end = new Date(vac.end_date).toLocaleDateString('ru-RU')
                const diffTime = Math.abs(new Date(vac.end_date).getTime() - new Date(vac.start_date).getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

                return (
                  <div key={vac.id} className="card" style={{ borderLeft: `4px solid ${
                    vac.status === 'approved' ? '#2ebd59' : vac.status === 'rejected' ? '#e74c3c' : '#f1c40f'
                  }`, padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--white)' }}>
                        Отпуск: {start} — {end} ({diffDays} дн.)
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 2,
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                        background: vac.status === 'approved' ? 'rgba(46, 189, 89, 0.12)' : vac.status === 'rejected' ? 'rgba(231, 76, 60, 0.12)' : 'rgba(241, 196, 15, 0.12)',
                        color: vac.status === 'approved' ? '#2ebd59' : vac.status === 'rejected' ? '#e74c3c' : '#f1c40f',
                        border: `1px solid ${vac.status === 'approved' ? '#2ebd59' : vac.status === 'rejected' ? '#e74c3c' : '#f1c40f'}`
                      }}>
                        {vac.status === 'approved' ? 'Одобрен' : vac.status === 'rejected' ? 'Отклонён' : 'Ожидает'}
                      </span>
                    </div>

                    <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                      <strong>Причина:</strong> {vac.reason || 'Не указана'}
                    </p>

                    {vac.admin_comment && (
                      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 2, borderLeft: '2px solid var(--primary)', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--gray-light)' }}>
                        <strong>Ответ руководства:</strong> {vac.admin_comment}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
