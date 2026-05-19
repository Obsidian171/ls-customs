import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'
import type { Service } from '../../../types'

type FormData = { name: string; description: string; price: string; category: string }

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('category')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); reset(); setShowForm(true) }
  const openEdit = (item: Service) => {
    setEditing(item)
    setValue('name', item.name)
    setValue('description', item.description)
    setValue('price', String(item.price))
    setValue('category', item.category)
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = {
      name: sanitizeString(data.name),
      description: sanitizeString(data.description),
      price: parseFloat(data.price),
      category: sanitizeString(data.category),
    }
    const { error } = editing
      ? await supabase.from('services').update(payload).eq('id', editing.id)
      : await supabase.from('services').insert(payload)

    if (error) { toast.error('Ошибка сохранения'); return }
    toast.success(editing ? 'Обновлено' : 'Добавлено')
    setShowForm(false); reset(); setEditing(null); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить услугу?')) return
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) { toast.error('Ошибка удаления'); return }
    toast.success('Удалено')
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Услуги</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Добавить</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>{editing ? 'Редактировать' : 'Новая услуга'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Название *</label>
                <input {...register('name', { required: 'Обязательно', maxLength: 200 })} />
                {errors.name && <div className="form-error">{errors.name.message}</div>}
              </div>
              <div className="form-group">
                <label>Категория *</label>
                <input {...register('category', { required: 'Обязательно', maxLength: 100 })} />
                {errors.category && <div className="form-error">{errors.category.message}</div>}
              </div>
              <div className="form-group">
                <label>Цена ($) *</label>
                <input type="number" step="0.01" min="0" {...register('price', { required: 'Обязательно', min: { value: 0, message: 'Мин. 0' } })} />
                {errors.price && <div className="form-error">{errors.price.message}</div>}
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222233', color: 'var(--gray)', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>Название</th>
                <th style={{ padding: '8px 12px' }}>Категория</th>
                <th style={{ padding: '8px 12px' }}>Цена</th>
                <th style={{ padding: '8px 12px' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                  <td style={{ padding: '10px 12px' }}>{item.name}</td>
                  <td style={{ padding: '10px 12px' }}><span className="badge badge-blue">{item.category}</span></td>
                  <td style={{ padding: '10px 12px', color: 'var(--accent)' }}>${item.price}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ color: 'var(--gray)', padding: '20px 0' }}>Нет записей</p>}
        </div>
      )}
    </div>
  )
}
