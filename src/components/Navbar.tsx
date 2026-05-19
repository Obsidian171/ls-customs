import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'Главная' },
  { to: '/services', label: 'Услуги' },
  { to: '/team', label: 'Коллектив' },
  { to: '/booking', label: 'Запись' },
  { to: '/parts', label: 'Детали' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/reviews', label: 'Отзывы' },
  { to: '/contacts', label: 'Контакты' },
  { to: '/vacancies', label: 'Вакансии' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.logo}>
          <svg className={styles.logoIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 16V8C19 6.89543 18.1046 6 17 6H7C5.89543 6 5 6.89543 5 8V16M19 16L21 18M19 16H5M5 16L3 18M9 10H15M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>LS <span className={styles.logoAccent}>CUSTOMS</span></span>
        </NavLink>

        <button
          className={styles.burger}
          onClick={() => setOpen(o => !o)}
          aria-label="Меню"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>

        <ul className={`${styles.links} ${open ? styles.open : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => isActive ? styles.active : ''}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          
          {user ? (
            <li style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '8px 12px',
                }}
              >
                👤 Кабинет
              </button>
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: 'var(--bg-dark)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 8,
                    minWidth: 160,
                    zIndex: 100,
                  }}
                >
                  <NavLink
                    to="/cabinet"
                    onClick={() => { setUserMenuOpen(false); setOpen(false); }}
                    style={{
                      display: 'block',
                      padding: '8px 12px',
                      color: 'var(--text)',
                      textDecoration: 'none',
                      borderRadius: 4,
                    }}
                  >
                    Мой кабинет
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      borderRadius: 4,
                    }}
                  >
                    Выйти
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => isActive ? styles.active : ''}
                  onClick={() => setOpen(false)}
                >
                  Вход
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => isActive ? styles.active : ''}
                  onClick={() => setOpen(false)}
                  style={{ color: 'var(--gold)' }}
                >
                  Регистрация
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
