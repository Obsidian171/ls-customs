import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'

export default function AdminVacationsManager() {
  const [vacations, setVacations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    loadAllVacations()
  }, [])

  const loadAllVacations = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('vacations_requests')
      .select('*')
      .order('id', { ascending: false })

    setVacations(data || [])
    setLoading(false)
  }

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('vacations_requests')
      .update({
        status,
        admin_comment: commentText || null
      })
      .eq('id', id)

    if (error) {
      toast.error('Не удалось обновить статус заявки')
    } else {
      toast.success(status === 'approved' ? 'Заявка на отпуск одобрена!' : 'Заявка на отпуск отклонена')
      setActionId(null)
      setCommentText('')
      loadAllVacations()
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 1000 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
        🏖️ Рассмотрение заявок на отпуск
      </h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
        Утверждайте графики отпусков и отгулов для сотрудников LS CUSTOMS, оставляйте комментарии и контролируйте состав.
      </p>

      {loading ? (
        <div className="loader">Загрузка заявок...</div>
      ) : vacations.length === 0 ? (
        <div style={{ padding: '60px 20px', border: '1px dashed rgba(255,255,255,0.06)', textAlign: 'center', color: 'var(--gray)' }}>
          В настоящее время нет активных заявок на отпуск.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {vacations.map((vac) => {
            const start = new Date(vac.start_date).toLocaleDateString('ru-RU')
            const end = new Date(vac.end_date).toLocaleDateString('ru-RU')
            const diffTime = Math.abs(new Date(vac.end_date).getTime() - new Date(vac.start_date).getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

            let statusColor = '#f1c40f'
            let statusText = 'Ожидает решения'
            if (vac.status === 'approved') {
              statusColor = '#2ebd59'
              statusText = 'Утверждено'
            } else if (vac.status === 'rejected') {
              statusColor = '#e74c3c'
              statusText = 'Отклонено'
            }

            return (
              <div key={vac.id} className="card" style={{ borderLeft: `5px solid ${statusColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--white)', margin: '0 0 6px 0' }}>
                      {vac.full_name}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-light)' }}>
                      🌴 Период: <strong>{start} — {end}</strong> ({diffDays} дн.)
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    background: 'rgba(255,255,255,0.01)',
                    color: statusColor,
                    border: `1px solid ${statusColor}`
                  }}>
                    {statusText}
                  </span>
                </div>

                <p style={{ color: 'var(--gray-light)', fontSize: '0.88rem', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  <strong>Обоснование:</strong> {vac.reason || 'Причина не указана'}
                </p>

                {vac.admin_comment && (
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 2, borderLeft: '2px solid var(--primary)', fontSize: '0.82rem', color: 'var(--gray-light)', marginBottom: 16, fontStyle: 'italic' }}>
                    <strong>Комментарий руководства:</strong> {vac.admin_comment}
                  </div>
                )}

                {vac.status === 'pending' && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 16 }}>
                    {actionId === vac.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 500 }}>
                        <label style={{ fontSize: '0.78rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Комментарий или примечание руководства</label>
                        <input
                          type="text"
                          placeholder="Пример: Отпуск одобрен. Приятного отдыха!"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
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
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleReview(vac.id, 'approved')}
                            style={{ background: '#2ebd59', borderColor: '#2ebd59', color: '#101012' }}
                          >
                            🌴 Утвердить отпуск
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReview(vac.id, 'rejected')}
                          >
                            Отклонить заявку
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => { setActionId(null); setCommentText('') }}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setActionId(vac.id)}
                      >
                        ⚙️ Вынести решение
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
