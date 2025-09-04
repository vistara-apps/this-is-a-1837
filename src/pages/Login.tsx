import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSuccess = () => {
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  )
}
