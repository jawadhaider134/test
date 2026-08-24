import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Account from './pages/Account'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminUsers from './admin/AdminUsers'
import { useStore } from './context/StoreContext'

function ShopLayout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function RequireAuth({ children }) {
  const { user } = useStore()
  if (!user && !localStorage.getItem('token')) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useStore()
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />
  if (user && user.role !== 'admin') return <Navigate to="/" replace />
  if (!user) return null
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/c/:gender" element={<Category />} />
        <Route path="/sale" element={<Category />} />
        <Route path="/new" element={<Category />} />
        <Route path="/top-100" element={<Category />} />
        <Route path="/search" element={<Category />} />
        <Route path="/p/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login register />} />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
      </Route>
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
