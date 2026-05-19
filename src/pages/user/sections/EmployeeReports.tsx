import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'

import ImageUpload from '../../../components/ImageUpload'

type FormData = {
  employee_name: string
  work_date: string
  screenshot_url: string
  comment: string
}

export default function EmployeeReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    register('screenshot_url', { required: 'Загрузите скриншот выполненных работ' })
  }, [register])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)

    // Заполняем имя сотрудника по умолчанию из профиля
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single()

    if (profile?.full_name) {
      setValue('employee_name', profile.full_name)
    }

    // Устанавливаем сегодняшнюю дату по умолчанию
    setValue('work_date', new Date().toISOString().split('T')[0])

    loadReports(user.id)
  }

  const loadReports = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('employee_reports')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false })

    setReports(data || [])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    
    const payload = {
      user_id: user.id,
      employee_name: sanitizeString(data.employee_name),
      work_date: data.work_date,
      screenshot_url: sanitizeString(data.screenshot_url),
      comment: sanitizeString(data.comment || ''),
      status: 'pending'
    }

    const { error } = await supabase.from('employee_reports').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error('Ошибка при отправке отчёта')
    } else {
      toast.success('Отчёт о работе успешно отправлен!')
      reset({
        employee_name: data.employee_name,
        work_date: new Date().toISOString().split('T')[0],
        screenshot_url: '',
        comment: ''
      })
      loadReports(user.id)
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 1000 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
        📈 Моя отчётность о работе
      </h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
        Отправляйте ежедневные отчёты о выполненных заказах со скриншотами для проверки администрацией СТО.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
        {/* Форма подачи отчета */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 20, color: 'var(--white)' }}>
            Подать новый отчёт
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label>Имя и фамилия сотрудника *</label>
              <input
                {...register('employee_name', { required: 'Введите имя', maxLength: 100 })}
                placeholder="Имя Фамилия"
              />
              {errors.employee_name && <div className="form-error">{errors.employee_name.message}</div>}
            </div>

            <div className="form-group">
              <label>Дата смены / работ *</label>
              <input
                type="date"
                {...register('work_date', { required: 'Выберите дату' })}
              />
              {errors.work_date && <div className="form-error">{errors.work_date.message}</div>}
            </div>

            <ImageUpload
              value={watch('screenshot_url') || ''}
              onChange={(url) => setValue('screenshot_url', url, { shouldValidate: true })}
              label="Скриншот выполненных работ (Загрузить) *"
            />
            {errors.screenshot_url && <div className="form-error">{errors.screenshot_url.message}</div>}

            <div className="form-group">
              <label>Комментарий / Описание проделанных работ</label>
              <textarea
                {...register('comment', { maxLength: 500 })}
                placeholder="Установил 3 комплекта дисков Classic, покрасил Sabre в жёлтый цвет..."
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
              {errors.comment && <div className="form-error">{errors.comment.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0' }} disabled={submitting}>
              {submitting ? 'Отправка...' : '🚀 Отправить отчёт на проверку'}
            </button>
          </form>
        </div>

        {/* История отчетов */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 20, color: 'var(--white)' }}>
            История отчётов
          </h3>

          {loading ? (
            <div className="loader">Загрузка истории...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: '40px 20px', border: '1px dashed rgba(255,255,255,0.06)', textAlign: 'center', color: 'var(--gray)' }}>
              Вы ещё не подавали отчёты о работе.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reports.map((rep) => (
                <div key={rep.id} className="card" style={{ borderLeft: `4px solid ${
                  rep.status === 'approved' ? '#2ebd59' : rep.status === 'rejected' ? '#e74c3c' : '#f1c40f'
                }`, padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--white)' }}>
                      Отчёт за {new Date(rep.work_date).toLocaleDateString('ru-RU')}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: 2,
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      background: rep.status === 'approved' ? 'rgba(46, 189, 89, 0.12)' : rep.status === 'rejected' ? 'rgba(231, 76, 60, 0.12)' : 'rgba(241, 196, 15, 0.12)',
                      color: rep.status === 'approved' ? '#2ebd59' : rep.status === 'rejected' ? '#e74c3c' : '#f1c40f',
                      border: `1px solid ${rep.status === 'approved' ? '#2ebd59' : rep.status === 'rejected' ? '#e74c3c' : '#f1c40f'}`
                    }}>
                      {rep.status === 'approved' ? 'Одобрен' : rep.status === 'rejected' ? 'Отклонён' : 'На проверке'}
                    </span>
                  </div>

                  <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                    {rep.comment || 'Описания нет'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                    <a href={rep.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                      🖼️ Посмотреть скриншот работы
                    </a>
                  </div>

                  {rep.admin_comment && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 2, borderLeft: '2px solid var(--primary)', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--gray-light)' }}>
                      <strong>Ответ руководства:</strong> {rep.admin_comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
