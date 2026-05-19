import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import type { Notification } from '../../../types'

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setNotifications(data as Notification[])
    setLoading(false)
  }

  const markAsRead = async (id: number) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      toast.error('Ошибка при обновлении')
    } else {
      loadNotifications()
    }
  }

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) {
      toast.error('Ошибка при обновлении')
    } else {
      toast.success('Все уведомления прочитаны')
      loadNotifications()
    }
  }

  const typeLabels: Record<string, string> = {
    booking_update: 'Обновление записи',
    part_order_update: 'Обновление заказа',
    review_published: 'Отзыв опубликован',
    general: 'Общее уведомление',
    system: 'Системное сообщение',
    booking: 'Уведомление о записи',
    part_order: 'Уведомление о запчастях',
  }

  const typeIcons: Record<string, string> = {
    booking_update: '📅',
    part_order_update: '📦',
    review_published: '⭐',
    general: '📢',
    system: '🔔',
    booking: '📅',
    part_order: '📦',
  }

  if (loading) return <div style={{ padding: 40 }}>Загрузка...</div>

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)' }}>Уведомления</h2>
          <p style={{ color: 'var(--gray-light)' }}>
            {unreadCount > 0 ? `Непрочитанных: ${unreadCount}` : 'Все уведомления прочитаны'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-primary">
            Прочитать все
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-light)' }}>
          У вас пока нет уведомлений
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map(n => (
            <div
              key={n.id}
              className="card"
              style={{
                padding: 20,
                opacity: n.is_read ? 0.6 : 1,
                borderLeft: n.is_read ? 'none' : '3px solid var(--gold)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: '1.2rem' }}>{typeIcons[n.type] || '📢'}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-light)' }}>
                      {typeLabels[n.type] || 'Уведомление'}
                    </span>
                  </div>
                  <p style={{ marginBottom: 8 }}>{n.message}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-light)' }}>
                    {new Date(n.created_at!).toLocaleString('ru-RU')}
                  </p>
                </div>
                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id!)}
                    className="btn"
                    style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                  >
                    Прочитано
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
