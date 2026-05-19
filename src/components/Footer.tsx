import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--dark) 0%, var(--black) 100%)',
      borderTop: '1px solid var(--border)',
      padding: '50px 0 30px',
      marginTop: 'auto',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)',
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              letterSpacing: '0.1em',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <path d="M19 16V8C19 6.89543 18.1046 6 17 6H7C5.89543 6 5 6.89543 5 8V16M19 16L21 18M19 16H5M5 16L3 18M9 10H15M9 13H15"/>
              </svg>
              LS <span style={{ color: 'var(--gold)' }}>CUSTOMS</span>
            </div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Профессиональный ремонт и тюнинг автомобилей
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              marginBottom: 16,
              color: 'var(--gold)',
              letterSpacing: '0.05em',
            }}>
              Быстрые ссылки
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { to: '/services', label: 'Услуги' },
                { to: '/team', label: 'Коллектив' },
                { to: '/booking', label: 'Запись' },
                { to: '/gallery', label: 'Галерея' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: 'var(--gray)',
                    fontSize: '0.88rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--gold)'
                    e.currentTarget.style.paddingLeft = '8px'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--gray)'
                    e.currentTarget.style.paddingLeft = '0'
                  }}
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              marginBottom: 16,
              color: 'var(--gold)',
              letterSpacing: '0.05em',
            }}>
              Контакты
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ color: 'var(--gray)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Los Santos, Rodeo
              </div>
              <div style={{ color: 'var(--gray)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                Мы в GPS: 25-46
              </div>
              <div style={{ color: 'var(--gray)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                511-515
              </div>
              <div style={{ color: 'var(--gray)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                24/7
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
            © 2026 LS Customs. Все права защищены.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link
              to="/contacts"
              style={{
                color: 'var(--gray)',
                fontSize: '0.85rem',
                transition: 'color 0.3s ease',
              }}
            >
              Контакты
            </Link>
            <Link
              to="/vacancies"
              style={{
                color: 'var(--gray)',
                fontSize: '0.85rem',
                transition: 'color 0.3s ease',
              }}
            >
              Вакансии
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
