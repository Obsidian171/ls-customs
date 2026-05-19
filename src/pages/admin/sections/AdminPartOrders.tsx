import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import type { PartOrder } from '../../../types'

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  processing: 'В обработке',
  ordered: 'Заказана',
  arrived: 'Прибыла',
  done: 'Выдана',
  cancelled: 'Отменена',
}

export default function AdminPartOrders() {
  const [items, setItems] = useState<PartOrder[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase.from('part_orders').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: number, status: string) => {
    const { error } = await supabase.from('part_orders').update({ status }).eq('id', id)
    if (error) { toast.error('Ошибка'); return }
    toast.success('Статус обновлён'); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить заявку?')) return
    await supabase.from('part_orders').delete().eq('id', id)
    toast.success('Удалено'); load()
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: 24 }}>Заказы деталей</h2>
      {loading ? <div className="loader">Загрузка...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222233', color: 'var(--gray)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px' }}>Клиент</th>
                <th style={{ padding: '8px 10px' }}>Телефон</th>
                <th style={{ padding: '8px 10px' }}>Деталь</th>
                <th style={{ padding: '8px 10px' }}>Авто</th>
                <th style={{ padding: '8px 10px' }}>Статус</th>
                <th style={{ padding: '8px 10px' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                  <td style={{ padding: '10px 10px' }}>{item.client_name}</td>
                  <td style={{ padding: '10px 10px' }}>{item.phone}</td>
                  <td style={{ padding: '10px 10px' }}>{item.part_name}</td>
                  <td style={{ padding: '10px 10px' }}>{item.car_model}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <select
                      value={item.status || 'new'}
                      onChange={e => updateStatus(item.id!, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(item.id!)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ color: 'var(--gray)', padding: '20px 0' }}>Нет заявок</p>}
        </div>
      )}
    </div>
  )
}
