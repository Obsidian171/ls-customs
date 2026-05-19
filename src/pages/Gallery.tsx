import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryItem } from '../types'

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Все')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false })
        setItems(data || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Красивое форматирование даты на русском языке
  const formatRussianDate = (dateStr?: string) => {
    if (!dateStr) return '18 мая 2026'
    const date = new Date(dateStr)
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const categories = ['Все', ...Array.from(new Set(items.map(i => i.category)))]
  const filtered = filter === 'Все' ? items : items.filter(i => i.category === filter)

  return (
    <section className="section">
      <div className="container">
        {/* Встроенные CSS стили для новостной галереи */}
        <style dangerouslySetInnerHTML={{ __html: `
          .news-feed-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
            gap: 30px;
          }
          @media (max-width: 768px) {
            .news-feed-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
          }

          .news-card {
            background: linear-gradient(135deg, rgba(28, 28, 30, 0.45) 0%, rgba(16, 16, 18, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 2px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            position: relative;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
          }
          .news-card:hover {
            transform: translateY(-6px);
            border-color: rgba(200, 168, 130, 0.3);
            box-shadow: 0 15px 35px rgba(200, 168, 130, 0.08);
          }

          .news-card-img-wrapper {
            width: 100%;
            height: 230px;
            position: relative;
            overflow: hidden;
            background: #0f0f10;
          }
          
          .news-card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          .news-card:hover .news-card-img {
            transform: scale(1.06);
          }

          .news-card-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(16, 16, 18, 0.85);
            border: 1px solid var(--primary);
            color: var(--primary);
            font-family: var(--font-heading);
            font-size: 0.72rem;
            padding: 4px 10px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            border-radius: 2px;
            z-index: 2;
          }

          .news-card-content {
            padding: 24px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }

          .news-card-date {
            font-size: 0.8rem;
            color: var(--primary);
            font-weight: 500;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
            font-family: var(--font-heading);
          }

          .news-card-title {
            font-family: var(--font-heading);
            font-size: 1.25rem;
            color: var(--white);
            margin-bottom: 12px;
            line-height: 1.35;
          }

          .news-card-desc {
            font-size: 0.9rem;
            color: var(--gray-light);
            line-height: 1.55;
            margin-bottom: 20px;
            flex-grow: 1;
          }

          .news-card-action {
            font-family: var(--font-condensed);
            color: var(--primary);
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            align-self: flex-start;
            transition: color 0.2s;
          }
          .news-card:hover .news-card-action {
            color: var(--white);
          }

          .news-empty-placeholder {
            text-align: center;
            padding: 60px 30px;
            border: 1px dashed rgba(200, 168, 130, 0.2);
            border-radius: 2px;
            background: rgba(28, 28, 30, 0.35);
            max-width: 620px;
            margin: 40px auto;
          }
        ` }} />

        <h1 className="section-title">Наши работы</h1>
        <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
          Свежие проекты и отчёты о модификациях из первых уст мастеров LS CUSTOMS.
        </p>

        {/* Фильтры категорий */}
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 2 }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loader">Загрузка проектов...</div>
        ) : items.length === 0 ? (
          /* Премиальная заглушка при пустой ленте */
          <div className="news-empty-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.85 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--white)', marginBottom: 10 }}>
              Лента проектов формируется
            </h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Здесь пока пусто. Администрация <strong style={{ color: 'var(--primary)', fontWeight: 'bold' }}>LS CUSTOMS</strong> уже подготавливает первые отчёты о выполненных проектах. Возвращайтесь совсем скоро!
            </p>
          </div>
        ) : (
          /* Сетка новостных карточек */
          <div className="news-feed-grid">
            {filtered.map(item => (
              <div key={item.id} className="news-card">
                <div className="news-card-img-wrapper" onClick={() => setLightbox(item)} style={{ cursor: 'pointer' }}>
                  <span className="news-card-badge">{item.category}</span>
                  <img src={item.image_url} alt={item.title} className="news-card-img" loading="lazy" />
                </div>
                
                <div className="news-card-content">
                  <div className="news-card-date">
                    {formatRussianDate(item.created_at)}
                  </div>
                  <h3 className="news-card-title">{item.title}</h3>
                  <p className="news-card-desc">
                    {item.description || 'Детали модификации и подробное описание проекта скоро появятся в ленте.'}
                  </p>
                  <div className="news-card-action" onClick={() => setLightbox(item)}>
                    <span>Рассмотреть работу</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Лайтбокс на весь экран */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20,
          }}
        >
          <img src={lightbox.image_url} alt={lightbox.title} style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 2, border: '1px solid rgba(200, 168, 130, 0.2)' }} />
          <div style={{ position: 'absolute', bottom: 40, color: 'var(--white)', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', textAlign: 'center', maxWidth: '600px', padding: '0 20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{lightbox.category} • {formatRussianDate(lightbox.created_at)}</span>
            <h4 style={{ fontSize: '1.25rem', margin: '0 0 10px 0' }}>{lightbox.title}</h4>
            {lightbox.description && <p style={{ fontSize: '0.9rem', color: 'var(--gray-light)', margin: 0 }}>{lightbox.description}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
