import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee } from '../types'

export default function Team() {
  const [team, setTeam] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await supabase.from('employees').select('*').order('id')
        setTeam(data || [])
      } catch {
        setTeam([])
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Коллектив СТО</h1>
        <p style={{ color: 'var(--gray-light)', marginBottom: 48, fontSize: '1.05rem' }}>
          Профессионалы своего дела с многолетним опытом модификации и ремонта автомобилей.
        </p>

        {loading ? (
          <div className="loader">Загрузка состава команды...</div>
        ) : team.length === 0 ? (
          /* Премиальная заглушка при пустом списке мастеров */
          <div style={{
            textAlign: 'center',
            padding: '60px 30px',
            border: '1px dashed rgba(200, 168, 130, 0.2)',
            borderRadius: 2,
            background: 'rgba(28, 28, 30, 0.35)',
            maxWidth: 620,
            margin: '40px auto'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.85 }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--white)', marginBottom: 10 }}>
              Команда мастеров формируется
            </h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Здесь пока пусто. Администрация <strong style={{ color: 'var(--primary)', fontWeight: 'bold' }}>LS CUSTOMS</strong> скоро опубликует подробную информацию о наших лучших мастерах тюнинга и механиках автосервиса!
            </p>
          </div>
        ) : (
          /* Список сотрудников из базы */
          <div className="grid-3">
            {team.map((e, i) => (
              <div
                key={e.id}
                className="card glow-on-hover"
                style={{
                  textAlign: 'center',
                  animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                  padding: '30px 24px'
                }}
              >
                <div style={{
                  width: 130,
                  height: 130,
                  borderRadius: '50%',
                  background: e.photo_url ? 'transparent' : 'linear-gradient(135deg, rgba(200, 168, 130, 0.1) 0%, rgba(200, 168, 130, 0.25) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2.5rem',
                  border: `3px solid ${e.photo_url ? 'var(--primary)' : 'rgba(200, 168, 130, 0.3)'}`,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {e.photo_url ? (
                    <img
                      src={e.photo_url}
                      alt={`${e.first_name} ${e.last_name}`}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  )}
                </div>
                
                <h3 style={{ fontSize: '1.25rem', marginBottom: 6, color: 'var(--white)', fontFamily: 'var(--font-heading)' }}>
                  {e.first_name} {e.last_name}
                </h3>
                
                <div style={{
                  color: 'var(--primary)',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}>
                  {e.position}
                </div>
                
                <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
