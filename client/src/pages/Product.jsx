import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { useStore } from '../context/StoreContext'

export default function Product() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, inWishlist } = useStore()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [image, setImage] = useState(0)
  const [size, setSize] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setProduct(null)
    setSize('')
    setImage(0)
    api(`/products/${id}`)
      .then((d) => setProduct(d.product))
      .catch((e) => setError(e.message))
  }, [id])

  if (error) return <p className="py-16 text-center text-gray-500">{error}</p>
  if (!product) return <p className="py-16 text-center text-gray-500">Loading...</p>

  const handleAdd = () => {
    if (!size && product.sizes.length > 1) return
    addToCart(product, size || product.sizes[0])
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to={`/c/${product.gender}`} className="hover:underline">
          {product.gender}
        </Link>{' '}
        /{' '}
        <Link to={`/c/${product.gender}?subcategory=${product.subcategory}`} className="hover:underline">
          {product.subcategory}
        </Link>
      </nav>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded bg-gray-100">
            <img src={product.images[image]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-2 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setImage(i)}
                className={`h-20 w-16 overflow-hidden rounded border-2 ${i === image ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-lg font-bold">{product.brand}</p>
          <h1 className="text-2xl">{product.name}</h1>
          <div className="mt-2 text-xl">
            {product.salePrice != null ? (
              <>
                <span className="font-bold text-red-600">€{product.salePrice.toFixed(2)}</span>{' '}
                <span className="text-base text-gray-400 line-through">€{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">€{product.price.toFixed(2)}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">incl. VAT plus shipping costs</p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 rounded border px-3 py-2 text-sm ${
                    size === s ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Colours: <span className="font-medium text-gray-900">{product.colors.join(', ')}</span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0 || (!size && product.sizes.length > 1)}
              className="flex-1 rounded bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {added ? 'Added to basket ✓' : !size && product.sizes.length > 1 ? 'Select a size' : 'Add to basket'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className="rounded border border-gray-300 px-4 hover:border-black"
            >
              <svg
                className={`h-5 w-5 ${inWishlist(product.id) ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-black'}`}
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-gray-700">{product.description}</p>

          <ul className="mt-6 space-y-1 text-xs text-gray-500">
            <li>✓ Free shipping</li>
            <li>✓ 30 day return policy</li>
            <li>✓ Secure payments</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
