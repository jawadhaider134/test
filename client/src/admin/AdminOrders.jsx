import { useEffect, useState } from 'react'
import { api } from '../api'

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = () =>
    api('/admin/orders', { auth: true })
      .then((d) => setOrders(d.orders))
      .finally(() => setLoading(false))

  useEffect(() => {
    refresh()
  }, [])

  const setStatus = async (id, status) => {
    await api(`/admin/orders/${id}`, { method: 'PUT', auth: true, body: { status } })
    refresh()
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders ({orders.length})</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3 font-semibold">#{order.id}</td>
                  <td className="px-4 py-3">
                    <p>{order.customer.name}</p>
                    <p className="text-xs text-gray-500">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-xs">
                        {item.brand} {item.name} ({item.size}) × {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-3 font-semibold">€{order.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => setStatus(order.id, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs capitalize"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No orders yet.</p>
      )}
    </div>
  )
}
