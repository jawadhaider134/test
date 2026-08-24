import ProductCard from './ProductCard'

export default function ProductGrid({ products, loading }) {
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    )
  if (!products.length) return <p className="py-16 text-center text-gray-500">No products found.</p>
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
