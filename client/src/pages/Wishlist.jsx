import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductGrid from '../components/ProductGrid'

export default function Wishlist() {
  const { wishlist } = useStore()

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">Wishlist</h1>
      {wishlist.length ? (
        <ProductGrid products={wishlist} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link to="/" className="mt-4 inline-block rounded bg-black px-6 py-2.5 text-sm font-semibold text-white">
            Discover products
          </Link>
        </div>
      )}
    </div>
  )
}
