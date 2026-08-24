import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/admin/stats', { auth: true })
      .then(setStats)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="text-red-600">{error}</p>
  if (!stats) return <p className="text-gray-500">Loading...</p>

  const cards = [
    { label: 'Revenue', value: `€${stats.revenue.toFixed(2)}` },
    { label: 'Orders', value: stats.orders },
    { label: 'Products', value: stats.products },
    { label: 'Users', value: stats.users },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm underline">
            View all
          </Link>
        </div>
        {stats.recentOrders.length ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-semibold">#{order.id}</td>
                    <td className="px-4 py-3">{order.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td className="px-4 py-3">€{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
