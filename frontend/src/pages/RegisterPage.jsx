import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerAPI } from '../api/auth.api'
import { toggleTheme } from '../app/themeSlice'
import { useSelector, useDispatch } from 'react-redux'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useSelector((state) => state.theme.mode)

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await registerAPI({ email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">

      <button
        onClick={() => dispatch(toggleTheme())}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-300"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Create account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Start shortening your links
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}