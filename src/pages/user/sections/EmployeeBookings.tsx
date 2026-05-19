import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'

export default function EmployeeBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('id', { ascending: false })

    setBookings(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id)
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    setUpdatingId(null)

    if (error) {
      toast.error('Не удалось обновить статус')
    } else {
      toast.success('Статус заказа обновлен!')
      loadBookings()
    }
  }

  const updateNotes = async (id: number, notes: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ admin_notes: notes })
      .eq('id', id)

    if (error) {
      toast.error('Не удалось сохранить примечания')
    } else {
      toast.success('Примечания сохранены')
      loadBookings()
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
        🔧 Активные заказы и записи СТО
      </h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
        Управляйте записями клиентов на ремонт, принимайте заказы в работу и переводите их в финальный статус после сдачи авто.
      </p>

      {loading ? (
        <div className="loader">Загрузка заказов...</div>
      ) : bookings.length === 0 ? (
        <div style={{ padding: '60px 20px', border: '1px dashed rgba(255,255,255,0.06)', textAlign: 'center', color: 'var(--gray)' }}>
          В базе данных пока нет ни одного заказа на ремонт.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {bookings.map((booking) => {
            const formattedDate = new Date(booking.preferred_date).toLocaleDateString('ru-RU')
            
            // Расцветка статусов
            let statusColor = '#f1c40f' // new
            let statusText = 'Новый'
            if (booking.status === 'confirmed') {
              statusColor = '#3498db'
              statusText = 'Принят'
            } else if (booking.status === 'in_progress') {
              statusColor = '#9b59b6'
              statusText = 'В процессе'
            } else if (booking.status === 'done') {
              statusColor = '#2ebd59'
              statusText = 'Выполнен'
            } else if (booking.status === 'cancelled') {
              statusColor = '#95a5a6'
              statusText = 'Отменён'
            }

            return (
              <div key={booking.id} className="card" style={{ borderLeft: `5px solid ${statusColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--white)', margin: '0 0 6px 0' }}>
                      Заказ №{booking.id} • {booking.client_name}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gray-light)' }}>
                      📞 {booking.phone} • 📅 Дата визита: <strong>{formattedDate}</strong>
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    background: 'rgba(255,255,255,0.02)',
                    color: statusColor,
                    border: `1px solid ${statusColor}`
                  }}>
                    {statusText}
                  </span>
                </div>

                {/* Печатный Чек из комментария */}
                {booking.comment && (
                  <div style={{
                    background: '#121214',
                    border: '1px solid rgba(255,255,255,0.03)',
                    padding: 16,
                    borderRadius: 2,
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.82rem',
                    color: '#e2e2cc',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.4,
                    marginBottom: 16,
                    maxHeight: 200,
                    overflowY: 'auto'
                  }}>
                    {booking.comment}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                  {/* Заметки автомеханика */}
                  <div style={{ flexGrow: 1, maxWidth: 500 }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--gray)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      Внутренние заметки механика
                    </label>
                    <input
                      type="text"
                      defaultValue={booking.admin_notes || ''}
                      placeholder="Укажите особенности ремонта..."
                      onBlur={(e) => updateNotes(booking.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: '#141414',
                        border: '1px solid rgba(200, 168, 130, 0.2)',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: 2,
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  {/* Кнопки перевода статусов */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {booking.status !== 'confirmed' && booking.status !== 'done' && (
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={updatingId === booking.id}
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        style={{ borderColor: '#3498db', color: '#3498db' }}
                      >
                        Принять заказ
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={updatingId === booking.id}
                        onClick={() => updateStatus(booking.id, 'in_progress')}
                        style={{ borderColor: '#9b59b6', color: '#9b59b6' }}
                      >
                        Начать работу
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={updatingId === booking.id}
                        onClick={() => updateStatus(booking.id, 'done')}
                        style={{ background: '#2ebd59', borderColor: '#2ebd59', color: '#101012' }}
                      >
                        Сдан / Готов
                      </button>
                    )}
                    {booking.status !== 'done' && booking.status !== 'cancelled' && (
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={updatingId === booking.id}
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
