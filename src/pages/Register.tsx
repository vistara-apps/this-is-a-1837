import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'

export function Register() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <RegisterForm onSuccess={handleSuccess} />
    </div>
  )
}
