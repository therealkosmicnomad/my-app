// src/App.jsx
import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/editor')
    })
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
      justifyContent: 'center',
      color: 'white',
      fontSize: '3rem',
      fontWeight: 'bold'
    }}>
      LOGIN
    </div>
  )
}