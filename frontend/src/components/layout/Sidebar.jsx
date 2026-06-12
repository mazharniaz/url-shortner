import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/links', label: '🔗 My Links' },
  { to: '/analytics', label: '📈 Analytics' },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}