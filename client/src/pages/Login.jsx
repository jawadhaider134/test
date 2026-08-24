import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { useStore } from '../context/StoreContext'

export default function Login({ register = false }) {
  const { login } = useStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await api(register ? '/auth/register' : '/auth/login', {
        method: 'POST',
        body: register ? form : { email: form.email, password: form.password },
      })
      login(data)
      navigate(searchParams.get('next') || (data.user.role === 'admin' ? '/admin' : '/'))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 pt-12">
      <h1 className="mb-6 text-center text-2xl font-bold">{register ? 'Create account' : 'Login'}</h1>
      <form onSubmit={submit} className="space-y-4">
        {register && (
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        )}
        <input
          required
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded bg-black py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-300"
        >
          {busy ? 'Please wait...' : register ? 'Create account' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {register ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Login
            </Link>
          </>
        ) : (
          <>
            New here?{' '}
            <Link to="/register" className="underline">
              Create an account
            </Link>
          </>
        )}
      </p>
      {!register && (
        <div className="mt-6 rounded bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold">Demo accounts</p>
          <p>Admin: admin@aboutyou.com / admin123</p>
          <p>Customer: customer@example.com / customer123</p>
        </div>
      )}
    </div>
  )
}
