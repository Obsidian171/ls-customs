import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { checkRateLimit, formatRetryAfter } from '../lib/rateLimit'
import { sanitizeString, sanitizePhone } from '../lib/sanitize'
import type { Vacancy, JobApplication } from '../types'

type FormData = { applicant_name: string; phone: string; message: string }

export default function Vacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Vacancy | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [rateLimited, setRateLimited] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    // Получение списка вакансий
    const fetchVacancies = async () => {
      try {
        const { data } = await supabase
          .from('vacancies')
          .select('*')
          .eq('active', true)
          .order('id')
        setVacancies(data || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchVacancies()

    // Подгрузка данных пользователя для автозаполнения
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
          if (data) {
            setValue('applicant_name', data.full_name || '')
            setValue('phone', data.phone || '')
          }
        })
      }
    })
  }, [setValue])

  const onSubmit = async (data: FormData) => {
    if (!selected) return
    const rl = checkRateLimit('vacancy')
    if (!rl.allowed) {
      setRateLimited(`Слишком много заявок. Попробуйте через ${formatRetryAfter(rl.retryAfterMs)}.`);
      return
    }
    setRateLimited(null)
    setSubmitting(true)

    const payload: JobApplication = {
      vacancy_id: selected.id,
      applicant_name: sanitizeString(data.applicant_name),
      phone: sanitizePhone(data.phone),
      message: sanitizeString(data.message || ''),
    }

    const { error } = await supabase.from('job_applications').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error('Ошибка при отправке.')
    } else {
      toast.success('Резюме отправлено! Администрация свяжется с вами по указанному телефону.')
      reset()
      setSelected(null)
    }
  }

  return (
    <section className="section">
      <div className="container">
        {/* Встроенные CSS стили для Вакансий */}
        <style dangerouslySetInnerHTML={{ __html: `
          .vacancies-layout {
            display: grid;
            grid-template-columns: ${selected ? '1.2fr 1fr' : '1fr'};
            gap: 40px;
            align-items: start;
            transition: all 0.3s ease;
          }
          @media (max-width: 992px) {
            .vacancies-layout {
              grid-template-columns: 1fr;
              gap: 32px;
            }
          }

          .vacancy-card {
            background: linear-gradient(135deg, rgba(28, 28, 30, 0.45) 0%, rgba(16, 16, 18, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 2px;
            padding: 30px;
            transition: all 0.28s ease;
            position: relative;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          }
          .vacancy-card:hover {
            transform: translateY(-4px);
            border-color: rgba(200, 168, 130, 0.3);
            box-shadow: 0 15px 30px rgba(200, 168, 130, 0.06);
          }
          .vacancy-card.active-selection {
            border-color: var(--primary);
            box-shadow: 0 0 15px rgba(200, 168, 130, 0.12);
          }

          .vacancy-title {
            font-family: var(--font-heading);
            font-size: 1.35rem;
            color: var(--white);
            margin-bottom: 12px;
            letter-spacing: 0.03em;
            text-transform: uppercase;
          }

          .vacancy-meta-badge {
            background: rgba(200, 168, 130, 0.06);
            border: 1px solid rgba(200, 168, 130, 0.15);
            color: var(--primary);
            font-family: var(--font-condensed);
            font-size: 0.85rem;
            padding: 4px 10px;
            letter-spacing: 0.05em;
            border-radius: 2px;
            display: inline-block;
            margin-bottom: 18px;
          }

          /* Автоматический информационный блок контактов на каждой вакансии */
          .vacancy-system-info {
            background: rgba(0, 0, 0, 0.35);
            border: 1px solid rgba(255, 255, 255, 0.02);
            padding: 14px 18px;
            border-radius: 2px;
            margin: 18px 0;
            font-size: 0.82rem;
            color: var(--gray-light);
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          /* Стилизация анкеты соискателя (Job Application Form) */
          .application-form-card {
            background: linear-gradient(135deg, rgba(28, 28, 30, 0.6) 0%, rgba(16, 16, 18, 0.98) 100%);
            border: 1px solid rgba(200, 168, 130, 0.25);
            border-radius: 2px;
            padding: 32px 28px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            position: sticky;
            top: 100px;
          }
        ` }} />

        <h1 className="section-title">Карьера в LS CUSTOMS</h1>
        <p style={{ color: 'var(--gray-light)', marginBottom: 40 }}>
          Мы всегда в поиске талантливых механиков, диагностов и менеджеров. Оставьте заявку и станьте частью нашей команды!
        </p>

        {loading ? (
          <div className="loader">Поиск открытых вакансий...</div>
        ) : vacancies.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed rgba(200, 168, 130, 0.2)', maxWidth: 620, margin: '40px auto' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ marginBottom: 14, opacity: 0.8 }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--white)', marginBottom: 8 }}>
              Набор временно закрыт
            </h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              Сейчас все рабочие места в LS CUSTOMS заняты лучшими мастерами города. Следите за обновлениями, новые вакансии обязательно появятся!
            </p>
          </div>
        ) : (
          <div className="vacancies-layout">
            {/* Левая колонка - Список вакансий */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {vacancies.map(v => {
                const isActive = selected?.id === v.id
                return (
                  <div
                    key={v.id}
                    className={`vacancy-card ${isActive ? 'active-selection' : ''}`}
                    onClick={() => { setSelected(v); reset(); setRateLimited(null) }}
                    style={{ cursor: 'pointer' }}
                  >
                    <h2 className="vacancy-title">{v.title}</h2>
                    {v.salary && <div className="vacancy-meta-badge">{v.salary}</div>}
                    
                    <p style={{ color: 'var(--white)', fontSize: '0.92rem', fontWeight: 600, marginBottom: 8 }}>
                      Описание обязанностей:
                    </p>
                    <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
                      {v.description}
                    </p>

                    <p style={{ color: 'var(--white)', fontSize: '0.92rem', fontWeight: 600, marginBottom: 8 }}>
                      Требования к кандидату:
                    </p>
                    <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 0 }}>
                      {v.requirements}
                    </p>

                    {/* Автоматически генерируемый системный блок контактов */}
                    <div className="vacancy-system-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>📍 Адрес СТО:</span>
                        <strong style={{ color: 'var(--white)' }}>Los Santos, Rodeo</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>🗺️ Пункт в навигаторе:</span>
                        <strong style={{ color: 'var(--primary)' }}>Мы в GPS: 25-46</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>📞 Телефон для связи:</span>
                        <strong style={{ color: 'var(--white)' }}>511-515</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: 18 }}>
                      <button className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`} style={{ borderRadius: 2 }}>
                        {isActive ? 'Заполняем анкету...' : 'Подать заявку'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Правая колонка - Красивая форма подачи заявки */}
            {selected && (
              <div className="application-form-card">
                <h3 style={{ marginBottom: 4, fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--white)', letterSpacing: '0.04em' }}>
                  АНКЕТА СОИСКАТЕЛЯ
                </h3>
                <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', marginBottom: 12 }}>
                  НА ДОЛЖНОСТЬ: {selected.title.toUpperCase()}
                </div>
                <div className="divider" style={{ background: 'rgba(200, 168, 130, 0.25)', margin: '12px 0 20px 0' }} />
                
                {rateLimited && <div className="rate-limit-notice">⚠ {rateLimited}</div>}
                
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="form-group">
                    <label>Ваше Имя и Фамилия *</label>
                    <input
                      {...register('applicant_name', { required: 'Введите имя и фамилию', maxLength: 100 })}
                      placeholder="Например: Carl Johnson"
                    />
                    {errors.applicant_name && <div className="form-error">{errors.applicant_name.message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Контактный телефон *</label>
                    <input
                      type="tel"
                      {...register('phone', {
                        required: 'Введите телефон',
                        pattern: { value: /^[\d+\-() ]{6,20}$/, message: 'Некорректный номер' }
                      })}
                      placeholder="511-515"
                    />
                    {errors.phone && <div className="form-error">{errors.phone.message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Расскажите о вашем опыте работы</label>
                    <textarea
                      {...register('message', { maxLength: 500 })}
                      placeholder="Расскажите, где вы раньше работали и какими навыками тюнинга или ремонта обладаете..."
                      rows={4}
                    />
                    {errors.message && <div className="form-error">{errors.message.message}</div>}
                  </div>

                  {/* Автозаполняемый футер в анкете */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-light)', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderLeft: '2px solid var(--primary)', borderRadius: 2, marginBottom: 20, lineHeight: 1.4 }}>
                    Отправляя анкету, вы соглашаетесь прибыть на собеседование по адресу: <strong style={{ color: '#fff' }}>Los Santos, Rodeo</strong> (<strong style={{ color: 'var(--primary)' }}>Мы в GPS: 25-46</strong>). Телефон СТО: <strong style={{ color: '#fff' }}>511-515</strong>.
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={submitting} style={{ flex: 1.5, padding: '12px 0', fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 2 }}>
                      {submitting ? 'Отправка резюме...' : 'Отправить резюме'}
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelected(null)} style={{ flex: 1, padding: '12px 0', fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 2 }}>
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
