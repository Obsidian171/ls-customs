import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const adminPath = import.meta.env.VITE_ADMIN_SECRET || 'x-panel'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <div className="loader">Загрузка...</div>
  if (!authed) return <Navigate to={`/${adminPath}/login`} replace />
  return <>{children}</>
}
