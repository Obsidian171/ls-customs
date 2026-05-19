import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import type { JobApplication } from '../../../types'

type ApplicationWithVacancy = JobApplication & { vacancies?: { title: string } }

export default function AdminApplications() {
  const [items, setItems] = useState<ApplicationWithVacancy[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('job_applications')
      .select('*, vacancies(title)')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const remove = async (id: number) => {
    if (!confirm('Удалить заявку?')) return
    await supabase.from('job_applications').delete().eq('id', id)
    toast.success('Удалено'); load()
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: 24 }}>Заявки на работу</h2>
      {loading ? <div className="loader">Загрузка...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222233', color: 'var(--gray)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px' }}>Имя</th>
                <th style={{ padding: '8px 10px' }}>Телефон</th>
                <th style={{ padding: '8px 10px' }}>Вакансия</th>
                <th style={{ padding: '8px 10px' }}>Сообщение</th>
                <th style={{ padding: '8px 10px' }}>Дата</th>
                <th style={{ padding: '8px 10px' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                  <td style={{ padding: '10px 10px' }}>{item.applicant_name}</td>
                  <td style={{ padding: '10px 10px' }}>{item.phone}</td>
                  <td style={{ padding: '10px 10px' }}>{item.vacancies?.title || '—'}</td>
                  <td style={{ padding: '10px 10px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.message || '—'}
                  </td>
                  <td style={{ padding: '10px 10px', color: 'var(--gray)', fontSize: '0.8rem' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('ru-RU') : '—'}
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
