import { NavLink, Outlet, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
]

export default function AdminLayout() {
  const { user, logout } = useStore()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-56 shrink-0 flex-col bg-black text-white">
        <Link to="/" className="px-5 py-5 text-lg font-extrabold tracking-tight">
          ABOUT<span className="border border-white px-1">YOU</span>
        </Link>
        <p className="px-5 pb-4 text-xs uppercase tracking-wider text-gray-400">Admin panel</p>
        <nav className="flex-1 space-y-1 px-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? 'bg-white text-black font-semibold' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-800 px-5 py-4 text-sm">
          <p className="font-semibold">{user?.name}</p>
          <div className="mt-1 flex gap-3 text-xs text-gray-400">
            <Link to="/" className="hover:text-white">
              View shop
            </Link>
            <button onClick={logout} className="hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
