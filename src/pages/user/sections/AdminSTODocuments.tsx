import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'

export default function AdminSTODocuments() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  
  const [adminName, setAdminName] = useState('')
  const [adminWork, setAdminWork] = useState('Проведена модерация отзывов, проведено распределение заказов между автомеханиками, осуществлена проверка складских запасов запчастей.')
  const [generalRemarks, setGeneralRemarks] = useState('Автосервис функционирует в штатном режиме. Показатели удовлетворенности клиентов находятся на высоком уровне. Рекомендуется пополнить запасы расходных материалов для покраски.')
  
  const [showStamp, setShowStamp] = useState(true)
  const [showSignature, setShowSignature] = useState(true)
  const [loading, setLoading] = useState(false)

  // Статистика
  const [stats, setStats] = useState({
    totalBookings: 0,
    doneBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    newBookings: 0,
    totalParts: 0,
    donePartsCost: 0,
    activeEmployees: 0,
    newApplications: 0,
    reviewsCount: 0,
    averageRating: 0
  })

  useEffect(() => {
    loadCurrentAdminName()
  }, [])

  useEffect(() => {
    loadStatistics()
  }, [startDate, endDate])

  const loadCurrentAdminName = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single()
    if (data?.full_name) {
      setAdminName(data.full_name)
    }
  }

  const loadStatistics = async () => {
    setLoading(true)
    try {
      // 1. Записи
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status')
        .gte('preferred_date', startDate)
        .lte('preferred_date', endDate)

      const bStats = { total: bookings?.length || 0, new: 0, confirmed: 0, in_progress: 0, done: 0, cancelled: 0 }
      bookings?.forEach(b => {
        if (b.status === 'new') bStats.new++
        else if (b.status === 'confirmed') bStats.confirmed++
        else if (b.status === 'in_progress') bStats.in_progress++
        else if (b.status === 'done') bStats.done++
        else if (b.status === 'cancelled') bStats.cancelled++
      })

      // 2. Детали
      const { data: parts } = await supabase
        .from('part_orders')
        .select('status, price')
        .gte('created_at', startDate + 'T00:00:00Z')
        .lte('created_at', endDate + 'T23:59:59Z')

      let totalPartsCount = parts?.length || 0
      let completedCost = 0
      parts?.forEach(p => {
        if (p.status === 'done' && p.price) {
          completedCost += Number(p.price)
        }
      })

      // 3. Отзывы
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .gte('created_at', startDate + 'T00:00:00Z')
        .lte('created_at', endDate + 'T23:59:59Z')

      let revCount = reviews?.length || 0
      let avgRating = 0
      if (revCount > 0) {
        const sum = reviews!.reduce((acc, r) => acc + r.rating, 0)
        avgRating = Number((sum / revCount).toFixed(2))
      }

      // 4. Заявки на вакансии
      const { data: apps } = await supabase
        .from('job_applications')
        .select('id')
        .gte('created_at', startDate + 'T00:00:00Z')
        .lte('created_at', endDate + 'T23:59:59Z')

      // 5. Сотрудники (всего)
      const { data: employees } = await supabase
        .from('employees')
        .select('id')

      setStats({
        totalBookings: bStats.total,
        doneBookings: bStats.done,
        confirmedBookings: bStats.confirmed + bStats.in_progress,
        cancelledBookings: bStats.cancelled,
        newBookings: bStats.new,
        totalParts: totalPartsCount,
        donePartsCost: completedCost,
        activeEmployees: employees?.length || 0,
        newApplications: apps?.length || 0,
        reviewsCount: revCount,
        averageRating: avgRating
      })
    } catch (e) {
      console.error(e)
      toast.error('Ошибка при сборе статистики для отчёта')
    } finally {
      setLoading(false)
    }
  }

  const exportToWord = () => {
    const content = document.getElementById('report-document-container')?.innerHTML
    if (!content) return

    // Word XML / HTML wrapper structure
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Отчет СТО</title>
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.5;
            color: #000000;
            padding: 20px;
          }
          h1, h2, h3 {
            font-family: 'Times New Roman', Times, serif;
            text-align: center;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #000000;
            padding: 8px;
            text-align: left;
            font-size: 11pt;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .meta-info {
            margin-bottom: 25px;
            font-size: 11pt;
          }
          .section-title {
            border-bottom: 2px solid #000000;
            padding-bottom: 3px;
            margin-top: 25px;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
          }
          .sign-table {
            width: 100%;
            margin-top: 40px;
            border: none;
          }
          .sign-table td {
            border: none;
            padding: 10px;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Отчет_СТО_${startDate}_по_${endDate}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Отчёт успешно скачан в формате WORD!')
  }

  const printDocument = () => {
    window.print()
  }

  const formattedPeriodStart = new Date(startDate).toLocaleDateString('ru-RU')
  const formattedPeriodEnd = new Date(endDate).toLocaleDateString('ru-RU')
  const reportDate = new Date().toLocaleDateString('ru-RU')

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Стили для печатной страницы */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
            background: #ffffff !important;
            color: #000000 !important;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff !important;
          }
          .controls-panel {
            display: none !important;
          }
          .sidebar, aside {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      ` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="controls-panel">
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--gold)', fontFamily: 'var(--font-heading)', margin: 0 }}>
            📝 Генератор официальных отчётов СТО
          </h2>
          <p style={{ color: 'var(--gray-light)', margin: '4px 0 0 0' }}>
            Сформируйте официальную бумагу о работе автосервиса и деятельности администрации для печати или экспорта в MS Word.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px', alignItems: 'start' }} className="controls-panel">
        
        {/* Панель управления параметрами документа */}
        <div className="card" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(200, 168, 130, 0.2)' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Параметры отчёта
          </h3>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--gray-light)' }}>Дата начала периода</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--gray-light)' }}>Дата окончания периода</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--gray-light)' }}>ФИО составителя отчёта</label>
            <input 
              type="text" 
              value={adminName} 
              onChange={(e) => setAdminName(e.target.value)} 
              placeholder="ФИО администратора"
              style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--gray-light)' }}>Отчёт о работе администрации</label>
            <textarea 
              value={adminWork} 
              onChange={(e) => setAdminWork(e.target.value)} 
              rows={4}
              style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', resize: 'vertical', fontSize: '0.85rem' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--gray-light)' }}>Замечания и рекомендации по СТО</label>
            <textarea 
              value={generalRemarks} 
              onChange={(e) => setGeneralRemarks(e.target.value)} 
              rows={4}
              style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', resize: 'vertical', fontSize: '0.85rem' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#fff' }}>
              <input type="checkbox" checked={showStamp} onChange={(e) => setShowStamp(e.target.checked)} />
              Отображать круглую печать СТО
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#fff' }}>
              <input type="checkbox" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} />
              Отображать роспись администратора
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={exportToWord} disabled={loading} style={{ width: '100%' }}>
              📥 Скачать в формате Word (.doc)
            </button>
            <button className="btn btn-outline" onClick={printDocument} disabled={loading} style={{ width: '100%' }}>
              🖨️ Распечатать / Сохранить в PDF
            </button>
          </div>
        </div>

        {/* Интерактивное превью документа формата А4 */}
        <div style={{ background: '#222', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'center', background: '#333', padding: '20px 0', borderRadius: '2px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-light)', fontWeight: 'bold' }}>ПРЕДВЫБОРНЫЙ ПРОСМОТР ДОКУМЕНТА (А4)</span>
          </div>

          <div 
            id="print-area"
            style={{ 
              background: '#ffffff', 
              color: '#000000', 
              padding: '60px 50px', 
              width: '100%', 
              minHeight: '842px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontFamily: 'Times New Roman, Times, serif', 
              fontSize: '11pt',
              lineHeight: 1.5,
              position: 'relative'
            }}
          >
            <div id="report-document-container">
              {/* Шапка организации */}
              <div style={{ borderBottom: '2px double #000', paddingBottom: '10px', marginBottom: '25px', textAlign: 'center' }}>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '18pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  LOS SANTOS CUSTOMS
                </h1>
                <p style={{ margin: 0, fontSize: '9pt', fontStyle: 'italic', textTransform: 'uppercase' }}>
                  Официальный автоцентр тюнинга и ремонта • Лос-Сантос, Rodeo Drive
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '8pt' }}>
                  Email: office@lscustoms.com | Тел: 555-0199 | GPS: LS-004-CUSTOMS
                </p>
              </div>

              {/* Заголовок отчёта */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '14pt', fontWeight: 'bold' }}>
                  ОФИЦИАЛЬНЫЙ СВОДНЫЙ ОТЧЁТ
                </h2>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '11pt', fontWeight: 'normal', textTransform: 'uppercase' }}>
                  О результатах операционной деятельности СТО за период
                </h3>
                <p style={{ margin: 0, fontSize: '12pt', fontWeight: 'bold', textDecoration: 'underline' }}>
                  с {formattedPeriodStart} г. по {formattedPeriodEnd} г.
                </p>
              </div>

              {/* Раздел 1: Показатели деятельности */}
              <div>
                <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', marginTop: '20px', fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  1. Общие показатели работы автосервиса
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0' }}>
                  <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                      <th style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', width: '70%' }}>Показатель деятельности СТО</th>
                      <th style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>Значение</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Количество активных мастеров в штате</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center', fontWeight: 'bold' }}>{stats.activeEmployees} чел.</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Всего полученных отзывов за период</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center', fontWeight: 'bold' }}>{stats.reviewsCount} шт.</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Средняя оценка качества обслуживания клиентов</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center', fontWeight: 'bold' }}>{stats.reviewsCount > 0 ? `${stats.averageRating} / 5.00` : '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Раздел 2: Статистика ремонтов */}
              <div>
                <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', marginTop: '20px', fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  2. Статистика ремонтных работ и записей
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0' }}>
                  <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                      <th style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Статус записи на ремонт</th>
                      <th style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>Количество</th>
                      <th style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>Процентное соотношение</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Успешно завершено ремонтных работ (Готово)</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center', fontWeight: 'bold' }}>{stats.doneBookings}</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>
                        {stats.totalBookings > 0 ? `${Math.round((stats.doneBookings / stats.totalBookings) * 100)}%` : '0%'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Принятые активные заказы (В работе / Подтверждено)</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>{stats.confirmedBookings}</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>
                        {stats.totalBookings > 0 ? `${Math.round((stats.confirmedBookings / stats.totalBookings) * 100)}%` : '0%'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Записи, ожидающие согласования (Новые)</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>{stats.newBookings}</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>
                        {stats.totalBookings > 0 ? `${Math.round((stats.newBookings / stats.totalBookings) * 100)}%` : '0%'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Отменённые записи</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center', color: '#c0392b' }}>{stats.cancelledBookings}</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>
                        {stats.totalBookings > 0 ? `${Math.round((stats.cancelledBookings / stats.totalBookings) * 100)}%` : '0%'}
                      </td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', background: '#fafafa' }}>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>ИТОГО ОБРАБОТАНО ЗАПИСЕЙ КЛИЕНТОВ</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>{stats.totalBookings}</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Раздел 3: Заказ запчастей */}
              <div>
                <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', marginTop: '20px', fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  3. Оборот и логистика автомобильных запчастей
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0' }}>
                  <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                      <th style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Наименование категории</th>
                      <th style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>Значение</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Оформлено заявок на поставку деталей</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center' }}>{stats.totalParts} шт.</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt' }}>Сумма выполненных заказов запчастей</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center', fontWeight: 'bold' }}>$ {stats.donePartsCost.toLocaleString('ru-RU')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Раздел 4: Кадровая деятельность */}
              <div>
                <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', marginTop: '20px', fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  4. Кадровая деятельность автосервиса
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', width: '70%' }}>Подано заявок от соискателей на вакансии</td>
                      <td style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '10pt', textAlign: 'center', fontWeight: 'bold' }}>{stats.newApplications} шт.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Раздел 5: Отчет о проделанной работе администрации */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  5. Отчёт о проделанной работе администратора
                </div>
                <p style={{ fontSize: '10.5pt', textIndent: '25px', textAlign: 'justify', marginTop: '8px', marginBottom: 0 }}>
                  {adminWork || 'Информация о проделанной работе не внесена.'}
                </p>
              </div>

              {/* Раздел 6: Рекомендации и замечания */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ borderBottom: '1px solid #000', paddingBottom: '2px', fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  6. Выводы и замечания по работе СТО
                </div>
                <p style={{ fontSize: '10.5pt', textIndent: '25px', textAlign: 'justify', marginTop: '8px', marginBottom: 0 }}>
                  {generalRemarks || 'Замечания и рекомендации отсутствуют.'}
                </p>
              </div>

              {/* Блок подписей и печати */}
              <div style={{ marginTop: '45px', position: 'relative' }}>
                <table style={{ width: '100%', border: 'none', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: 'none', padding: '5px 0', fontSize: '10.5pt', width: '40%' }}>
                        Документ составлен:<br />
                        <strong>{adminName || 'Администратор СТО'}</strong>
                      </td>
                      <td style={{ border: 'none', padding: '5px 0', fontSize: '10.5pt', width: '30%', verticalAlign: 'bottom', position: 'relative' }}>
                        Подпись: 
                        {showSignature && (
                          <span style={{ 
                            fontFamily: 'Caveat, Brush Script MT, cursive', 
                            fontSize: '19pt', 
                            color: '#1a237e', 
                            position: 'absolute', 
                            bottom: '2px', 
                            left: '60px',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            transform: 'rotate(-4deg)'
                          }}>
                            {adminName ? adminName.split(' ')[0] : 'Admin'}
                          </span>
                        )}
                        <span style={{ display: 'inline-block', width: '100px', borderBottom: '1px solid #000', marginLeft: '5px' }}></span>
                      </td>
                      <td style={{ border: 'none', padding: '5px 0', fontSize: '10.5pt', width: '30%', textAlign: 'right', verticalAlign: 'bottom' }}>
                        Дата: <u>{reportDate} г.</u>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Гербовая круглая печать */}
                {showStamp && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '-25px', 
                    left: '50%', 
                    transform: 'translateX(-50%) rotate(8deg)', 
                    width: '105px', 
                    height: '105px', 
                    borderRadius: '50%', 
                    border: '3px double rgba(26, 35, 126, 0.75)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'rgba(26, 35, 126, 0.75)', 
                    fontSize: '6.5pt', 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    pointerEvents: 'none',
                    lineHeight: '1.2',
                    padding: '8px',
                    boxSizing: 'border-box',
                    background: 'transparent'
                  }}>
                    <div style={{ border: '1px solid rgba(26, 35, 126, 0.75)', borderRadius: '50%', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '4.5pt', letterSpacing: '0.5px' }}>LS CUSTOMS</span>
                      <span style={{ fontSize: '7pt' }}>★ ★ ★</span>
                      <span style={{ fontSize: '5pt', textTransform: 'uppercase' }}>УТВЕРЖДЕНО</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
