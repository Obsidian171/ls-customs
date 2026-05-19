import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import type { UserProfile } from '../../types'

// Клиентские разделы
import UserProfileSection from './sections/UserProfile'
import UserBookings from './sections/UserBookings'
import UserPartOrders from './sections/UserPartOrders'
import UserReviews from './sections/UserReviews'
import UserNotifications from './sections/UserNotifications'

// Разделы сотрудников (механиков)
import EmployeeReports from './sections/EmployeeReports'
import EmployeeVacations from './sections/EmployeeVacations'
import EmployeeBookings from './sections/EmployeeBookings'

// Административные разделы
import AdminReportsManager from './sections/AdminReportsManager'
import AdminSTODocuments from './sections/AdminSTODocuments'
import AdminVacationsManager from './sections/AdminVacationsManager'
import AdminRolesManager from './sections/AdminRolesManager'
import AdminNotificationsManager from './sections/AdminNotificationsManager'

// Разделы управления СТО
import AdminServices from '../admin/sections/AdminServices'
import AdminEmployees from '../admin/sections/AdminEmployees'
import AdminBookings from '../admin/sections/AdminBookings'
import AdminPartOrders from '../admin/sections/AdminPartOrders'
import AdminGallery from '../admin/sections/AdminGallery'
import AdminReviews from '../admin/sections/AdminReviews'
import AdminVacancies from '../admin/sections/AdminVacancies'
import AdminApplications from '../admin/sections/AdminApplications'
import styles from './UserDashboard.module.css'

