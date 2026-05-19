import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import { supabase } from '../lib/supabase'
import { checkRateLimit, formatRetryAfter } from '../lib/rateLimit'
import { sanitizeString, sanitizePhone } from '../lib/sanitize'
import type { Booking as BookingType } from '../types'
import { servicesData, ServiceItem } from './Services'

type FormData = {
  client_name: string
  phone: string
  preferred_date: string
  comment: string
}

export default function Booking() {
  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [rateLimited, setRateLimited] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [voucherNo] = useState(() => `LSC-${Math.floor(100000 + Math.random() * 900000)}`)
  const [dbServices, setDbServices] = useState<{ id: number; name: string }[]>([])

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>()

  // Наблюдаем за изменением полей формы для живого вывода в чек
  const watchName = watch('client_name', '')
  const watchPhone = watch('phone', '')
  const watchDate = watch('preferred_date', '')
  const watchComment = watch('comment', '')

  // Вспомогательная функция для получения даты от 18.05.2026 и далее
  const getLocalDateString = () => {
    const d = new Date()
    const targetStart = new Date('2026-05-18')
    const activeDate = d > targetStart ? d : targetStart
    
    const year = activeDate.getFullYear()
    const month = String(activeDate.getMonth() + 1).padStart(2, '0')
    const day = String(activeDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    // Автоматический выбор услуги при переходе со страницы Услуг
    const params = new URLSearchParams(window.location.search)
    const itemParam = params.get('item')
    if (itemParam) {
      let foundItem: ServiceItem | undefined
      for (const cat of servicesData) {
        const match = cat.items.find(i => i.name === itemParam)
        if (match) {
          foundItem = match
          break
        }
      }
      if (foundItem) {
        setSelectedItems([foundItem])
      }
    }

    // Устанавливаем минимальную дату по умолчанию
    setValue('preferred_date', getLocalDateString())

    // Загрузка данных пользователя
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
          if (data) {
            setValue('client_name', data.full_name || '')
            setValue('phone', data.phone || '')
          }
        })
      }
    })

    // Загрузка зарегистрированных услуг из БД для защиты от внешних ключей
    supabase.from('services').select('id, name').then(({ data }) => {
      if (data) setDbServices(data)
    })
  }, [setValue])

  const toggleItem = (item: ServiceItem) => {
    setSelectedItems(prev => {
      const exists = prev.some(i => i.id === item.id)
      if (exists) {
        return prev.filter(i => i.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value
    if (!selectedName) return
    
    let foundItem: ServiceItem | undefined
    for (const cat of servicesData) {
      const match = cat.items.find(i => i.name === selectedName)
      if (match) {
        foundItem = match
        break
      }
    }

    if (foundItem) {
      setSelectedItems(prev => {
        if (prev.some(i => i.id === foundItem!.id)) return prev
        return [...prev, foundItem!]
      })
    }
    
    e.target.value = '' // Сброс выбора
  }

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0)
  const total = subtotal

  // Скачивание накладной как картинки
  const downloadReceipt = async (format: 'png' | 'jpeg') => {
    const element = document.getElementById('lsc-paper-receipt')
    if (!element) return

    const toastId = toast.loading('Формирование изображения накладной...')
    
    try {
      // Клонируем и настраиваем скриншотер html2canvas
      const canvas = await html2canvas(element, {
        scale: 2.5, // Повышенная четкость и качество
        useCORS: true,
        backgroundColor: '#eae7de',
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      })
      
      const image = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.98)
      const link = document.createElement('a')
      link.href = image
      link.download = `ls-customs-invoice-${voucherNo}.${format}`
      link.click()
      
      toast.dismiss(toastId)
      toast.success(`Накладная успешно сохранена как ${format.toUpperCase()}!`)
    } catch (err) {
      console.error(err)
      toast.dismiss(toastId)
      toast.error('Не удалось сохранить накладную как изображение.')
    }
  }

  const onSubmit = async (data: FormData) => {
    if (selectedItems.length === 0) {
      toast.error('Выберите хотя бы одну деталь или услугу!')
      return
    }

    const rl = checkRateLimit('booking')
    if (!rl.allowed) {
      setRateLimited(`Слишком много заявок. Попробуйте через ${formatRetryAfter(rl.retryAfterMs)}.`)
      return
    }
    setRateLimited(null)
    setSubmitting(true)

    // Формируем детальный список заказа
    const servicesText = selectedItems.map(item => `- ${item.name} ($${item.price.toLocaleString()})`).join('\n')
    const finalComment = `[LS CUSTOMS INVOICE ${voucherNo}]\nЗаказанные детали/услуги:\n${servicesText}\n\nИтоговая стоимость: $${total.toLocaleString()}\n\nКомментарий клиента:\n${sanitizeString(data.comment || 'Нет комментариев')}`

    const matchedService = dbServices.find(s => s.name.toLowerCase() === selectedItems[0]?.name.toLowerCase())
    const serviceIdToSave = matchedService ? matchedService.id : null

    const payload: BookingType = {
      client_name: sanitizeString(data.client_name),
      phone: sanitizePhone(data.phone),
      service_id: serviceIdToSave as any, // Предотвращаем ошибку внешнего ключа
      preferred_date: data.preferred_date,
      comment: finalComment,
      status: 'new',
      user_id: user?.id,
      email: user?.email,
    }

    const { error } = await supabase.from('bookings').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error('Ошибка при отправке. Попробуйте позже.')
    } else {
      toast.success('Заказ и запись успешно оформлены! Накладная отправлена.')
      setSelectedItems([])
      reset()
    }
  }

  // Процедурный штрих-код из линий разной ширины
  const Barcode = () => {
    const lines = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 2, 1, 3, 2, 1, 2, 4, 1, 2];
    return (
      <div className="receipt-barcode">
        <div className="barcode-visual">
          {lines.map((width, idx) => (
            <span
              key={idx}
              className="barcode-line"
              style={{
                display: 'inline-block',
                background: '#1c1b18',
                height: '32px',
                width: `${width}px`,
                margin: '0 1px'
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.7rem', display: 'block', marginTop: 4 }}>*{voucherNo}*</span>
      </div>
    )
  }

  return (
    <section className="section">
      <div className="container">
        {/* Встроенные CSS стили для разметки Booking с калькулятором и накладной */}
        <style dangerouslySetInnerHTML={{ __html: `
          .booking-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 40px;
            align-items: start;
          }
          @media (max-width: 992px) {
            .booking-grid {
              grid-template-columns: 1fr;
              gap: 32px;
            }
          }

          /* Стилизация физической бумажной накладной */
          .paper-receipt-container {
            position: sticky;
            top: 100px;
          }
          
          .paper-receipt {
            background: #eae7de;
            color: #1c1b18;
            padding: 36px 28px;
            position: relative;
            font-family: 'Courier New', Courier, monospace;
            box-shadow: 0 20px 45px rgba(0,0,0,0.7);
            border-radius: 2px;
          }

          /* Зигзагообразные края чека сверху и снизу */
          .paper-receipt::before {
            content: '';
            position: absolute;
            top: -8px;
            left: 0;
            width: 100%;
            height: 8px;
            background-image: linear-gradient(135deg, transparent 50%, #eae7de 50%), linear-gradient(225deg, transparent 50%, #eae7de 50%);
            background-size: 16px 8px;
            background-repeat: repeat-x;
            z-index: 2;
          }
          .paper-receipt::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 8px;
            background-image: linear-gradient(45deg, transparent 50%, #eae7de 50%), linear-gradient(315deg, transparent 50%, #eae7de 50%);
            background-size: 16px 8px;
            background-repeat: repeat-x;
            z-index: 2;
          }

          .receipt-header {
            text-align: center;
            margin-bottom: 24px;
          }

          .receipt-logo-txt {
            font-size: 1.4rem;
            font-weight: bold;
            letter-spacing: 3px;
            color: #000;
            text-transform: uppercase;
            margin: 0 0 6px;
          }

          .receipt-meta {
            font-size: 0.8rem;
            color: #4a4a45;
            line-height: 1.5;
            border-bottom: 1px dashed #7a7a70;
            padding-bottom: 14px;
            margin-bottom: 16px;
          }

          .receipt-items {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 220px;
            overflow-y: auto;
            margin: 16px 0;
            padding-right: 4px;
          }
          .receipt-items::-webkit-scrollbar {
            width: 4px;
          }
          .receipt-items::-webkit-scrollbar-thumb {
            background: #9a9a90;
            border-radius: 2px;
          }

          .receipt-item-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-size: 0.85rem;
          }

          .receipt-item-name {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: bold;
            max-width: 75%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .receipt-item-dots {
            flex-grow: 1;
            border-bottom: 1px dotted #7a7a70;
            margin: 0 8px;
          }

          .receipt-item-price {
            font-weight: bold;
          }

          .receipt-remove-btn {
            background: none;
            border: none;
            color: #b52b2b;
            cursor: pointer;
            font-size: 0.8rem;
            padding: 0 4px;
            font-weight: bold;
          }

          .receipt-divider {
            border-top: 1px dashed #7a7a70;
            margin: 16px 0;
          }

          .receipt-total-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-weight: bold;
            font-size: 1.25rem;
            color: #000;
            margin-top: 12px;
          }

          .receipt-barcode {
            text-align: center;
            margin-top: 28px;
            color: #1c1b18;
          }
          
          .barcode-visual {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          /* Красный штамп APPROVED */
          .stamp-container {
            display: flex;
            justify-content: center;
            margin-top: 10px;
          }
          .approved-stamp {
            border: 3px double #b52b2b;
            color: #b52b2b;
            font-size: 0.95rem;
            font-weight: bold;
            text-transform: uppercase;
            padding: 4px 16px;
            transform: rotate(-10deg);
            border-radius: 4px;
            opacity: 0.85;
            font-family: 'Oswald', sans-serif;
            letter-spacing: 2px;
            display: inline-block;
          }

          /* Кастомный выпадающий список для быстрого выбора */
          .dropdown-group {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(200, 168, 130, 0.15);
            border-radius: 2px;
            padding: 24px;
            margin-bottom: 30px;
          }
          
          .premium-dropdown {
            width: 100%;
            padding: 14px 20px;
            font-size: 1rem;
            border: 1px solid rgba(200, 168, 130, 0.4);
            background: #141414;
            color: var(--white);
            cursor: pointer;
            outline: none;
            font-family: var(--font-condensed);
            letter-spacing: 0.05em;
            transition: all 0.25s ease;
            appearance: none;
          }
          .premium-dropdown:focus {
            border-color: var(--primary);
            box-shadow: 0 0 10px rgba(200, 168, 130, 0.25);
          }
          
          .dropdown-wrapper {
            position: relative;
          }
          .dropdown-wrapper::after {
            content: '▼';
            font-size: 0.75rem;
            color: var(--primary);
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            pointer-events: none;
          }

          .service-selection-section {
            margin-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 32px;
          }

          .service-category-group {
            margin-bottom: 30px;
          }

          .service-category-title {
            font-family: var(--font-heading);
            font-size: 1.15rem;
            color: var(--primary);
            margin-bottom: 16px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border-left: 2px solid var(--primary);
            padding-left: 10px;
          }

          .checkbox-card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 12px;
          }

          .checkbox-card {
            background: rgba(255, 255, 255, 0.015);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 2px;
            padding: 14px 18px;
            cursor: pointer;
            transition: all 0.22s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            user-select: none;
          }
          .checkbox-card:hover {
            background: rgba(200, 168, 130, 0.04);
            border-color: rgba(200, 168, 130, 0.25);
          }
          .checkbox-card.selected {
            background: rgba(200, 168, 130, 0.08);
            border-color: var(--primary);
            box-shadow: 0 0 12px rgba(200, 168, 130, 0.12);
          }

          .checkbox-card-name {
            font-size: 0.92rem;
            color: var(--white);
            font-weight: 500;
          }
          .checkbox-card-price {
            font-family: var(--font-heading);
            color: var(--primary);
            font-size: 1.15rem;
            white-space: nowrap;
          }
        ` }} />

        <h1 className="section-title">Калькуляция и запись на ремонт</h1>
        <p style={{ color: 'var(--gray-light)', marginBottom: 40 }}>
          Выбирайте доработки через удобный выпадающий список или каталог ниже — накладная LS CUSTOMS мгновенно рассчитает общую стоимость.
        </p>

        {rateLimited && <div className="rate-limit-notice">⚠ {rateLimited}</div>}

        <div className="booking-grid">
          {/* Левая колонка - Форма клиента, Быстрый выбор и Каталог деталей */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="card" style={{ marginBottom: 30 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 20, color: 'var(--white)' }}>
                  Информация о владельце
                </h3>
                
                <div className="form-group">
                  <label>Ваше имя *</label>
                  <input
                    {...register('client_name', { required: 'Введите имя', maxLength: { value: 100, message: 'Слишком длинное имя' } })}
                    placeholder="Например: Carl Johnson"
                    autoComplete="name"
                  />
                  {errors.client_name && <div className="form-error">{errors.client_name.message}</div>}
                </div>

                <div className="form-group">
                  <label>Контактный телефон *</label>
                  <input
                    {...register('phone', {
                      required: 'Введите телефон',
                      pattern: { value: /^[\d+\-() ]{6,20}$/, message: 'Некорректный номер' },
                    })}
                    placeholder="511-515"
                    autoComplete="tel"
                    type="tel"
                  />
                  {errors.phone && <div className="form-error">{errors.phone.message}</div>}
                </div>

                <div className="form-group">
                  <label>Желаемая дата визита * (Минимум: 18.05.2026)</label>
                  <input
                    type="date"
                    {...register('preferred_date', {
                      required: 'Выберите дату',
                      validate: (val) => {
                        const selected = new Date(val)
                        const minDate = new Date('2026-05-18')
                        selected.setHours(0,0,0,0)
                        minDate.setHours(0,0,0,0)
                        return selected >= minDate || 'Минимальная разрешённая дата: 18.05.2026'
                      }
                    })}
                    min={getLocalDateString()}
                  />
                  {errors.preferred_date && <div className="form-error">{errors.preferred_date.message}</div>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Комментарий / Пожелания к тюнингу</label>
                  <textarea
                    {...register('comment', { maxLength: { value: 500, message: 'Максимум 500 символов' } })}
                    placeholder="Укажите модель машины или особенности установки деталей..."
                    rows={3}
                  />
                  {errors.comment && <div className="form-error">{errors.comment.message}</div>}
                </div>
              </div>

              {/* Быстрый выбор из выпадающего окна */}
              <div className="dropdown-group">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 12, color: 'var(--white)', letterSpacing: '0.05em' }}>
                  Быстрый поиск и выбор услуг
                </h3>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', marginBottom: 16 }}>
                  Выберите любую деталь из выпадающего списка ниже, чтобы мгновенно добавить её в накладную:
                </p>
                <div className="dropdown-wrapper">
                  <select className="premium-dropdown" onChange={handleDropdownSelect} defaultValue="">
                    <option value="">+ Добавить деталь или услугу...</option>
                    {servicesData.map(category => (
                      <optgroup key={category.id} label={category.title}>
                        {category.items.map(item => (
                          <option key={item.id} value={item.name}>
                            {item.name} (${item.price.toLocaleString()})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Секция выбора деталей из каталога (Checkbox Cards) */}
              <div className="service-selection-section">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: 24, color: 'var(--white)', letterSpacing: '0.05em' }}>
                  Выбор из каталога услуг
                </h3>

                {servicesData.map(category => (
                  <div key={category.id} className="service-category-group">
                    <h4 className="service-category-title">{category.title}</h4>
                    <div className="checkbox-card-grid">
                      {category.items.map(item => {
                        const isSelected = selectedItems.some(i => i.id === item.id)
                        return (
                          <div
                            key={item.id}
                            className={`checkbox-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleItem(item)}
                          >
                            <span className="checkbox-card-name">{item.name}</span>
                            <span className="checkbox-card-price">${item.price.toLocaleString()}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Правая колонка - Реалистичная накладная СТО (Paper Receipt) */}
          <div className="paper-receipt-container">
            <div className="paper-receipt" id="lsc-paper-receipt">
              <div className="receipt-header">
                <h2 className="receipt-logo-txt">LS CUSTOMS</h2>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  Professional Car Tuning
                </div>
                <div style={{ fontSize: '0.7rem', color: '#5a5a50', marginTop: 4 }}>
                  Los Santos, Rodeo • GPS: 25-46
                </div>
              </div>

              {/* Мета-информация накладной */}
              <div className="receipt-meta">
                <div><strong>INVOICE NO:</strong> {voucherNo}</div>
                <div><strong>DATE:</strong> {watchDate ? new Date(watchDate).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU')}</div>
                <div><strong>CLIENT:</strong> {watchName ? watchName.toUpperCase() : 'WALK-IN CUSTOMER'}</div>
                <div><strong>PHONE:</strong> {watchPhone || 'N/A'}</div>
                <div><strong>CASHIER:</strong> MECHANICS TEAM</div>
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #7a7a70', paddingBottom: 6 }}>
                Description of Work
              </div>

              {/* Список выбранных услуг */}
              <div className="receipt-items">
                {selectedItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', fontSize: '0.85rem', color: '#6a6a60', fontStyle: 'italic' }}>
                    --- EMPTY INVOICE ---<br />
                    Select services from left menu.
                  </div>
                ) : (
                  selectedItems.map(item => (
                    <div key={item.id} className="receipt-item-row">
                      <span className="receipt-item-name">
                        <button type="button" className="receipt-remove-btn" onClick={() => toggleItem(item)}>✕</button>
                        {item.name}
                      </span>
                      <span className="receipt-item-dots" />
                      <span className="receipt-item-price">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="receipt-divider" />

              {/* Расчет налога/услуг и Итог */}
              <div className="receipt-item-row" style={{ fontSize: '0.8rem', color: '#4a4a45' }}>
                <span>SUBTOTAL</span>
                <span className="receipt-item-dots" />
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="receipt-item-row" style={{ fontSize: '0.8rem', color: '#4a4a45' }}>
                <span>INSTALLATION FEE (0%)</span>
                <span className="receipt-item-dots" />
                <span>$0</span>
              </div>

              <div className="receipt-divider" style={{ borderTop: '2px solid #1c1b18' }} />

              <div className="receipt-total-row">
                <span>TOTAL DUE</span>
                <span style={{ fontSize: '1.45rem' }}>${total.toLocaleString()}</span>
              </div>

              {/* Примечание клиента на бумажной накладной */}
              {watchComment && (
                <div style={{ marginTop: 14, borderTop: '1px dashed #8a8a7f', paddingTop: 8, fontSize: '0.76rem', color: '#4a4a40', fontStyle: 'italic', wordBreak: 'break-word', fontFamily: 'Courier New, monospace', textAlign: 'left', lineHeight: 1.3 }}>
                  <strong>CUSTOMER NOTES:</strong><br />
                  {watchComment}
                </div>
              )}

              {/* Штамп APPROVED */}
              {selectedItems.length > 0 && (
                <div className="stamp-container">
                  <div className="approved-stamp">
                    LS CUSTOMS APPROVED
                  </div>
                </div>
              )}

              {/* Штрих-код */}
              <Barcode />
            </div>

            {/* Возможность скачать накладную как PNG / JPG */}
            {selectedItems.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => downloadReceipt('png')}
                  className="btn"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--white)',
                    fontSize: '0.85rem',
                    padding: '10px 0',
                    fontFamily: 'var(--font-condensed)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 168, 130, 0.12)'
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.color = 'var(--primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.color = 'var(--white)'
                  }}
                >
                  💾 СКАЧАТЬ PNG
                </button>
                <button
                  type="button"
                  onClick={() => downloadReceipt('jpeg')}
                  className="btn"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--white)',
                    fontSize: '0.85rem',
                    padding: '10px 0',
                    fontFamily: 'var(--font-condensed)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 168, 130, 0.12)'
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.color = 'var(--primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.color = 'var(--white)'
                  }}
                >
                  💾 СКАЧАТЬ JPG
                </button>
              </div>
            )}

            {/* Кнопка отправки накладной */}
            <button
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '18px 0', fontSize: '1rem', marginTop: 16, fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}
            >
              {submitting ? 'Оформление накладной...' : 'Подтвердить и отправить накладную'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
