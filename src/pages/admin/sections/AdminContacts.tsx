import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'
import { sanitizeString } from '../../../lib/sanitize'
import type { ContactInfo } from '../../../types'

type FormData = { discord: string; telegram: string; phone: string; address: string; gps: string }

export default function AdminContacts() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existingId, setExistingId] = useState<number | null>(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    supabase.from('contacts').select('*').single().then(({ data }) => {
      if (data) {
        setExistingId(data.id)
        reset({
          discord: data.discord || '',
          telegram: data.telegram || '',
          phone: data.phone || '',
          address: data.address || '',
          gps: data.gps || '',
        })
      }
      setLoading(false)
    })
  }, [reset])

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    const payload: Partial<ContactInfo> = {
      discord: sanitizeString(data.discord),
      telegram: sanitizeString(data.telegram),
      phone: sanitizeString(data.phone),
      address: sanitizeString(data.address),
      gps: sanitizeString(data.gps),
    }

    const { error } = existingId
      ? await supabase.from('contacts').update(payload).eq('id', existingId)
      : await supabase.from('contacts').insert(payload)

    setSaving(false)
    if (error) { toast.error('Ошибка сохранения'); return }
    toast.success('Контакты сохранены')
  }

  if (loading) return <div className="loader">Загрузка...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: 24 }}>Контакты</h2>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Discord</label>
            <input {...register('discord', { maxLength: 200 })} placeholder="discord.gg/..." />
          </div>
          <div className="form-group">
            <label>Telegram</label>
            <input {...register('telegram', { maxLength: 100 })} placeholder="@username" />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input {...register('phone', { maxLength: 50 })} placeholder="511-515" />
          </div>
          <div className="form-group">
            <label>Адрес</label>
            <input {...register('address', { maxLength: 300 })} placeholder="Los Santos, Rodeo..." />
          </div>
          <div className="form-group">
            <label>Мы в GPS</label>
            <input {...register('gps', { maxLength: 50 })} placeholder="25-46" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  )
}
