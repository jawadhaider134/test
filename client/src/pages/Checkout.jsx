import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useStore } from '../context/StoreContext'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', street: '', city: '', zip: '', country: '' })
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)

  if (order)
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-bold">Thank you for your order!</p>
        <p className="mt-2 text-gray-600">
          Order #{order.id} — total €{order.total.toFixed(2)}
        </p>
        <Link to="/account" className="mt-6 inline-block rounded bg-black px-6 py-2.5 text-sm font-semibold text-white">
          View my orders
        </Link>
      </div>
    )

  if (!cart.length) {
    navigate('/cart')
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    setPlacing(true)
    setError('')
    try {
      const { order } = await api('/orders', {
        method: 'POST',
        auth: true,
        body: {
          items: cart.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
          shippingAddress: form,
        },
      })
      clearCart()
      setOrder(order)
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  const field = (name, label, span) => (
    <label className={`block text-sm ${span ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        required
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black"
      />
    </label>
  )

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {field('fullName', 'Full name', true)}
        {field('street', 'Street and number', true)}
        {field('zip', 'ZIP code')}
        {field('city', 'City')}
        {field('country', 'Country', true)}
        <div className="sm:col-span-2">
          <p className="mb-1 text-sm font-medium">Payment</p>
          <div className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600">
            Demo checkout — no real payment is processed
          </div>
        </div>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <button
          disabled={placing}
          className="rounded bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-300 sm:col-span-2"
        >
          {placing ? 'Placing order...' : `Place order — €${cartTotal.toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}
