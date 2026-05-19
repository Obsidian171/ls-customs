import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import type { Review } from '../../../types'

export default function AdminReviews() {
  const [items, setItems] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  const load = async () => {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (filter === 'pending') query = query.eq('is_published', false)
    if (filter === 'approved') query = query.eq('is_published', true)
    const { data } = await query
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const approve = async (id: number) => {
    const { error } = await supabase.from('reviews').update({ is_published: true }).eq('id', id)
    if (error) { toast.error('Ошибка'); return }
    toast.success('Одобрено'); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return
    await supabase.from('reviews').delete().eq('id', id)
    toast.success('Удалено'); load()
  }

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Отзывы</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Все' : f === 'pending' ? 'На модерации' : 'Одобренные'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="loader">Загрузка...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{item.author_name}</strong>
                  <span className="stars" style={{ marginLeft: 10, fontSize: '0.85rem' }}>{stars(item.rating)}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {!item.is_published && (
                    <button className="btn btn-primary btn-sm" onClick={() => approve(item.id!)}>✓ Одобрить</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => remove(item.id!)}>🗑</button>
                </div>
              </div>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.88rem' }}>{item.text}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className={`badge ${item.is_published ? 'badge-green' : 'badge-red'}`}>
                  {item.is_published ? 'Одобрен' : 'На модерации'}
                </span>
                {item.created_at && (
                  <span style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: 'var(--gray)' }}>Нет отзывов</p>}
        </div>
      )}
    </div>
  )
}
