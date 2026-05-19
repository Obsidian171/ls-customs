import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'

type FormData = {
  profile_id: string
  message: string
  type: 'system' | 'booking' | 'part_order'
}

export default function AdminNotificationsManager() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [senderRole, setSenderRole] = useState<string>('user')
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'system'
    }
  })

  useEffect(() => {
    loadSenderAndProfiles()
  }, [])

  const loadSenderAndProfiles = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Получаем роль отправителя
      const { data: senderProf } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      const role = senderProf?.role || 'user'
      setSenderRole(role)

      // Загружаем всех пользователей
      const { data: allProfiles } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_banned', false) // Не пишем забаненным
        .order('full_name', { ascending: true })

      const profilesList = allProfiles || []
      setProfiles(profilesList)

      // Фильтруем получателей на основе роли отправителя
      if (role === 'member') {
        // Механики могут отправлять уведомления ТОЛЬКО обычным участникам (клиентам)
        setFilteredProfiles(profilesList.filter(p => p.role === 'user'))
      } else if (role === 'admin') {
        // Админы могут отправлять уведомления обычным участникам (user) и механикам (member)
        setFilteredProfiles(profilesList.filter(p => p.role === 'user' || p.role === 'member'))
      } else if (role === 'owner') {
        // Владельцы могут слать сообщения кому угодно
        setFilteredProfiles(profilesList)
      } else {
        setFilteredProfiles([])
      }
    } catch (e) {
      console.error(e)
      toast.error('Не удалось загрузить данные отправителя или получателей')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    
    // Ищем UUID выбранного пользователя по ID профиля
    const selectedProfile = filteredProfiles.find(p => p.id.toString() === data.profile_id)
    if (!selectedProfile) {
      toast.error('Пользователь не найден')
      setSubmitting(false)
      return
    }

    const payload = {
      user_id: selectedProfile.user_id,
      message: sanitizeString(data.message),
      type: data.type,
      is_read: false
    }

    const { error } = await supabase.from('notifications').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error('Не удалось отправить уведомление')
    } else {
      toast.success(`Уведомление успешно отправлено пользователю ${selectedProfile.full_name || selectedProfile.email}!`)
      reset({
        profile_id: '',
        message: '',
        type: 'system'
      })
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 650 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
        🔔 Отправить личное уведомление
      </h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
        {senderRole === 'member' 
          ? 'Отправляйте персональные уведомления участникам СТО о статусе ремонта или заказах.'
          : 'Служба оповещения клиентов и сотрудников СТО. Выберите адресата и отправьте ему важное системное сообщение.'}
      </p>

      {loading ? (
        <div className="loader">Загрузка адресатов...</div>
      ) : filteredProfiles.length === 0 ? (
        <div style={{ padding: '20px 0', color: 'var(--gray)' }}>Нет доступных получателей для вашего уровня доступа.</div>
      ) : (
        <div className="card" style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(200, 168, 130, 0.2)', padding: '24px' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#fff', fontSize: '0.9rem' }}>Выберите получателя *</label>
              <select
                {...register('profile_id', { required: 'Выберите получателя' })}
                style={{
                  width: '100%',
                  background: '#141414',
                  border: '1px solid rgba(200, 168, 130, 0.2)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  height: 44,
                  outline: 'none'
                }}
              >
                <option value="">-- Выберите из списка --</option>
                {filteredProfiles.map((p) => {
                  let roleLabel = 'Участник'
                  if (p.role === 'owner') roleLabel = 'Владелец'
                  else if (p.role === 'admin') roleLabel = 'Админ'
                  else if (p.role === 'member') roleLabel = 'Mechanic'
                  
                  return (
                    <option key={p.id} value={p.id.toString()}>
                      {p.full_name ? `${p.full_name} (${p.email})` : p.email} [{roleLabel}]
                    </option>
                  )
                })}
              </select>
              {errors.profile_id && <div className="form-error" style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.profile_id.message}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#fff', fontSize: '0.9rem' }}>Тип сообщения *</label>
              <select
                {...register('type', { required: 'Выберите тип' })}
                style={{
                  width: '100%',
                  background: '#141414',
                  border: '1px solid rgba(200, 168, 130, 0.2)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  height: 44,
                  outline: 'none'
                }}
              >
                <option value="system">🔔 Системное оповещение</option>
                <option value="booking">📅 Оповещение по записи ремонта</option>
                <option value="part_order">📦 Оповещение по заказу запчастей</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#fff', fontSize: '0.9rem' }}>Текст сообщения (до 500 символов) *</label>
              <textarea
                {...register('message', { required: 'Введите сообщение', maxLength: 500 })}
                placeholder="Пример: Ваша запись на установку дисков одобрена на 18:00. Ждем вас!"
                rows={4}
                style={{
                  width: '100%',
                  background: '#141414',
                  border: '1px solid rgba(200, 168, 130, 0.2)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              {errors.message && <div className="form-error" style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.message.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0' }} disabled={submitting}>
              {submitting ? 'Отправка...' : '✉️ Отправить уведомление'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
