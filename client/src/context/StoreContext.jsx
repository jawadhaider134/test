import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'

const StoreContext = createContext(null)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => load('user', null))
  const [cart, setCart] = useState(() => load('cart', []))
  const [wishlist, setWishlist] = useState(() => load('wishlist', []))

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist])

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    api('/auth/me', { auth: true })
      .then((d) => setUser(d.user))
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      })
  }, [])

  const value = useMemo(() => {
    const login = ({ token, user }) => {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    }
    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
    const addToCart = (product, size) => {
      setCart((prev) => {
        const key = `${product.id}-${size}`
        const existing = prev.find((i) => `${i.productId}-${i.size}` === key)
        if (existing)
          return prev.map((i) => (`${i.productId}-${i.size}` === key ? { ...i, quantity: i.quantity + 1 } : i))
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            brand: product.brand,
            image: product.images[0],
            unitPrice: product.salePrice ?? product.price,
            size,
            quantity: 1,
          },
        ]
      })
    }
    const updateQuantity = (productId, size, quantity) => {
      setCart((prev) =>
        quantity <= 0
          ? prev.filter((i) => !(i.productId === productId && i.size === size))
          : prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity } : i)),
      )
    }
    const removeFromCart = (productId, size) =>
      setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)))
    const clearCart = () => setCart([])
    const toggleWishlist = (product) =>
      setWishlist((prev) =>
        prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product],
      )
    const inWishlist = (id) => wishlist.some((p) => p.id === id)
    const cartCount = cart.reduce((n, i) => n + i.quantity, 0)
    const cartTotal = Math.round(cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) / 100
    return {
      user,
      login,
      logout,
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      wishlist,
      toggleWishlist,
      inWishlist,
    }
  }, [user, cart, wishlist])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
