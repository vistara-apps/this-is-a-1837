import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Contacts } from './pages/Contacts'
import { Interactions } from './pages/Interactions'
import { Tasks } from './pages/Tasks'
import { CRMProvider } from './context/CRMContext'

function App() {
  return (
    <CRMProvider>
      <div className="min-h-screen bg-gradient-dark">
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/interactions" element={<Interactions />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </AppShell>
      </div>
    </CRMProvider>
  )
}

export default App