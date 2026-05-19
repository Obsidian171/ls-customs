import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'
import type { Employee } from '../../../types'
import ImageUpload from '../../../components/ImageUpload'

type FormData = { first_name: string; last_name: string; position: string; description: string; photo_url: string }

export default function AdminEmployees() {
  const [items, setItems] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    register('photo_url')
  }, [register])

  const load = async () => {
    const { data } = await supabase.from('employees').select('*').order('id')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); reset(); setShowForm(true) }
  const openEdit = (item: Employee) => {
    setEditing(item)
    setValue('first_name', item.first_name)
    setValue('last_name', item.last_name)
    setValue('position', item.position)
    setValue('description', item.description)
    setValue('photo_url', item.photo_url || '')
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = {
      first_name: sanitizeString(data.first_name),
      last_name: sanitizeString(data.last_name),
      position: sanitizeString(data.position),
      description: sanitizeString(data.description),
      photo_url: data.photo_url ? sanitizeString(data.photo_url) : null,
    }
    const { error } = editing
      ? await supabase.from('employees').update(payload).eq('id', editing.id)
      : await supabase.from('employees').insert(payload)

    if (error) { toast.error('Ошибка сохранения'); return }
    toast.success(editing ? 'Обновлено' : 'Добавлено')
    setShowForm(false); reset(); setEditing(null); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить сотрудника?')) return
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) { toast.error('Ошибка'); return }
    toast.success('Удалено'); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Сотрудники</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Добавить</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>{editing ? 'Редактировать' : 'Новый сотрудник'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Имя (EN) *</label>
                <input {...register('first_name', { required: 'Обязательно', maxLength: 100 })} placeholder="Carl" />
                {errors.first_name && <div className="form-error">{errors.first_name.message}</div>}
              </div>
              <div className="form-group">
                <label>Фамилия (EN) *</label>
                <input {...register('last_name', { required: 'Обязательно', maxLength: 100 })} placeholder="Johnson" />
                {errors.last_name && <div className="form-error">{errors.last_name.message}</div>}
              </div>
              <div className="form-group">
                <label>Должность *</label>
                <input {...register('position', { required: 'Обязательно', maxLength: 100 })} />
                {errors.position && <div className="form-error">{errors.position.message}</div>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <ImageUpload
                  value={watch('photo_url') || ''}
                  onChange={(url) => setValue('photo_url', url, { shouldValidate: true })}
                  label="Фото сотрудника (Загрузить) *"
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Описание *</label>
                <textarea {...register('description', { required: 'Обязательно', maxLength: 500 })} rows={2} />
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
            <div key={item.id} className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: item.photo_url ? 'transparent' : 'linear-gradient(135deg, rgba(200, 168, 130, 0.1) 0%, rgba(200, 168, 130, 0.25) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '1.8rem',
                border: `2px solid ${item.photo_url ? 'var(--primary)' : 'rgba(200, 168, 130, 0.3)'}`,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt={`${item.first_name} ${item.last_name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '1rem', color: '#fff' }}>{item.first_name} {item.last_name}</div>
              <div style={{ color: 'var(--primary)', fontSize: '0.82rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 8 }}>{item.position}</div>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.82rem', marginBottom: 16, lineHeight: 1.5 }}>{item.description}</p>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>✏️ Изменить</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>🗑</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: 'var(--gray)' }}>Нет записей</p>}
        </div>
      )}
    </div>
  )
}
