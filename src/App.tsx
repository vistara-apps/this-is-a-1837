import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import { Contacts } from './pages/Contacts'
import { Interactions } from './pages/Interactions'
import { Tasks } from './pages/Tasks'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { CRMProvider } from './context/CRMContext'
import { useAuth } from './hooks/useAuth'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
      />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppShell>
            <Dashboard />
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/contacts" element={
        <ProtectedRoute>
          <AppShell>
            <Contacts />
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/interactions" element={
        <ProtectedRoute>
          <AppShell>
            <Interactions />
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <AppShell>
            <Tasks />
          </AppShell>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <CRMProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#ffffff',
              border: '1px solid #334155'
            }
          }}
        />
      </CRMProvider>
    </div>
  )
}

export default App
