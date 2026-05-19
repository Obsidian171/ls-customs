import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'

export default function AdminReportsManager() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchName, setSearchName] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionId, setActionId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    loadAllReports()
  }, [])

  const loadAllReports = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('employee_reports')
      .select('*')
      .order('work_date', { ascending: false })

    setReports(data || [])
    setLoading(false)
  }

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('employee_reports')
      .update({
        status,
        admin_comment: commentText || null
      })
      .eq('id', id)

    if (error) {
      toast.error('Не удалось обновить отчёт')
    } else {
      toast.success(status === 'approved' ? 'Отчёт успешно одобрен!' : 'Отчёт отклонён')
      setActionId(null)
      setCommentText('')
      loadAllReports()
    }
  }

  // Экспорт таблицы в Excel/CSV
  const exportToCSV = () => {
    if (reports.length === 0) return
    
    // Заголовки
    const headers = ['ID', 'Сотрудник', 'Дата работы', 'Скриншот', 'Комментарий сотрудника', 'Статус', 'Комментарий руководства']
    const rows = reports.map(r => [
      r.id,
      r.employee_name,
      r.work_date,
      r.screenshot_url,
      r.comment || '',
      r.status,
      r.admin_comment || ''
    ])

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(';'), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(';'))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `lsc_employee_reports_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Отчёт успешно экспортирован в CSV (Excel)!')
  }

  // Печать страницы в стиле Word
  const printReport = () => {
    window.print()
  }

  const filtered = reports.filter(r => {
    const matchName = r.employee_name.toLowerCase().includes(searchName.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchName && matchStatus
  })

  return (
    <div style={{ padding: 40 }}>
      {/* Стили для печатной Word-версии таблицы */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
            background: #fff !important;
            color: #000 !important;
          }
          #lsc-word-table-container, #lsc-word-table-container * {
            visibility: visible;
          }
          #lsc-word-table-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .lsc-no-print {
            display: none !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th, td {
            border: 1px solid #000 !important;
            padding: 8px !important;
            color: #000 !important;
            font-size: 10pt !important;
          }
        }
      ` }} />

      <div id="lsc-word-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }} className="lsc-no-print">
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--gold)', fontFamily: 'var(--font-heading)', margin: 0 }}>
              📊 Сводная таблица отчётов (Word / Excel)
            </h2>
            <p style={{ color: 'var(--gray-light)', margin: '4px 0 0 0' }}>
              Контролируйте смены сотрудников СТО, согласовывайте выплаты и печатайте сводные таблицы.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={exportToCSV}>
              📥 Экспорт в Excel (CSV)
            </button>
            <button className="btn btn-primary btn-sm" onClick={printReport}>
              🖨️ Распечатать отчёт
            </button>
          </div>
        </div>

        {/* Панель фильтрации (скрыта при печати) */}
        <div className="card lsc-no-print" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '16px 20px', marginBottom: 24, background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1, minWidth: 200 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Поиск по сотруднику</label>
            <input
              type="text"
              placeholder="Введите имя..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{
                background: '#141414',
                border: '1px solid rgba(200, 168, 130, 0.2)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 2,
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Фильтр по статусу</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: '#141414',
                border: '1px solid rgba(200, 168, 130, 0.2)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 2,
                fontSize: '0.85rem',
                height: 38
              }}
            >
              <option value="all">Все отчёты</option>
              <option value="pending">Ожидают проверки</option>
              <option value="approved">Одобренные</option>
              <option value="rejected">Отклонённые</option>
            </select>
          </div>
        </div>

        {/* Заголовок для печатной Word-версии */}
        <div style={{ display: 'none' }} className="print-only">
          <h1 style={{ textAlign: 'center', fontSize: '18pt', marginBottom: 10 }}>LOS SANTOS CUSTOMS</h1>
          <h3 style={{ textAlign: 'center', fontSize: '14pt', marginBottom: 20 }}>СВОДНЫЙ ОТЧЁТ О РАБОТЕ СОТРУДНИКОВ</h3>
          <p style={{ fontSize: '10pt', marginBottom: 20 }}>Дата формирования: {new Date().toLocaleDateString('ru-RU')} г.</p>
        </div>

        {/* Word/Excel-подобная таблица */}
        {loading ? (
          <div className="loader">Загрузка данных...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', border: '1px dashed rgba(255,255,255,0.06)', textAlign: 'center', color: 'var(--gray)' }}>
            Отчёты по заданным фильтрам отсутствуют.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#0e0e10', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#141418', borderBottom: '2px solid rgba(200, 168, 130, 0.3)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Сотрудник</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Дата работы</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Скриншот работ</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Описание выполненных работ</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>Статус</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Вердикт / Комментарий</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }} className="lsc-no-print">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rep) => {
                  let statusText = 'Ожидает'
                  let statusBg = 'rgba(241, 196, 15, 0.12)'
                  let statusTextCol = '#f1c40f'
                  
                  if (rep.status === 'approved') {
                    statusText = 'Одобрен'
                    statusBg = 'rgba(46, 189, 89, 0.12)'
                    statusTextCol = '#2ebd59'
                  } else if (rep.status === 'rejected') {
                    statusText = 'Отклонён'
                    statusBg = 'rgba(231, 76, 60, 0.12)'
                    statusTextCol = '#e74c3c'
                  }

                  return (
                    <tr key={rep.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 'bold', color: 'var(--white)' }}>{rep.employee_name}</td>
                      <td style={{ padding: '14px 16px' }}>{new Date(rep.work_date).toLocaleDateString('ru-RU')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <a href={rep.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                          🔗 Ссылка на скриншот
                        </a>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--gray-light)', maxWidth: 280, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {rep.comment || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: 2,
                          fontWeight: 'bold',
                          letterSpacing: '0.05em',
                          background: statusBg,
                          color: statusTextCol,
                          border: `1px solid ${statusTextCol}`
                        }}>
                          {statusText}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#e2e2cc', fontStyle: 'italic' }}>
                        {rep.admin_comment || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }} className="lsc-no-print">
                        {actionId === rep.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
                            <input
                              type="text"
                              placeholder="Комментарий руководства..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              style={{
                                width: '100%',
                                background: '#141414',
                                border: '1px solid rgba(200, 168, 130, 0.2)',
                                color: '#fff',
                                padding: '6px 10px',
                                borderRadius: 2,
                                fontSize: '0.78rem'
                              }}
                            />
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleReview(rep.id, 'approved')}
                                style={{ background: '#2ebd59', borderColor: '#2ebd59', color: '#101012', flexGrow: 1, padding: 4, fontSize: '0.75rem' }}
                              >
                                Одобрить
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleReview(rep.id, 'rejected')}
                                style={{ flexGrow: 1, padding: 4, fontSize: '0.75rem' }}
                              >
                                Отклонить
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => { setActionId(null); setCommentText('') }}
                                style={{ padding: 4, fontSize: '0.75rem' }}
                              >
                                Х
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => { setActionId(rep.id); setCommentText(rep.admin_comment || '') }}
                          >
                            ⚙️ Рассмотреть
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
