import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'

type FormData = {
  identifier: string
  password: string
}

export default function Login() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    let emailToAuth = data.identifier.trim()

    // Проверяем, является ли ввод телефоном (содержит дефис или цифры без @)
    const cleanPhone = emailToAuth.replace(/\D/g, '')
    const isPhone = /^[0-9-]+$/.test(emailToAuth) || (cleanPhone.length >= 3 && cleanPhone.length <= 6 && !emailToAuth.includes('@'))

    if (isPhone) {
      const formattedPhone = cleanPhone.length <= 3 ? cleanPhone : `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}`
      
      // Находим соответствующий E-mail по номеру телефона
      const { data: profileData, error: profileErr } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('phone', formattedPhone)
        .maybeSingle()

      if (profileErr || !profileData || !profileData.email) {
        setSubmitting(false)
        toast.error('Пользователь с таким номером телефона не найден')
        return
      }
      emailToAuth = profileData.email
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password: data.password,
    })
    setSubmitting(false)

    if (error) {
      toast.error('Неверный логин, email/телефон или пароль')
    } else {
      toast.success('Вход выполнен')
      navigate('/cabinet')
    }
  }

  return (
    <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            Вход в кабинет
          </h1>
          <p style={{ color: 'var(--gray-light)', marginBottom: 32, textAlign: 'center' }}>
            Войдите для управления заявками
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label>Email или Телефон (xxx-xxx) *</label>
              <input
                type="text"
                {...register('identifier', {
                  required: 'Введите email или телефон',
                  onChange: (e) => {
                    const val = e.target.value
                    if (/^\d/.test(val) || (!val.includes('@') && val !== '')) {
                      const digits = val.replace(/\D/g, '').slice(0, 6)
                      if (digits.length <= 3) {
                        e.target.value = digits
                      } else {
                        e.target.value = `${digits.slice(0, 3)}-${digits.slice(3)}`
                      }
                    }
                  }
                })}
                placeholder="name@email.com или 123-456"
                autoComplete="username"
              />
              {errors.identifier && <div className="form-error">{errors.identifier.message}</div>}
            </div>

            <div className="form-group">
              <label>Пароль *</label>
              <input
                type="password"
                {...register('password', { required: 'Введите пароль', minLength: { value: 6, message: 'Минимум 6 символов' } })}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <div className="form-error">{errors.password.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', marginBottom: 16 }}>
              {submitting ? 'Вход...' : 'Войти'}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--gray-light)', fontSize: '0.9rem' }}>
              Нет аккаунта? <Link to="/register" style={{ color: 'var(--gold)' }}>Зарегистрироваться</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
