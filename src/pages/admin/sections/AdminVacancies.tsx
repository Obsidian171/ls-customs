import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'
import type { Vacancy } from '../../../types'

type FormData = { title: string; description: string; requirements: string; salary: string; active: boolean }

export default function AdminVacancies() {
  const [items, setItems] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Vacancy | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  const load = async () => {
    const { data } = await supabase.from('vacancies').select('*').order('id')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); reset({ active: true }); setShowForm(true) }
  const openEdit = (item: Vacancy) => {
    setEditing(item)
    setValue('title', item.title)
    setValue('description', item.description)
    setValue('requirements', item.requirements)
    setValue('salary', item.salary || '')
    setValue('active', item.active)
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = {
      title: sanitizeString(data.title),
      description: sanitizeString(data.description),
      requirements: sanitizeString(data.requirements),
      salary: data.salary ? sanitizeString(data.salary) : null,
      active: data.active,
    }
    const { error } = editing
      ? await supabase.from('vacancies').update(payload).eq('id', editing.id)
      : await supabase.from('vacancies').insert(payload)

    if (error) { toast.error('Ошибка'); return }
    toast.success(editing ? 'Обновлено' : 'Добавлено')
    setShowForm(false); reset(); setEditing(null); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить вакансию?')) return
    await supabase.from('vacancies').delete().eq('id', id)
    toast.success('Удалено'); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Вакансии</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Добавить</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>{editing ? 'Редактировать' : 'Новая вакансия'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Должность *</label>
                <input {...register('title', { required: 'Обязательно', maxLength: 200 })} />
                {errors.title && <div className="form-error">{errors.title.message}</div>}
              </div>
              <div className="form-group">
                <label>Зарплата</label>
                <input {...register('salary', { maxLength: 100 })} placeholder="$500–$800 / мес." />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Описание *</label>
                <textarea {...register('description', { required: 'Обязательно', maxLength: 1000 })} rows={2} />
                {errors.description && <div className="form-error">{errors.description.message}</div>}
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Требования *</label>
                <textarea {...register('requirements', { required: 'Обязательно', maxLength: 1000 })} rows={2} />
                {errors.requirements && <div className="form-error">{errors.requirements.message}</div>}
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" {...register('active')} style={{ width: 'auto' }} />
                  Активна
                </label>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{item.title}</h3>
                  {item.salary && <div style={{ color: 'var(--accent)', fontSize: '0.88rem', marginBottom: 6 }}>{item.salary}</div>}
                  <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>{item.description}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, marginLeft: 16, flexShrink: 0 }}>
                  <span className={`badge ${item.active ? 'badge-green' : 'badge-red'}`}>{item.active ? 'Активна' : 'Скрыта'}</span>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: 'var(--gray)' }}>Нет вакансий</p>}
        </div>
      )}
    </div>
  )
}
