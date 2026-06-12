import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyLinks, fetchTopLinks } from '../features/links/linksSlice'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { links, topLinks, loading } = useSelector((state) => state.links)

  useEffect(() => {
    dispatch(fetchMyLinks())
    dispatch(fetchTopLinks())
  }, [dispatch])

  const totalLinks = links.length
  const activeLinks = links.filter(l => l.is_active).length

  const chartData = topLinks.map(l => ({
    name: l.short_code,
    clicks: parseInt(l.clicks)
  }))

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Links</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {loading ? '...' : totalLinks}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Links</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {loading ? '...' : activeLinks}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Link Clicks</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {loading ? '...' : topLinks[0]?.clicks || 0}
          </p>
        </div>

      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Links by Clicks
        </h2>

        {chartData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Links
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : links.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No links yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="pb-3 font-medium">Short Code</th>
                  <th className="pb-3 font-medium">Original URL</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {links.slice(0, 5).map((link) => (
                  <tr key={link.id}>
                    <td className="py-3 text-blue-500 font-mono">
                      {link.short_code}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                      {link.original_url}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        link.is_active
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                      }`}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}