import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import AdminServices from './sections/AdminServices'
import AdminEmployees from './sections/AdminEmployees'
import AdminBookings from './sections/AdminBookings'
import AdminPartOrders from './sections/AdminPartOrders'
import AdminGallery from './sections/AdminGallery'
import AdminReviews from './sections/AdminReviews'
import AdminVacancies from './sections/AdminVacancies'
import AdminApplications from './sections/AdminApplications'
import styles from './AdminDashboard.module.css'

const adminPath = import.meta.env.VITE_ADMIN_SECRET || 'x-panel'

const sections = [
  { path: 'services', label: '🔧 Услуги' },
  { path: 'employees', label: '👥 Сотрудники' },
  { path: 'bookings', label: '📅 Записи' },
  { path: 'part-orders', label: '📦 Заказы деталей' },
  { path: 'gallery', label: '🖼 Галерея' },
  { path: 'reviews', label: '⭐ Отзывы' },
  { path: 'vacancies', label: '💼 Вакансии' },
  { path: 'applications', label: '📋 Заявки на работу' },
  // Контакты СТО удалены — управляются через публичную страницу
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Выход выполнен')
    navigate(`/${adminPath}/login`)
  }

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>🔧 ADMIN</span>
          <button onClick={() => setSidebarOpen(o => !o)} className={styles.toggleBtn} aria-label="Свернуть меню">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {sections.map(s => (
            <NavLink
              key={s.path}
              to={`/${adminPath}/${s.path}`}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              {sidebarOpen ? s.label : s.label.split(' ')[0]}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          {sidebarOpen ? '🚪 Выйти' : '🚪'}
        </button>
      </aside>

      <main className={styles.main}>
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="services/*" element={<AdminServices />} />
          <Route path="employees/*" element={<AdminEmployees />} />
          <Route path="bookings/*" element={<AdminBookings />} />
          <Route path="part-orders/*" element={<AdminPartOrders />} />
          <Route path="gallery/*" element={<AdminGallery />} />
          <Route path="reviews/*" element={<AdminReviews />} />
          <Route path="vacancies/*" element={<AdminVacancies />} />
          <Route path="applications/*" element={<AdminApplications />} />
        </Routes>
      </main>
    </div>
  )
}

function AdminHome() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: 8 }}>Панель управления</h1>
      <p style={{ color: 'var(--gray-light)' }}>Выберите раздел в меню слева.</p>
    </div>
  )
}
