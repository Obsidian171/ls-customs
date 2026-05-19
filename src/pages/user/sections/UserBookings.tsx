import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import type { Booking, Service } from '../../../types'

type BookingWithService = Booking & { service?: Service }

export default function UserBookings() {
  const [bookings, setBookings] = useState<BookingWithService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('bookings')
      .select('*, service:services(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setBookings(data.map(b => ({
        ...b,
        service: b.service as unknown as Service,
      })))
    }
    setLoading(false)
  }

  const statusLabels: Record<string, string> = {
    new: 'Новая запись',
    confirmed: 'Подтверждена',
    in_progress: 'В процессе ремонта',
    completed: 'Готово / Выдана',
    cancelled: 'Отменена',
  }

  const statusColors: Record<string, string> = {
    new: '#fbbf24',
    confirmed: '#60a5fa',
    in_progress: '#a78bfa',
    completed: '#34d399',
    cancelled: '#f87171',
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--gray)' }}>Загрузка ваших записей...</div>

  return (
    <div style={{ padding: 40, maxWidth: 850 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--gold)', fontFamily: 'var(--font-heading)', margin: 0 }}>
            📅 Мои записи на обслуживание
          </h2>
          <p style={{ color: 'var(--gray-light)', margin: '4px 0 0 0' }}>
            История ваших визитов и текущий статус обслуживания автомобилей.
          </p>
        </div>
        
        <Link 
          to="/booking" 
          className="btn btn-primary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            textDecoration: 'none', 
            fontSize: '0.88rem', 
            padding: '10px 20px',
            boxShadow: '0 0 15px rgba(200, 168, 130, 0.25)' 
          }}
        >
          ➕ Записаться на ремонт
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: 'var(--gray)', 
          border: '1px dashed rgba(255,255,255,0.06)', 
          borderRadius: 4 
        }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>🚗</span>
          У вас пока нет оформленных записей на обслуживание.<br />
          Нажмите кнопку выше, чтобы выбрать время и записаться.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {bookings.map(b => (
            <div 
              key={b.id} 
              className="card" 
              style={{ 
                padding: '24px', 
                borderLeft: `4px solid ${statusColors[b.status] || '#ccc'}`,
                background: 'rgba(255,255,255,0.01)',
                borderTop: '1px solid rgba(255,255,255,0.02)',
                borderRight: '1px solid rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.02)',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Заказ-наряд №{b.id}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--white)', margin: '4px 0 8px 0', fontFamily: 'var(--font-heading)' }}>
                    {b.service?.name || 'Техническое обслуживание'}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray)' }}>ДАТА ВИЗИТА</span>
                      <strong style={{ color: 'var(--white)', fontSize: '0.9rem' }}>
                        {new Date(b.preferred_date).toLocaleDateString('ru-RU')}
                      </strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray)' }}>ТИП РАБОТ</span>
                      <strong style={{ color: 'var(--gold)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        СТО Ремонт
                      </strong>
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: (statusColors[b.status] || '#ccc') + '15',
                    color: statusColors[b.status] || '#fff',
                    border: `1px solid ${statusColors[b.status]}35`,
                  }}
                >
                  {statusLabels[b.status] || b.status}
                </span>
              </div>

              {b.comment && (
                <div style={{ 
                  marginTop: 18, 
                  padding: '12px 16px', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.02)',
                  borderRadius: 2, 
                  fontSize: '0.85rem', 
                  color: 'var(--gray-light)' 
                }}>
                  <strong style={{ color: 'var(--white)', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>
                    Ваш комментарий к записи:
                  </strong>
                  {b.comment}
                </div>
              )}

              {b.admin_notes && (
                <div style={{ 
                  marginTop: 12, 
                  padding: '12px 16px', 
                  background: 'rgba(200, 168, 130, 0.05)', 
                  border: '1px solid rgba(200, 168, 130, 0.15)',
                  borderRadius: 2, 
                  fontSize: '0.85rem', 
                  color: 'var(--gold)',
                  fontStyle: 'italic'
                }}>
                  <strong style={{ color: 'var(--white)', fontSize: '0.8rem', display: 'block', marginBottom: 4, fontStyle: 'normal' }}>
                    Примечание автомеханика:
                  </strong>
                  {b.admin_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
