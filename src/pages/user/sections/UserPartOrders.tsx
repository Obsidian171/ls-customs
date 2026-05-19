import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import type { PartOrder } from '../../../types'

export default function UserPartOrders() {
  const [orders, setOrders] = useState<PartOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('part_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setOrders(data as PartOrder[])
    setLoading(false)
  }

  const statusLabels: Record<string, string> = {
    new: 'Ожидает модерации',
    searching: 'Поиск детали на складе',
    found: 'Деталь найдена',
    ordered: 'Заказ отправлен поставщику',
    arrived: 'Деталь прибыла на СТО',
    completed: 'Получено / Установлено',
    cancelled: 'Отменён',
  }

  const statusColors: Record<string, string> = {
    new: '#fbbf24',
    searching: '#3498db',
    found: '#a78bfa',
    ordered: '#8b5cf6',
    arrived: '#34d399',
    completed: '#10b981',
    cancelled: '#f87171',
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--gray)' }}>Загрузка ваших заказов...</div>

  return (
    <div style={{ padding: 40, maxWidth: 850 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--gold)', fontFamily: 'var(--font-heading)', margin: 0 }}>
            📦 Мои заказы автозапчастей
          </h2>
          <p style={{ color: 'var(--gray-light)', margin: '4px 0 0 0' }}>
            Отслеживайте этапы доставки и поступление автодеталей на склад СТО.
          </p>
        </div>
        
        <Link 
          to="/parts" 
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
          ➕ Заказать автодетали
        </Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: 'var(--gray)', 
          border: '1px dashed rgba(255,255,255,0.06)', 
          borderRadius: 4 
        }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>📦</span>
          У вас пока нет заказов на автозапчасти.<br />
          Нажмите кнопку выше, чтобы подать заявку на поиск нужной детали.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(o => (
            <div 
              key={o.id} 
              className="card" 
              style={{ 
                padding: '24px', 
                borderLeft: `4px solid ${statusColors[o.status] || '#ccc'}`,
                background: 'rgba(255,255,255,0.01)',
                borderTop: '1px solid rgba(255,255,255,0.02)',
                borderRight: '1px solid rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.02)',
                borderRadius: '4px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Заявка на деталь №{o.id}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--white)', margin: '4px 0 8px 0', fontFamily: 'var(--font-heading)' }}>
                    {o.part_name}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray)' }}>АВТОМОБИЛЬ</span>
                      <strong style={{ color: 'var(--white)', fontSize: '0.9rem' }}>
                        {o.car_model}
                      </strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray)' }}>СТОИМОСТЬ</span>
                      <strong style={{ color: 'var(--gold)', fontSize: '1rem' }}>
                        {o.price ? `$ ${o.price}` : 'Расчёт стоимости...'}
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
                    backgroundColor: (statusColors[o.status] || '#ccc') + '15',
                    color: statusColors[o.status] || '#fff',
                    border: `1px solid ${statusColors[o.status]}35`,
                  }}
                >
                  {statusLabels[o.status] || o.status}
                </span>
              </div>

              {o.comment && (
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
                    Ваши комментарии и спецификации:
                  </strong>
                  {o.comment}
                </div>
              )}

              {o.admin_notes && (
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
                    Примечание администрации СТО:
                  </strong>
                  {o.admin_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
