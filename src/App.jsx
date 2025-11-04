// src/App.jsx
import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) navigate('/editor')
    }
    checkSession()
  }, [navigate])

  return (
    <div style={{
      backgroundColor: '#0892D0',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: 'white', fontSize: '2rem' }}>Login Page</h1>
    </div>
  )
}