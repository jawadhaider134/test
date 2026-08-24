import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, user } = useStore()
  const navigate = useNavigate()

  if (!cart.length)
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">Your basket is empty</p>
        <Link to="/" className="mt-4 inline-block rounded bg-black px-6 py-2.5 text-sm font-semibold text-white">
          Continue shopping
        </Link>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">Basket</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-4 border-b border-gray-100 pb-4">
            <Link to={`/p/${item.productId}`} className="h-28 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </Link>
            <div className="flex-1">
              <p className="font-semibold">{item.brand}</p>
              <p className="text-sm text-gray-600">{item.name}</p>
              <p className="text-sm text-gray-500">Size: {item.size}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded border border-gray-300">
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    className="px-2.5 py-1 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-2 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                    className="px-2.5 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId, item.size)}
                  className="text-sm text-gray-400 underline hover:text-black"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-bold">€{(item.unitPrice * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-bold">Total</p>
        <p className="text-lg font-bold">€{cartTotal.toFixed(2)}</p>
      </div>
      <p className="text-xs text-gray-500">incl. VAT — free shipping</p>
      <button
        onClick={() => navigate(user ? '/checkout' : '/login?next=/checkout')}
        className="mt-4 w-full rounded bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800"
      >
        Checkout
      </button>
    </div>
  )
}
