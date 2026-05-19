import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '95vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1410 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/fotka.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          filter: 'grayscale(30%)',
        }} />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(26,20,16,0.85) 50%, rgba(10,10,15,0.95) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800, animation: 'fadeInUp 0.8s ease-out' }}>
            <div style={{
              color: 'var(--gold)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.15em',
              fontSize: '0.85rem',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ width: 40, height: 2, background: 'var(--gold)' }} />
              LOS SANTOS — 2026
            </div>

            <h1 style={{
              fontSize: 'clamp(3rem, 9vw, 6.5rem)',
              lineHeight: 0.95,
              marginBottom: 32,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}>
              LS <span style={{ color: 'var(--gold)' }}>CUSTOMS</span>
            </h1>

            <p style={{
              color: 'var(--gray-light)',
              fontSize: '1.2rem',
              marginBottom: 48,
              lineHeight: 1.7,
              maxWidth: 600,
            }}>
              Профессиональный ремонт, тюнинг и обслуживание автомобилей. Работаем быстро, качественно.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary" style={{ animation: 'slideInRight 0.6s ease-out 0.2s both' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Записаться
              </Link>
              <Link to="/services" className="btn btn-outline" style={{ animation: 'slideInRight 0.6s ease-out 0.3s both' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                Наши услуги
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'fadeInUp 1s ease-out 0.8s both',
        }}>
          <div style={{
            width: 24,
            height: 40,
            border: '2px solid var(--gold)',
            borderRadius: 12,
            position: 'relative',
          }}>
            <div style={{
              width: 4,
              height: 8,
              background: 'var(--gold)',
              borderRadius: 2,
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      {/* О нас */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <h2 className="section-title">Что мы делаем</h2>
          <div className="grid-2">
            {[
              { 
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
                title: 'Ремонт любой сложности', 
                desc: 'Двигатель, подвеска, трансмиссия — берёмся за всё. Опытные механики с реальным стажем.', 
                color: 'var(--gold)' 
              },
              { 
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
                title: 'Тюнинг и покраска', 
                desc: 'Кастомные обвесы, покраска в любой цвет, аэрография. Твой райд будет выделяться.', 
                color: 'var(--gold)' 
              },
              { 
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
                title: 'Диагностика', 
                desc: 'Компьютерная диагностика всех систем. Найдём проблему до того, как она станет дорогой.', 
                color: 'var(--gold)' 
              },
              { 
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
                title: 'Запчасти под заказ', 
                desc: 'Оригинальные и аналоговые детали. Быстрая доставка, честные цены.', 
                color: 'var(--gold)' 
              },
            ].map((item, i) => (
              <div key={i} className="card glow-on-hover" style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}>
                <div className="icon-box" style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44` }}>
                  {item.icon}
                </div>
                <h3 style={{ marginBottom: 12, fontSize: '1.2rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--dark2) 0%, var(--dark) 100%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            textAlign: 'center',
          }}>
            {[
              { value: '500+', label: 'Довольных клиентов' },
              { value: '10+', label: 'Лет опыта' },
              { value: '24/7', label: 'Поддержка' },
              { value: '100%', label: 'Гарантия качества' },
            ].map((stat, i) => (
              <div key={i} style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}>
                <div style={{
                  fontSize: '3rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  color: 'var(--gold)',
                  marginBottom: 8,
                }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--gray-light)', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="card glass" style={{
            textAlign: 'center',
            padding: '60px 40px',
            background: 'linear-gradient(135deg, rgba(200, 168, 130, 0.05) 0%, rgba(200, 168, 130, 0.1) 100%)',
            border: '1px solid var(--gold)44',
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: 20 }}>Готов записаться?</h2>
            <p style={{ color: 'var(--gray-light)', marginBottom: 32, fontSize: '1.05rem', maxWidth: 600, margin: '0 auto 32px' }}>
              Оставь заявку — перезвоним и согласуем время. Первая диагностика бесплатно.
            </p>
            <Link to="/booking" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Записаться на ремонт
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
