import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const theme = useSelector((state) => state.theme.mode)
  return (
    <div className={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>            
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
