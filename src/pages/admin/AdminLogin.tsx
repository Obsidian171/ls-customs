import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'
import { checkRateLimit, formatRetryAfter } from '../../lib/rateLimit'

type FormData = { email: string; password: string }

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const adminPath = import.meta.env.VITE_ADMIN_SECRET || 'x-panel'
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const rl = checkRateLimit('admin_login')
    if (!rl.allowed) {
      toast.error(`Слишком много попыток. Подождите ${formatRetryAfter(rl.retryAfterMs)}.`)
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    setLoading(false)

    if (error) {
      toast.error('Неверный логин или пароль.')
    } else {
      navigate(`/${adminPath}`)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔒</div>
          <h1 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>ADMIN PANEL</h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.82rem', marginTop: 4 }}>LS Auto Shop</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...register('email', { required: 'Введите email' })}
                placeholder="admin@example.com"
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email.message}</div>}
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                {...register('password', { required: 'Введите пароль' })}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <div className="form-error">{errors.password.message}</div>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
