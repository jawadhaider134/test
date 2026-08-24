import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'
import { api } from '../api'
import ProductGrid from '../components/ProductGrid'

export default function Category() {
  const { gender } = useParams()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  const special = location.pathname === '/sale' ? 'sale' : location.pathname === '/new' ? 'new' : location.pathname === '/top-100' ? 'top' : null
  const search = searchParams.get('q')
  const subcategory = searchParams.get('subcategory') || ''
  const brand = searchParams.get('brand') || ''
  const sort = searchParams.get('sort') || ''

  useEffect(() => {
    api('/products/meta').then(setMeta)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (gender) params.set('gender', gender)
    if (subcategory) params.set('subcategory', subcategory)
    if (brand) params.set('brand', brand)
    if (sort) params.set('sort', sort)
    if (search) params.set('search', search)
    if (special === 'sale') params.set('sale', 'true')
    if (special === 'new') params.set('isNew', 'true')
    if (special === 'top') params.set('isTop', 'true')
    api(`/products?${params}`)
      .then((d) => setProducts(d.products))
      .finally(() => setLoading(false))
  }, [gender, subcategory, brand, sort, search, special])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const title = search
    ? `Results for "${search}"`
    : special === 'sale'
      ? 'SALE'
      : special === 'new'
        ? 'New Arrivals'
        : special === 'top'
          ? 'Top 100'
          : `${gender?.charAt(0).toUpperCase()}${gender?.slice(1)}`

  const subcategories = gender ? meta?.subcategories?.[gender] || [] : ['clothing', 'shoes', 'accessories', 'sportswear']

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className={`text-2xl font-bold ${special === 'sale' ? 'text-red-600' : ''}`}>{title}</h1>
      <p className="mb-4 text-sm text-gray-500">{products.length} items</p>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={subcategory}
          onChange={(e) => setParam('subcategory', e.target.value)}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All categories</option>
          {subcategories.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={brand}
          onChange={(e) => setParam('brand', e.target.value)}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All brands</option>
          {(meta?.brands || []).map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">Sort: Recommended</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>
      <ProductGrid products={products} loading={loading} />
    </div>
  )
}
