import { useEffect, useState } from 'react'
import { api } from '../api'
import { useStore } from '../context/StoreContext'

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function Account() {
  const { user } = useStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/orders', { auth: true })
      .then((d) => setOrders(d.orders))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      <h1 className="text-2xl font-bold">My account</h1>
      <p className="mb-6 text-gray-600">
        {user?.name} — {user?.email}
      </p>
      <h2 className="mb-4 text-lg font-bold">My orders</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Order #{order.id}</p>
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              <div className="mt-3 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt="" className="h-12 w-9 rounded object-cover" />
                    <span className="flex-1">
                      {item.brand} {item.name} (Size {item.size}) × {item.quantity}
                    </span>
                    <span>€{(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-right font-bold">Total: €{order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders yet.</p>
      )}
    </div>
  )
}