export default function UserDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  useEffect(() => {
    loadUserProfile()
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      let { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!data) {
        // Автоматически создаем запись профиля в БД для старых аккаунтов
        const newProfile = {
          user_id: user.id,
          email: user.email || '',
          full_name: 'Пользователь',
          role: 'user'
        }

        const { error: insertErr } = await supabase.from('user_profiles').insert(newProfile)

        if (!insertErr) {
          const { data: refreshed } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
          if (refreshed) data = refreshed
        } else {
          data = newProfile as any
        }
      }

      if (data) {
        if (data.is_banned) {
          toast.error('Доступ заблокирован: Ваш аккаунт деактивирован администрацией.')
          await supabase.auth.signOut()
          navigate('/')
          return
        }
        setProfile(data as UserProfile)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Вспомогательная функция для генерации SVG иконок в боковой панели
  const getIcon = (path: string) => {
    switch (path) {
      case 'profile':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
      case 'bookings':
      case 'admin-bookings':
      case 'employee-bookings':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M9 16l2 2 4-4" />
          </svg>
        )
      case 'parts':
      case 'part-orders':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 16 12 21 3 16 12 11 21 16" />
            <polyline points="3 10 12 15 21 10" />
            <line x1="12" y1="22" x2="12" y2="11" />
            <polyline points="12 2 22 7 12 12 2 7 12 2" />
          </svg>
        )
      case 'reports':
      case 'admin-reports':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )
      case 'vacations':
      case 'admin-vacations':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      case 'admin-roles':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )
      case 'admin-notify':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )
      case 'services':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        )
      case 'employees':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      case 'gallery':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )
      case 'reviews':
      case 'admin-reviews':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )
      case 'vacancies':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        )
      case 'applications':
      case 'admin-sto-reports':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        )
      case 'contacts':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        )
      case 'notifications':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        )
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Вы успешно вышли из системы')
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--black)' }}>
        <div className="loader">Загрузка личного кабинета...</div>
      </div>
    )
  }

  const role = profile?.role || 'user'

  // Динамические вкладки в зависимости от роли (для Владельца разблокировано ВСЁ!)
  const getNavSections = () => {
    switch (role) {
      case 'owner':
        return [
          { path: 'profile', label: 'Мой профиль' },
          { path: 'bookings', label: 'Мои записи' },
          { path: 'parts', label: 'Заказы деталей' },
          { path: 'reports', label: 'Мои отчёты смен' },
          { path: 'vacations', label: 'Мои отпуска' },
          { path: 'employee-bookings', label: 'Активные заказы' },
          { path: 'admin-reports', label: 'Таблица отчётов' },
          { path: 'admin-sto-reports', label: 'Отчётность СТО (WORD)' },
          { path: 'admin-vacations', label: 'Отпуска персонала' },
          { path: 'admin-roles', label: 'Должности и права' },
          { path: 'admin-notify', label: 'Отправить уведомление' },
          { path: 'services', label: 'Услуги СТО' },
          { path: 'employees', label: 'Коллектив СТО' },
          { path: 'admin-bookings', label: 'Записи клиентов' },
          { path: 'part-orders', label: 'Заказы деталей (Админ)' },
          { path: 'gallery', label: 'Лента новостей' },
          { path: 'admin-reviews', label: 'Отзывы клиентов' },
          { path: 'vacancies', label: 'Вакансии СТО' },
          { path: 'applications', label: 'Заявки на работу' },
          { path: 'notifications', label: 'Мои уведомления' },
        ]
      case 'admin':
        return [
          { path: 'profile', label: 'Мой профиль' },
          { path: 'admin-reports', label: 'Таблица отчётов' },
          { path: 'admin-sto-reports', label: 'Отчётность СТО (WORD)' },
          { path: 'admin-vacations', label: 'Отпуска персонала' },
          { path: 'admin-roles', label: 'Должности и права' },
          { path: 'admin-notify', label: 'Отправить уведомление' },
          { path: 'services', label: 'Услуги СТО' },
          { path: 'employees', label: 'Коллектив СТО' },
          { path: 'admin-bookings', label: 'Записи клиентов' },
          { path: 'part-orders', label: 'Заказы деталей (Админ)' },
          { path: 'gallery', label: 'Лента новостей' },
          { path: 'admin-reviews', label: 'Отзывы клиентов' },
          { path: 'vacancies', label: 'Вакансии СТО' },
          { path: 'applications', label: 'Заявки на работу' },
          { path: 'notifications', label: 'Мои уведомления' },
        ]
      case 'member':
        return [
          { path: 'profile', label: 'Мой профиль' },
          { path: 'reports', label: 'Мои отчёты смен' },
          { path: 'vacations', label: 'Мои отпуска' },
          { path: 'employee-bookings', label: 'Активные заказы' },
          { path: 'admin-notify', label: 'Отправить уведомление' },
          { path: 'notifications', label: 'Уведомления' },
        ]
      case 'user':
      default:
        return [
          { path: 'profile', label: 'Мой профиль' },
          { path: 'bookings', label: 'Мои записи' },
          { path: 'parts', label: 'Заказы деталей' },
          { path: 'reviews', label: 'Мои отзывы' },
          { path: 'notifications', label: 'Уведомления' },
        ]
    }
  }

  const sections = getNavSections()

  // Защита страниц на стороне клиента (Владельцу разрешено всё!)
  const requireRole = (allowed: ('user' | 'member' | 'admin' | 'owner')[], element: React.ReactNode) => {
    if (role === 'owner' || allowed.includes(role)) {
      return element
    }
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--red)', fontFamily: 'var(--font-heading)' }}>🛡️ ДОСТУП ОГРАНИЧЕН</h2>
        <p style={{ color: 'var(--gray-light)', marginTop: 10 }}>У вас недостаточно прав для просмотра этого раздела.</p>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>{role === 'owner' ? '👑 OWNER' : role === 'admin' ? '🛡️ ADMIN' : role === 'member' ? '🔧 STAFF' : '🚗 CABINET'}</span>
          <button onClick={() => setSidebarOpen(o => !o)} className={styles.toggleBtn} aria-label="Свернуть меню">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Учётная карточка */}
        <div style={{ padding: '20px 15px', borderBottom: '1px solid var(--dark3)' }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #c8a882 0%, #a6845c 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', color: '#101012', fontWeight: 'bold', fontSize: '1.2rem',
                flexShrink: 0
              }}>
                {(profile?.full_name || profile?.email || 'U')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {profile?.full_name || 'Участник'}
                </div>
                <span style={{
                  fontSize: '0.62rem',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  padding: '2px 6px',
                  borderRadius: 2,
                  marginTop: 4,
                  display: 'inline-block',
                  color: role === 'owner' ? 'var(--primary)' : role === 'admin' ? '#e74c3c' : role === 'member' ? '#3498db' : '#2ebd59',
                  border: `1px solid ${role === 'owner' ? 'var(--primary)' : role === 'admin' ? '#e74c3c' : role === 'member' ? '#3498db' : '#2ebd59'}`,
                  background: 'rgba(255,255,255,0.01)'
                }}>
                  {role === 'owner' ? '👑 Владелец' : role === 'admin' ? '🛡️ Админ' : role === 'member' ? '🔧 Сотрудник' : '🚗 Клиент'}
                </span>
              </div>
            </div>
          ) : (
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #c8a882 0%, #a6845c 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', color: '#101012', fontWeight: 'bold', fontSize: '1rem',
              margin: '0 auto'
            }}>
              {(profile?.full_name || profile?.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          {sections.map(s => (
            <NavLink
              key={s.path}
              to={`/cabinet/${s.path}`}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
              onClick={() => { if (window.innerWidth <= 768) setSidebarOpen(false) }}
            >
              <span className={styles.navIcon} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {getIcon(s.path)}
              </span>
              {sidebarOpen && <span>{s.label}</span>}
            </NavLink>
          ))}

          {/* Кнопка возврата на публичный сайт */}
          <NavLink
            to="/"
            className={styles.navItem}
            style={{ borderTop: '1px solid var(--dark3)', marginTop: 'auto' }}
            onClick={() => { if (window.innerWidth <= 768) setSidebarOpen(false) }}
          >
            <span className={styles.navIcon} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            {sidebarOpen && <span>На сайт СТО</span>}
          </NavLink>
        </nav>

        <button onClick={() => { handleLogout(); if (window.innerWidth <= 768) setSidebarOpen(false); }} className={styles.logoutBtn}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          {sidebarOpen && <span style={{ marginLeft: 14 }}>Выйти</span>}
        </button>
      </aside>

      <main className={styles.main}>
        <Routes>
          <Route index element={<UserProfileSection />} />
          <Route path="profile" element={<UserProfileSection />} />
          <Route path="notifications" element={<UserNotifications />} />

          {/* Клиентские маршруты */}
          <Route path="bookings" element={requireRole(['user'], <UserBookings />)} />
          <Route path="parts" element={requireRole(['user'], <UserPartOrders />)} />
          <Route path="reviews" element={requireRole(['user'], <UserReviews />)} />

          {/* Маршруты сотрудников */}
          <Route path="reports" element={requireRole(['member'], <EmployeeReports />)} />
          <Route path="vacations" element={requireRole(['member'], <EmployeeVacations />)} />
          <Route path="employee-bookings" element={requireRole(['member', 'admin', 'owner'], <EmployeeBookings />)} />

          {/* Административные маршруты */}
          <Route path="admin-reports" element={requireRole(['admin', 'owner'], <AdminReportsManager />)} />
          <Route path="admin-sto-reports" element={requireRole(['admin', 'owner'], <AdminSTODocuments />)} />
          <Route path="admin-vacations" element={requireRole(['admin', 'owner'], <AdminVacationsManager />)} />
          <Route path="admin-roles" element={requireRole(['admin', 'owner'], <AdminRolesManager />)} />
          <Route path="admin-notify" element={requireRole(['member', 'admin', 'owner'], <AdminNotificationsManager />)} />

          {/* Маршруты управления СТО */}
          <Route path="services/*" element={requireRole(['admin', 'owner'], <AdminServices />)} />
          <Route path="employees/*" element={requireRole(['admin', 'owner'], <AdminEmployees />)} />
          <Route path="admin-bookings/*" element={requireRole(['admin', 'owner'], <AdminBookings />)} />
          <Route path="part-orders/*" element={requireRole(['admin', 'owner'], <AdminPartOrders />)} />
          <Route path="gallery/*" element={requireRole(['admin', 'owner'], <AdminGallery />)} />
          <Route path="admin-reviews/*" element={requireRole(['admin', 'owner'], <AdminReviews />)} />
          <Route path="vacancies/*" element={requireRole(['admin', 'owner'], <AdminVacancies />)} />
          <Route path="applications/*" element={requireRole(['admin', 'owner'], <AdminApplications />)} />
        </Routes>
      </main>
    </div>
  )
}
