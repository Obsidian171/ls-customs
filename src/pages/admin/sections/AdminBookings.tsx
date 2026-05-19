import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import type { Booking } from '../../../types'

type BookingWithService = Booking & { services?: { name: string } }

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  confirmed: 'Подтверждена',
  in_progress: 'В работе',
  done: 'Выполнена',
  cancelled: 'Отменена',
}

export default function AdminBookings() {
  const [items, setItems] = useState<BookingWithService[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, services(name)')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: number, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) { toast.error('Ошибка'); return }
    toast.success('Статус обновлён')
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить запись?')) return
    await supabase.from('bookings').delete().eq('id', id)
    toast.success('Удалено'); load()
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: 24 }}>Записи на ремонт</h2>
      {loading ? <div className="loader">Загрузка...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222233', color: 'var(--gray)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px' }}>Клиент</th>
                <th style={{ padding: '8px 10px' }}>Телефон</th>
                <th style={{ padding: '8px 10px' }}>Услуга</th>
                <th style={{ padding: '8px 10px' }}>Дата</th>
                <th style={{ padding: '8px 10px' }}>Статус</th>
                <th style={{ padding: '8px 10px' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                  <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>
                    <strong style={{ color: 'var(--white)', fontSize: '0.9rem' }}>{item.client_name}</strong>
                    {item.comment && (
                      <div style={{
                        marginTop: 8,
                        fontSize: '0.78rem',
                        color: 'var(--gray-light)',
                        background: 'rgba(0,0,0,0.3)',
                        borderLeft: '2px solid var(--primary)',
                        padding: '8px 12px',
                        borderRadius: 2,
                        whiteSpace: 'pre-line',
                        fontFamily: 'Courier New, monospace',
                        lineHeight: 1.4
                      }}>
                        {item.comment}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 10px', verticalAlign: 'top', fontWeight: 600 }}>{item.phone}</td>
                  <td style={{ padding: '14px 10px', verticalAlign: 'top', color: 'var(--primary)', fontWeight: 500 }}>{item.services?.name || '—'}</td>
                  <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>{item.preferred_date}</td>
                  <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>
                    <select
                      value={item.status || 'new'}
                      onChange={e => updateStatus(item.id!, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        width: 'auto',
                        background: '#141414',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderRadius: 2,
                        cursor: 'pointer'
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(item.id!)} style={{ borderRadius: 2 }}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ color: 'var(--gray)', padding: '20px 0' }}>Нет записей</p>}
        </div>
      )}
    </div>
  )
}
