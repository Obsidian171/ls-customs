import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'
import type { GalleryItem } from '../../../types'
import ImageUpload from '../../../components/ImageUpload'

type FormData = { title: string; image_url: string; category: string; description: string }

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    register('image_url', { required: 'Пожалуйста, загрузите изображение' })
  }, [register])

  const load = async () => {
    const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); reset(); setShowForm(true) }
  const openEdit = (item: GalleryItem) => {
    setEditing(item)
    setValue('title', item.title)
    setValue('image_url', item.image_url)
    setValue('category', item.category)
    setValue('description', item.description || '')
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = {
      title: sanitizeString(data.title),
      image_url: sanitizeString(data.image_url),
      category: sanitizeString(data.category),
      description: sanitizeString(data.description || '')
    }
    const { error } = editing
      ? await supabase.from('gallery').update(payload).eq('id', editing.id)
      : await supabase.from('gallery').insert(payload)

    if (error) { toast.error('Ошибка'); return }
    toast.success(editing ? 'Обновлено' : 'Добавлено')
    setShowForm(false); reset(); setEditing(null); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить фото?')) return
    await supabase.from('gallery').delete().eq('id', id)
    toast.success('Удалено'); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Галерея</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Добавить</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>{editing ? 'Редактировать' : 'Новое фото'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Название *</label>
                <input {...register('title', { required: 'Обязательно', maxLength: 200 })} />
                {errors.title && <div className="form-error">{errors.title.message}</div>}
              </div>
              <div className="form-group">
                <label>Категория *</label>
                <input {...register('category', { required: 'Обязательно', maxLength: 100 })} />
                {errors.category && <div className="form-error">{errors.category.message}</div>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <ImageUpload
                  value={watch('image_url') || ''}
                  onChange={(url) => setValue('image_url', url, { shouldValidate: true })}
                  label="Изображение для галереи *"
                />
                {errors.image_url && <div className="form-error">{errors.image_url.message}</div>}
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Описание работы (О чём новость)</label>
                <textarea
                  {...register('description', { maxLength: 500 })}
                  placeholder="Опишите выполненные работы, установленные детали..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: '#141414',
                    border: '1px solid rgba(200, 168, 130, 0.2)',
                    color: '#fff',
                    padding: '10px 14px',
                    borderRadius: 2,
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.description && <div className="form-error">{errors.description.message}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button type="submit" className="btn btn-primary btn-sm">Сохранить</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditing(null); reset() }}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="loader">Загрузка...</div> : (
        <div className="grid-3">
          {items.map(item => (
            <div key={item.id} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid #222233', background: 'var(--dark2)' }}>
              <img src={item.image_url} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} loading="lazy" />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '0.85rem', marginBottom: 4 }}>{item.title}</div>
                <span className="badge badge-blue">{item.category}</span>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: 'var(--gray)' }}>Нет фото</p>}
        </div>
      )}
    </div>
  )
}
