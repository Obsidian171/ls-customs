import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'
import type { Review } from '../../../types'

type FormData = {
  text: string
  rating: number
}

export default function UserReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | null>(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setReviews(data as Review[])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      author_name: user.email!.split('@')[0],
      text: sanitizeString(data.text),
      rating: Number(data.rating),
      is_published: false,
    }

    let error
    if (editing) {
      ({ error } = await supabase.from('reviews').update(payload).eq('id', editing))
    } else {
      ({ error } = await supabase.from('reviews').insert(payload))
    }

    if (error) {
      toast.error('Ошибка при сохранении отзыва')
    } else {
      toast.success(editing ? 'Отзыв обновлён' : 'Отзыв отправлен на модерацию')
      reset()
      setEditing(null)
      loadReviews()
    }
  }

  const handleEdit = (review: Review) => {
    setEditing(review.id!)
    setValue('text', review.text)
    setValue('rating', review.rating)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) {
      toast.error('Ошибка при удалении')
    } else {
      toast.success('Отзыв удалён')
      loadReviews()
    }
  }

  if (loading) return <div style={{ padding: 40 }}>Загрузка...</div>

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)' }}>Мои отзывы</h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
        Оставьте отзыв о нашей работе
      </p>

      <div className="card" style={{ padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>
          {editing ? 'Редактировать отзыв' : 'Новый отзыв'}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Оценка *</label>
            <select {...register('rating', { required: 'Выберите оценку' })}>
              <option value="">— Выберите —</option>
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{'⭐'.repeat(r)} ({r})</option>
              ))}
            </select>
            {errors.rating && <div className="form-error">{errors.rating.message}</div>}
          </div>

          <div className="form-group">
            <label>Текст отзыва *</label>
            <textarea
              {...register('text', {
                required: 'Введите текст отзыва',
                minLength: { value: 10, message: 'Минимум 10 символов' },
                maxLength: { value: 1000, message: 'Максимум 1000 символов' },
              })}
              placeholder="Расскажите о вашем опыте..."
              rows={4}
            />
            {errors.text && <div className="form-error">{errors.text.message}</div>}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary">
              {editing ? 'Сохранить' : 'Отправить отзыв'}
            </button>
            {editing && (
              <button
                type="button"
                className="btn"
                onClick={() => { setEditing(null); reset(); }}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reviews.map(r => (
          <div key={r.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <div style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>
                {'⭐'.repeat(r.rating)}
              </div>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontSize: '0.85rem',
                  backgroundColor: r.is_published ? '#34d39922' : '#fbbf2422',
                  color: r.is_published ? '#34d399' : '#fbbf24',
                  border: `1px solid ${r.is_published ? '#34d39944' : '#fbbf2444'}`,
                }}
              >
                {r.is_published ? 'Опубликован' : 'На модерации'}
              </span>
            </div>
            <p style={{ color: 'var(--gray-light)', marginBottom: 12 }}>{r.text}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => handleEdit(r)} className="btn" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                Редактировать
              </button>
              <button onClick={() => handleDelete(r.id!)} className="btn" style={{ fontSize: '0.85rem', padding: '6px 12px', backgroundColor: '#f8717144' }}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
