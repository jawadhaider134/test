import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ProductGrid from '../components/ProductGrid'

const TILES = [
  { label: 'Women', to: '/c/women', seed: 'ay-hero-women' },
  { label: 'Men', to: '/c/men', seed: 'ay-hero-men' },
  { label: 'Kids', to: '/c/kids', seed: 'ay-hero-kids' },
]

export default function Home() {
  const [top, setTop] = useState([])
  const [sale, setSale] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api('/products?isTop=true'), api('/products?sale=true')])
      .then(([t, s]) => {
        setTop(t.products.slice(0, 8))
        setSale(s.products.slice(0, 8))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4">
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {TILES.map((tile) => (
          <Link key={tile.label} to={tile.to} className="group relative aspect-[4/5] overflow-hidden rounded">
            <img
              src={`https://picsum.photos/seed/${tile.seed}/600/750`}
              alt={tile.label}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4">
              <span className="bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide">{tile.label}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Top 100</h2>
          <Link to="/top-100" className="text-sm underline">
            View all
          </Link>
        </div>
        <ProductGrid products={top} loading={loading} />
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-red-600">SALE</h2>
          <Link to="/sale" className="text-sm underline">
            View all
          </Link>
        </div>
        <ProductGrid products={sale} loading={loading} />
      </section>
    </div>
  )
}
