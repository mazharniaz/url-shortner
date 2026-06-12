import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  )
}