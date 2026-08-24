import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const GENDERS = [
  { label: 'Women', path: '/c/women' },
  { label: 'Men', path: '/c/men' },
  { label: 'Kids', path: '/c/kids' },
]

const SUBNAV = [
  { label: 'SALE', to: '/sale', sale: true },
  { label: 'Clothing', to: '/c/women?subcategory=clothing' },
  { label: 'Shoes', to: '/c/women?subcategory=shoes' },
  { label: 'Sportswear', to: '/c/women?subcategory=sportswear' },
  { label: 'Accessories', to: '/c/women?subcategory=accessories' },
  { label: 'New', to: '/new' },
  { label: 'Top 100', to: '/top-100' },
]

function IconButton({ to, label, count, children }) {
  return (
    <Link to={to} aria-label={label} className="relative p-2 hover:opacity-60">
      {children}
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

export default function Header() {
  const { cartCount, wishlist, user, logout } = useStore()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <nav className="flex gap-5 text-sm font-semibold">
          {GENDERS.map((g) => (
            <NavLink
              key={g.path}
              to={g.path}
              className={({ isActive }) =>
                `border-b-2 pb-1 ${isActive ? 'border-black' : 'border-transparent hover:border-gray-300'}`
              }
            >
              {g.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" aria-label="Home" className="flex items-center text-xl font-extrabold tracking-tight">
          <span className="bg-black px-1.5 py-0.5 text-white">ABOUT</span>
          <span className="border-2 border-black px-1.5 py-0.5">YOU</span>
        </Link>
        <div className="flex items-center gap-1">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to={user.role === 'admin' ? '/admin' : '/account'} className="text-sm font-semibold hover:underline">
                {user.role === 'admin' ? 'Admin' : user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="text-sm text-gray-500 hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <IconButton to="/login" label="Login">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
              </svg>
            </IconButton>
          )}
          <IconButton to="/wishlist" label="Wishlist" count={wishlist.length}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </IconButton>
          <IconButton to="/cart" label="Basket" count={cartCount}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </IconButton>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 border-t border-gray-100 px-4 py-2">
        <nav className="flex gap-5 overflow-x-auto text-sm">
          {SUBNAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`whitespace-nowrap hover:underline ${item.sale ? 'font-bold text-red-600' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={submitSearch} className="hidden sm:block">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for items, brands and more..."
            className="w-64 rounded bg-gray-100 px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-black"
          />
        </form>
      </div>
      <div className="bg-black py-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-white">
        Free shipping &nbsp;·&nbsp; 30 day return policy &nbsp;·&nbsp; Secure payments
      </div>
    </header>
  )
}
