import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../app/themeSlice'
import { logout } from '../../features/auth/authSlice'
import { logoutAPI } from '../../api/auth.api'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useSelector((state) => state.theme.mode)
  const user = useSelector((state) => state.auth.user)

  const handleLogout = async () => {
    try {
      await logoutAPI()
    } finally {
      dispatch(logout())
      navigate('/login')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ☰
        </button>
        <span className="text-lg font-bold text-blue-600">Shortly</span>
      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
          Logout
        </button>

      </div>
    </nav>
  )
}