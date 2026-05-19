import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Team from './pages/Team'
import Booking from './pages/Booking'
import Parts from './pages/Parts'
import Gallery from './pages/Gallery'
import Reviews from './pages/Reviews'
import Contacts from './pages/Contacts'
import Vacancies from './pages/Vacancies'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserDashboard from './pages/user/UserDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        style={{ '--normal-bg': '#1a1a24', '--normal-border': '#333344', '--normal-text': '#e8e8f0' } as React.CSSProperties}
      />
      <Routes>
        {/* Public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/vacancies" element={<Vacancies />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Cabinet */}
        <Route
          path="/cabinet/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin — скрытый маршрут */}
        <Route path={`/${import.meta.env.VITE_ADMIN_SECRET || 'x-panel'}/login`} element={<AdminLogin />} />
        <Route
          path={`/${import.meta.env.VITE_ADMIN_SECRET || 'x-panel'}/*`}
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}
