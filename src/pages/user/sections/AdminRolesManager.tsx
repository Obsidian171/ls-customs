import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'

export default function AdminRolesManager() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string>('user')

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    if (user) {
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setCurrentUserRole(data.role)
      }
    }
    loadProfiles()
  }

  const loadProfiles = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('id', { ascending: true })

    setProfiles(data || [])
    setLoading(false)
  }

  const updateRole = async (id: number, currentRole: string, newRole: string) => {
    // Безопасность на стороне клиента: запрещаем разжаловать владельцев без прав владельца
    if (currentRole === 'owner' && currentUserRole !== 'owner') {
      toast.error('Критическая безопасность: Невозможно понизить владельца СТО!')
      return
    }

    setUpdatingId(id)
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', id)

    setUpdatingId(null)

    if (error) {
      toast.error(error.message || 'Не удалось обновить роль')
    } else {
      toast.success('Роль пользователя успешно обновлена!')
      loadProfiles()
    }
  }

  const toggleBan = async (id: number, currentBanStatus: boolean, profileRole: string, fullName: string, email: string) => {
    if (profileRole === 'owner') {
      toast.error('Ошибка безопасности: Нельзя заблокировать владельца!')
      return
    }
    if (currentUserRole !== 'owner' && profileRole !== 'user') {
      toast.error('Ошибка доступа: Администратор может блокировать только клиентов!')
      return
    }

    const name = fullName || email
    const confirmMsg = currentBanStatus 
      ? `Разблокировать пользователя ${name}?`
      : `Вы действительно хотите заблокировать пользователя ${name}? Он потеряет доступ в личный кабинет.`
    
    if (!window.confirm(confirmMsg)) return

    setUpdatingId(id)
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_banned: !currentBanStatus })
      .eq('id', id)
    
    setUpdatingId(null)

    if (error) {
      toast.error('Ошибка при обновлении статуса блокировки')
    } else {
      toast.success(currentBanStatus ? 'Пользователь успешно разблокирован!' : 'Пользователь заблокирован!')
      loadProfiles()
    }
  }

  const deleteProfile = async (id: number, profileRole: string, fullName: string, email: string) => {
    if (profileRole === 'owner') {
      toast.error('Ошибка безопасности: Нельзя удалить владельца!')
      return
    }
    if (currentUserRole !== 'owner' && profileRole !== 'user') {
      toast.error('Ошибка доступа: Администратор может удалять только клиентов!')
      return
    }

    const name = fullName || email
    const confirmMsg = `ВНИМАНИЕ! Вы хотите окончательно удалить профиль пользователя ${name} из системы? Это действие необратимо.`
    
    if (!window.confirm(confirmMsg)) return

    setUpdatingId(id)
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id)
    
    setUpdatingId(null)

    if (error) {
      toast.error('Не удалось удалить профиль: ' + error.message)
    } else {
      toast.success('Профиль пользователя полностью удален!')
      loadProfiles()
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 8, color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
        🔑 Управление должностями и правами
      </h2>
      <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
        Назначайте роли пользователям СТО, переводите участников в сотрудников, блокируйте нарушителей или удаляйте неактивные аккаунты.
      </p>

      {loading ? (
        <div className="loader">Загрузка учетных записей...</div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#0e0e10', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#141418', borderBottom: '2px solid rgba(200, 168, 130, 0.3)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Имя Фамилия</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>E-mail адрес</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Телефон</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>Статус доступа</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>Текущая роль</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>Изменить привилегии</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                let badgeColor = '#2ebd59'
                let badgeText = 'Участник'
                
                if (p.role === 'owner') {
                  badgeColor = 'var(--primary)'
                  badgeText = '👑 Владелец'
                } else if (p.role === 'admin') {
                  badgeColor = '#e74c3c'
                  badgeText = '🛡️ Админ'
                } else if (p.role === 'member') {
                  badgeColor = '#3498db'
                  badgeText = '🔧 Mechanic'
                }

                const isSelf = currentUser && currentUser.id === p.user_id
                
                // Проверяем, может ли текущий пользователь редактировать эту строчку
                const canModifyRole = !isSelf && (currentUserRole === 'owner' || (currentUserRole === 'admin' && p.role === 'user'))
                const canBanOrDelete = !isSelf && (currentUserRole === 'owner' || (currentUserRole === 'admin' && p.role === 'user'))

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', background: p.is_banned ? 'rgba(231, 76, 60, 0.03)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', color: p.is_banned ? 'var(--gray)' : 'var(--white)' }}>
                      {p.full_name || 'Не указано'} {isSelf && <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>(Вы)</span>}
                    </td>
                    <td style={{ padding: '14px 16px', color: p.is_banned ? 'var(--gray)' : 'inherit' }}>{p.email}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--gray-light)' }}>
                      {p.phone || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {p.is_banned ? (
                        <span style={{
                          fontSize: '0.68rem',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          borderRadius: 2,
                          fontWeight: 'bold',
                          background: 'rgba(231, 76, 60, 0.15)',
                          color: '#e74c3c',
                          border: '1px solid #e74c3c'
                        }}>
                          ⛔ ЗАБАНЕН
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.68rem',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          borderRadius: 2,
                          fontWeight: 'bold',
                          background: 'rgba(46, 189, 89, 0.15)',
                          color: '#2ebd59',
                          border: '1px solid #2ebd59'
                        }}>
                          Активен
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 2,
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                        background: 'rgba(255,255,255,0.01)',
                        color: badgeColor,
                        border: `1px solid ${badgeColor}`
                      }}>
                        {badgeText}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {canModifyRole ? (
                        <select
                          value={p.role}
                          disabled={updatingId === p.id}
                          onChange={(e) => updateRole(p.id, p.role, e.target.value)}
                          style={{
                            background: '#141414',
                            border: '1px solid rgba(200, 168, 130, 0.2)',
                            color: '#fff',
                            padding: '6px 10px',
                            borderRadius: 2,
                            fontSize: '0.82rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {currentUserRole === 'owner' ? (
                            <>
                              <option value="user">Участник (Client)</option>
                              <option value="member">Mechanic (Staff)</option>
                              <option value="admin">Администратор (Admin)</option>
                              <option value="owner">Владелец (Owner)</option>
                            </>
                          ) : (
                            <>
                              <option value="user">Участник (Client)</option>
                              <option value="member">Mechanic (Staff)</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--gray)', fontStyle: 'italic' }}>
                          🔒 Доступ заблокирован
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {canBanOrDelete ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                          <button
                            className={`btn btn-sm ${p.is_banned ? 'btn-outline' : 'btn-danger'}`}
                            onClick={() => toggleBan(p.id, p.is_banned, p.role, p.full_name, p.email)}
                            disabled={updatingId === p.id}
                            style={{ 
                              padding: '4px 8px', 
                              fontSize: '0.75rem',
                              borderColor: p.is_banned ? '#2ebd59' : undefined,
                              color: p.is_banned ? '#2ebd59' : undefined 
                            }}
                          >
                            {p.is_banned ? '🔓 Разбанить' : '⛔ Бан'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteProfile(p.id, p.role, p.full_name, p.email)}
                            disabled={updatingId === p.id}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            ❌ Исключить
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--gray)', fontStyle: 'italic' }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
