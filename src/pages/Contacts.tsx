import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ContactInfo } from '../types'

const DEFAULT: ContactInfo = {
  id: 1,
  discord: 'discord.gg/ls-auto',
  telegram: '@ls_auto_shop',
  phone: '511-515',
  address: 'Los Santos, Rodeo',
  gps: '25-46',
}

export default function Contacts() {
  const [info, setInfo] = useState<ContactInfo>(DEFAULT)

  useEffect(() => {
    supabase.from('contacts').select('*').single().then(({ data }) => {
      if (data) {
        setInfo(prev => ({
          ...prev,
          ...data,
          phone: data.phone && (data.phone.includes('+7') || data.phone.includes('800')) ? '511-515' : data.phone || prev.phone,
          address: data.address && data.address.includes('Grove Street') ? 'Los Santos, Rodeo' : data.address || prev.address,
          gps: data.gps && data.gps.includes('2546') ? '25-46' : data.gps || prev.gps,
        }))
      }
    })
  }, [])

  return (
    <section className="section">
      <div className="container">
        {/* Встроенные CSS стили для страницы Контактов */}
        <style dangerouslySetInnerHTML={{ __html: `
          .contacts-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 40px;
            align-items: start;
          }
          @media (max-width: 992px) {
            .contacts-grid {
              grid-template-columns: 1fr;
              gap: 32px;
            }
          }

          .contact-item-card {
            background: linear-gradient(135deg, rgba(28, 28, 30, 0.45) 0%, rgba(16, 16, 18, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 2px;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            gap: 20px;
            transition: all 0.25s ease;
          }
          .contact-item-card:hover {
            border-color: rgba(200, 168, 130, 0.3);
            transform: translateX(4px);
            box-shadow: 0 5px 15px rgba(200, 168, 130, 0.04);
          }

          .contact-icon-wrapper {
            background: rgba(200, 168, 130, 0.08);
            border: 1px solid rgba(200, 168, 130, 0.2);
            color: var(--primary);
            width: 52px;
            height: 52px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.3s ease;
          }
          .contact-icon-wrapper svg {
            transition: transform 0.3s ease, color 0.3s ease;
          }
          .contact-item-card:hover .contact-icon-wrapper {
            background: rgba(200, 168, 130, 0.15);
            border-color: var(--primary);
            box-shadow: 0 0 10px rgba(200, 168, 130, 0.15);
          }
          .contact-item-card:hover .contact-icon-wrapper svg {
            transform: scale(1.12) rotate(4deg);
            color: var(--primary-light);
          }

          .hud-panel {
            background: linear-gradient(135deg, rgba(200, 168, 130, 0.06) 0%, rgba(200, 168, 130, 0.01) 100%);
            border: 1px solid rgba(200, 168, 130, 0.25);
            border-radius: 2px;
            padding: 30px;
            position: relative;
            overflow: hidden;
          }

          /* Пульсирующий индикатор работы */
          .status-pulse-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .status-pulse {
            width: 10px;
            height: 10px;
            background: #2ebd59;
            border-radius: 50%;
            box-shadow: 0 0 0 0 rgba(46, 189, 89, 0.7);
            animation: pulse-green 1.8s infinite;
          }
          @keyframes pulse-green {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(46, 189, 89, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 8px rgba(46, 189, 89, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(46, 189, 89, 0);
            }
          }

          .gps-tag-hud {
            font-family: var(--font-condensed);
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(200, 168, 130, 0.15);
            padding: 12px 18px;
            border-radius: 2px;
            margin-top: 20px;
          }
        ` }} />

        <h1 className="section-title">Контакты</h1>
        <p style={{ color: 'var(--gray-light)', marginBottom: 40 }}>
          Свяжитесь с нами напрямую или найдите наше СТО на улицах Лос Сантоса.
        </p>

        <div className="contacts-grid">
          {/* Левая колонка - Карточки контактов */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Телефон */}
            <div className="contact-item-card">
              <div className="contact-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div style={{ color: 'var(--gray-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
                  Контактный телефон
                </div>
                <a href={`tel:${info.phone}`} style={{ fontSize: '1.25rem', color: 'var(--white)', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'var(--font-heading)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--white)'}>
                  {info.phone}
                </a>
              </div>
            </div>

            {/* GPS */}
            <div className="contact-item-card">
              <div className="contact-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="22" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="12" x2="2" y2="12" />
                  <line x1="12" y1="6" x2="12" y2="2" />
                  <line x1="12" y1="22" x2="12" y2="18" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ color: 'var(--gray-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
                  Навигатор (GPS)
                </div>
                <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
                  Мы в GPS: {info.gps}
                </span>
              </div>
            </div>

            {/* Адрес */}
            <div className="contact-item-card">
              <div className="contact-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ color: 'var(--gray-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
                  Адрес СТО
                </div>
                <span style={{ fontSize: '1.15rem', color: 'var(--white)', fontWeight: 600 }}>
                  {info.address}
                </span>
              </div>
            </div>

            {/* Tagger */}
            <div className="contact-item-card">
              <div className="contact-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                  <line x1="9" y1="6" x2="15" y2="6" />
                </svg>
              </div>
              <div>
                <div style={{ color: 'var(--gray-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
                  Мы в TAGGER
                </div>
                <a
                  href="https://tagger.gambit-rp.com/pages/LSCustoms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.82rem',
                    padding: '6px 14px',
                    borderRadius: 2,
                    fontFamily: 'var(--font-condensed)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(200, 168, 130, 0.15)'
                  }}
                >
                  Открыть профиль
                </a>
              </div>
            </div>
          </div>

          {/* Правая колонка - Статус и HUD панель навигатора */}
          <div className="hud-panel">
            <div className="status-pulse-container">
              <span className="status-pulse" />
              <strong style={{ fontSize: '0.82rem', color: '#2ebd59', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                СТО Работает • 24/7
              </strong>
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--white)', marginBottom: 12, letterSpacing: '0.04em' }}>
              КАК НАС НАЙТИ
            </h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Наш автосервис располагается на одной из самых престижных и оживлённых улиц города — <strong style={{ color: 'var(--white)' }}>Rodeo</strong>. Найти нас можно по следующим ориентирам:
            </p>

            <div className="gps-tag-hud">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--gray-light)' }}>Улица:</span>
                  <strong style={{ color: 'var(--white)', letterSpacing: '0.5px' }}>Los Santos, Rodeo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--gray-light)' }}>Координаты GPS:</span>
                  <strong style={{ color: 'var(--primary)', letterSpacing: '0.5px' }}>25-46</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--gray-light)' }}>Телефон СТО:</span>
                  <strong style={{ color: 'var(--white)', letterSpacing: '0.5px' }}>511-515</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
