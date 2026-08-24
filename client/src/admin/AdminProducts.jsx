import { useEffect, useState } from 'react'
import { api } from '../api'

const EMPTY = {
  name: '',
  brand: '',
  gender: 'women',
  subcategory: 'clothing',
  price: '',
  salePrice: '',
  stock: '',
  description: '',
  isNew: false,
  isTop: false,
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
    }
  }

  const input = (key, label, type = 'text') => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={(e) => set(key, e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black"
      />
    </label>
  )

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-2">
      {input('name', 'Name')}
      {input('brand', 'Brand')}
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Gender</span>
        <select
          value={form.gender}
          onChange={(e) => set('gender', e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Category</span>
        <select
          value={form.subcategory}
          onChange={(e) => set('subcategory', e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
          <option value="sportswear">Sportswear</option>
        </select>
      </label>
      {input('price', 'Price (€)', 'number')}
      {input('salePrice', 'Sale price (€, optional)', 'number')}
      {input('stock', 'Stock', 'number')}
      <div className="flex items-end gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isNew} onChange={(e) => set('isNew', e.target.checked)} /> New
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isTop} onChange={(e) => set('isTop', e.target.checked)} /> Top 100
        </label>
      </div>
      <label className="block text-sm sm:col-span-2">
        <span className="mb-1 block font-medium">Description</span>
        <textarea
          rows="2"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-black"
        />
      </label>
      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex gap-3 sm:col-span-2">
        <button className="rounded bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800">Save</button>
        <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-5 py-2 text-sm">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const [search, setSearch] = useState('')

  const refresh = () => api('/products').then((d) => setProducts(d.products))
  useEffect(() => {
    refresh()
  }, [])

  const save = async (form) => {
    const body = { ...form, price: Number(form.price), stock: Number(form.stock), salePrice: form.salePrice || null }
    if (editing === 'new') await api('/admin/products', { method: 'POST', auth: true, body })
    else await api(`/admin/products/${editing.id}`, { method: 'PUT', auth: true, body })
    setEditing(null)
    refresh()
  }

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return
    await api(`/admin/products/${id}`, { method: 'DELETE', auth: true })
    refresh()
  }

  const visible = products.filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <button
          onClick={() => setEditing('new')}
          className="rounded bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          + Add product
        </button>
      </div>
      {editing && (
        <div className="mb-6">
          <ProductForm
            initial={editing === 'new' ? EMPTY : { ...EMPTY, ...editing, salePrice: editing.salePrice ?? '' }}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter products..."
        className="mb-4 w-64 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
      />
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="flex items-center gap-3 px-4 py-2">
                  <img src={p.images[0]} alt="" className="h-12 w-9 rounded object-cover" />
                  <div>
                    <p className="font-semibold">{p.brand}</p>
                    <p className="text-gray-600">{p.name}</p>
                  </div>
                </td>
                <td className="px-4 py-2 capitalize">
                  {p.gender} / {p.subcategory}
                </td>
                <td className="px-4 py-2">
                  {p.salePrice != null ? (
                    <>
                      <span className="font-semibold text-red-600">€{p.salePrice.toFixed(2)}</span>{' '}
                      <span className="text-gray-400 line-through">€{p.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <>€{p.price.toFixed(2)}</>
                  )}
                </td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">
                  <button onClick={() => setEditing(p)} className="mr-3 underline">
                    Edit
                  </button>
                  <button onClick={() => remove(p.id)} className="text-red-600 underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
