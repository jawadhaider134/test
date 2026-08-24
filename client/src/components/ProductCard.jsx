import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function ProductCard({ product }) {
  const { toggleWishlist, inWishlist } = useStore()
  const wished = inWishlist(product.id)

  return (
    <div className="group relative">
      <button
        aria-label="Toggle wishlist"
        onClick={() => toggleWishlist(product)}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow hover:scale-110"
      >
        <svg
          className={`h-4 w-4 ${wished ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-black'}`}
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
      <Link to={`/p/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.salePrice != null && (
            <span className="absolute left-2 top-2 bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              Sale
            </span>
          )}
          {product.isNew && product.salePrice == null && (
            <span className="absolute left-2 top-2 bg-black px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              New
            </span>
          )}
        </div>
        <div className="mt-2 text-sm">
          <p className="font-semibold">{product.brand}</p>
          <p className="truncate text-gray-600">{product.name}</p>
          {product.salePrice != null ? (
            <p>
              <span className="font-bold text-red-600">€{product.salePrice.toFixed(2)}</span>{' '}
              <span className="text-gray-400 line-through">€{product.price.toFixed(2)}</span>
            </p>
          ) : (
            <p className="font-bold">€{product.price.toFixed(2)}</p>
          )}
        </div>
      </Link>
    </div>
  )
}
