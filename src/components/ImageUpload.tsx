import React, { useState } from 'react'
import { uploadToImgBB } from '../lib/imgbb'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Изображение' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Валидация типа файла
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите файл изображения (PNG, JPG, WebP)')
      return
    }

    // Валидация размера (макс. 10MB для ImgBB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Файл слишком большой. Максимальный размер: 10 МБ')
      return
    }

    setUploading(true)
    try {
      const url = await uploadToImgBB(file)
      onChange(url)
      toast.success('Изображение успешно загружено на сервер!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Ошибка загрузки изображения')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className="form-group" style={{ marginBottom: 20 }}>
      {label && <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      
      {value ? (
        <div style={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(200, 168, 130, 0.3)',
          background: 'rgba(0,0,0,0.2)',
          width: '100%',
          maxHeight: 220,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img src={value} alt="Preview" style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', display: 'block' }} />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
              fontSize: '0.85rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Удалить картинку"
          >
            🗑
          </button>
        </div>
      ) : (
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed rgba(200, 168, 130, 0.2)',
          borderRadius: 2,
          padding: '24px 16px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: 'rgba(255,255,255,0.01)',
          transition: 'all 0.3s ease',
          textAlign: 'center',
        }}
        onMouseEnter={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = 'var(--primary)'
            e.currentTarget.style.background = 'rgba(200, 168, 130, 0.03)'
          }
        }}
        onMouseLeave={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = 'rgba(200, 168, 130, 0.2)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.01)'
          }
        }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 24,
                height: 24,
                border: '2px solid rgba(200,168,130,0.2)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              ` }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>Идет загрузка на сервер...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(200, 168, 130, 0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Выберите файл изображения</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>PNG, JPG или WebP до 10MB</span>
            </div>
          )}
        </label>
      )}
    </div>
  )
}
