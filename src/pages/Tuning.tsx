import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface TuningItem {
  id: number
  name: string
  category: string
  image_url: string
  description?: string
  price?: number
}

const CATEGORIES = [
  { id: 'wheels', name: 'Колёса', icon: '⚙️' },
  { id: 'spoilers', name: 'Спойлеры', icon: '🏁' },
  { id: 'bumpers', name: 'Бамперы', icon: '🚗' },
  { id: 'exhausts', name: 'Выхлопы', icon: '💨' },
  { id: 'hydraulics', name: 'Гидравлика', icon: '🔧' },
  { id: 'nitro', name: 'Нитро', icon: '⚡' },
  { id: 'vinyls', name: 'Винилы', icon: '🎨' },
  { id: 'lights', name: 'Неон', icon: '💡' },
]

// Fallback данные с примерами (замени URL на реальные скриншоты из SAMP)
const FALLBACK_ITEMS: TuningItem[] = [
  // Колёса
  { id: 1, name: 'Offroad', category: 'wheels', image_url: 'https://via.placeholder.com/300x200?text=Offroad+Wheels', description: 'Внедорожные колёса', price: 1000 },
  { id: 2, name: 'Mega', category: 'wheels', image_url: 'https://via.placeholder.com/300x200?text=Mega+Wheels', description: 'Большие хромированные диски', price: 1500 },
  { id: 3, name: 'Wires', category: 'wheels', image_url: 'https://via.placeholder.com/300x200?text=Wire+Wheels', description: 'Классические спицованные диски', price: 1200 },
  { id: 4, name: 'Twist', category: 'wheels', image_url: 'https://via.placeholder.com/300x200?text=Twist+Wheels', description: 'Закрученные диски', price: 1300 },
  { id: 5, name: 'Grove', category: 'wheels', image_url: 'https://via.placeholder.com/300x200?text=Grove+Wheels', description: 'Диски в стиле Grove Street', price: 1400 },
  { id: 6, name: 'Import', category: 'wheels', image_url: 'https://via.placeholder.com/300x200?text=Import+Wheels', description: 'Импортные спортивные диски', price: 1600 },
  
  // Спойлеры
  { id: 7, name: 'Win Spoiler', category: 'spoilers', image_url: 'https://via.placeholder.com/300x200?text=Win+Spoiler', description: 'Гоночный спойлер', price: 500 },
  { id: 8, name: 'Drag Spoiler', category: 'spoilers', image_url: 'https://via.placeholder.com/300x200?text=Drag+Spoiler', description: 'Драг-спойлер', price: 600 },
  { id: 9, name: 'Pro Spoiler', category: 'spoilers', image_url: 'https://via.placeholder.com/300x200?text=Pro+Spoiler', description: 'Профессиональный спойлер', price: 700 },
  
  // Бамперы
  { id: 10, name: 'Chrome Bumper', category: 'bumpers', image_url: 'https://via.placeholder.com/300x200?text=Chrome+Bumper', description: 'Хромированный бампер', price: 800 },
  { id: 11, name: 'Slamin Bumper', category: 'bumpers', image_url: 'https://via.placeholder.com/300x200?text=Slamin+Bumper', description: 'Заниженный бампер', price: 900 },
  
  // Выхлопы
  { id: 12, name: 'Large Exhaust', category: 'exhausts', image_url: 'https://via.placeholder.com/300x200?text=Large+Exhaust', description: 'Большой выхлоп', price: 400 },
  { id: 13, name: 'Medium Exhaust', category: 'exhausts', image_url: 'https://via.placeholder.com/300x200?text=Medium+Exhaust', description: 'Средний выхлоп', price: 350 },
  { id: 14, name: 'Small Exhaust', category: 'exhausts', image_url: 'https://via.placeholder.com/300x200?text=Small+Exhaust', description: 'Малый выхлоп', price: 300 },
  { id: 15, name: 'Twin Exhaust', category: 'exhausts', image_url: 'https://via.placeholder.com/300x200?text=Twin+Exhaust', description: 'Двойной выхлоп', price: 500 },
  
  // Гидравлика
  { id: 16, name: 'Hydraulics', category: 'hydraulics', image_url: 'https://via.placeholder.com/300x200?text=Hydraulics', description: 'Гидравлическая подвеска', price: 1500 },
  
  // Нитро
  { id: 17, name: 'Nitro 2x', category: 'nitro', image_url: 'https://via.placeholder.com/300x200?text=Nitro+2x', description: 'Двойное ускорение', price: 200 },
  { id: 18, name: 'Nitro 5x', category: 'nitro', image_url: 'https://via.placeholder.com/300x200?text=Nitro+5x', description: 'Пятикратное ускорение', price: 500 },
  { id: 19, name: 'Nitro 10x', category: 'nitro', image_url: 'https://via.placeholder.com/300x200?text=Nitro+10x', description: 'Десятикратное ускорение', price: 1000 },
]

export default function Tuning() {
  const [items, setItems] = useState<TuningItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const { data } = await supabase
        .from('tuning_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })
      
      setItems(data && data.length > 0 ? data : FALLBACK_ITEMS)
    } catch {
      setItems(FALLBACK_ITEMS)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory)

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Каталог тюнинга</h1>
        <p style={{ color: 'var(--gray-light)', marginBottom: 40, fontSize: '1.05rem', textAlign: 'center' }}>
          Все детали для кастомизации твоего райда
        </p>

        {/* Категории */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 40,
          overflowX: 'auto',
          padding: '10px 0',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setActiveCategory('all')}
            className={`btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.9rem', padding: '10px 20px' }}
          >
            Все
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader">Загрузка...</div>
        ) : (
          <>
            {/* Счётчик */}
            <div style={{
              textAlign: 'center',
              color: 'var(--gray-light)',
              marginBottom: 24,
              fontSize: '0.9rem',
            }}>
              Найдено: {filteredItems.length} {filteredItems.length === 1 ? 'деталь' : 'деталей'}
            </div>

            {/* Сетка товаров */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {filteredItems.map((item, i) => (
                <div
                  key={item.id}
                  className="card glow-on-hover"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both`,
                    overflow: 'hidden',
                  }}
                >
                  {/* Изображение */}
                  <div style={{
                    width: '100%',
                    height: 180,
                    background: 'var(--dark2)',
                    borderRadius: '8px 8px 0 0',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: 16,
                  }}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(item.name)
                      }}
                    />
                    {/* Категория badge */}
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'var(--gold)22',
                      border: '1px solid var(--gold)44',
                      color: 'var(--gold)',
                      padding: '4px 12px',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                    </div>
                  </div>

                  {/* Контент */}
                  <div style={{ padding: '0 16px 16px' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      marginBottom: 8,
                      color: 'var(--text)',
                    }}>
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <p style={{
                        color: 'var(--gray-light)',
                        fontSize: '0.88rem',
                        marginBottom: 12,
                        lineHeight: 1.5,
                      }}>
                        {item.description}
                      </p>
                    )}

                    {item.price && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 12,
                        borderTop: '1px solid var(--border)',
                      }}>
                        <span style={{
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: 'var(--gold)',
                        }}>
                          ${item.price.toLocaleString()}
                        </span>
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                          onClick={() => window.location.href = '/booking'}
                        >
                          Заказать
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 60,
                color: 'var(--gray-light)',
              }}>
                В этой категории пока нет товаров
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
