import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'
import { sanitizeString } from '../../lib/sanitize'

type FormData = {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  phone: string
}

export default function Register() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)

    // Регистрация пользователя с передачей метаданных для триггера БД
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: sanitizeString(data.full_name),
          phone: sanitizeString(data.phone),
        }
      }
    })

    if (authError) {
      setSubmitting(false)
      toast.error('Ошибка регистрации: ' + authError.message)
      return
    }

    // Дополнительный локальный апдейт (на случай отключенного или старого триггера)
    if (authData.user) {
      await supabase
        .from('user_profiles')
        .update({
          full_name: sanitizeString(data.full_name),
          phone: sanitizeString(data.phone),
        })
        .eq('user_id', authData.user.id)
    }

    setSubmitting(false)
    toast.success('Регистрация успешна! Вы можете войти в свой аккаунт.')
    navigate('/login')
  }

  return (
    <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, paddingBottom: 40 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-card {
          background: linear-gradient(135deg, rgba(28, 28, 30, 0.6) 0%, rgba(16, 16, 18, 0.98) 100%);
          border: 1px solid rgba(200, 168, 130, 0.2);
          border-radius: 2px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--gray-light);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-family: var(--font-condensed);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 24px;
          padding: 0;
          transition: all 0.2s ease;
        }
        .back-btn:hover {
          color: var(--primary);
          transform: translateX(-3px);
        }
        @media (max-width: 480px) {
          .auth-card {
            padding: 28px 20px;
          }
          .auth-title {
            font-size: 1.7rem !important;
          }
        }
      ` }} />
      <div className="container" style={{ maxWidth: 460, width: '100%' }}>
        <div className="auth-card">
          <button type="button" onClick={() => navigate(-1)} className="back-btn">
            ← Назад
          </button>
          
          <h1 className="auth-title" style={{ fontSize: '2rem', marginBottom: 8, textAlign: 'center', color: 'var(--gold)' }}>
            Регистрация
          </h1>
          <p style={{ color: 'var(--gray-light)', marginBottom: 32, textAlign: 'center' }}>
            Создайте аккаунт для отслеживания заявок
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label>Имя и фамилия *</label>
              <input
                {...register('full_name', { required: 'Введите имя', maxLength: 100 })}
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.full_name && <div className="form-error">{errors.full_name.message}</div>}
            </div>

            <div className="form-group">
              <label>Телефон (формат xxx-xxx) *</label>
              <input
                type="text"
                {...register('phone', {
                  required: 'Введите телефон',
                  pattern: { value: /^\d{3}-\d{3}$/, message: 'Некорректный формат. Пример: 123-456' },
                  onChange: (e) => {
                    const val = e.target.value
                    const digits = val.replace(/\D/g, '').slice(0, 6)
                    if (digits.length <= 3) {
                      e.target.value = digits
                    } else {
                      e.target.value = `${digits.slice(0, 3)}-${digits.slice(3)}`
                    }
                  }
                })}
                placeholder="123-456"
                autoComplete="tel"
              />
              {errors.phone && <div className="form-error">{errors.phone.message}</div>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Введите email',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Некорректный email' },
                })}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email.message}</div>}
            </div>

            <div className="form-group">
              <label>Пароль *</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Введите пароль',
                  minLength: { value: 6, message: 'Минимум 6 символов' },
                })}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.password && <div className="form-error">{errors.password.message}</div>}
            </div>

            <div className="form-group">
              <label>Подтвердите пароль *</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Подтвердите пароль',
                  validate: value => value === watch('password') || 'Пароли не совпадают',
                })}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', marginBottom: 16 }}>
              {submitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--gray-light)', fontSize: '0.9rem' }}>
              Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--gold)' }}>Войти</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
