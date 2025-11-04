// src/App.jsx
import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/editor')
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/editor')
    })

    return () => listener.subscription.unsubscribe()
  }, [navigate])

  return (
    <div style={{ 
      backgroundColor: '#0892D0', 
      height: '100vh', 
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Login form will go here */}
    </div>
  )
}
