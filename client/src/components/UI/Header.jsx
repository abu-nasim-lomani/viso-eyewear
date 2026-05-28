import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Search, ShoppingCart, Menu, X, User, ChevronDown, Heart, Store, ScanFace,
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { styles } from '../../data/products'

export default function Header() {
  const count = useCartStore((s) => s.count())
  const user = useAuthStore((s) => s.user)
  const isAuthed = useAuthStore((s) => Boolean(s.token))
  const isAdmin = user?.role === 'admin'
  const logout = useAuthStore((s) => s.logout)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-card">
      {/* ── Main bar ── */}
      <div className="shell flex items-center gap-3 px-4 py-3 md:gap-6">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          className="-ml-1 p-1 text-ink-soft md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient text-base font-extrabold text-white">V</span>
          <span className="hidden text-[22px] font-extrabold tracking-tight text-ink sm:inline">VISO</span>
        </Link>

        {/* search */}
        <form onSubmit={submitSearch} className="flex flex-1 items-center rounded-full border border-line bg-card-alt pl-4 transition-colors focus-within:border-brand focus-within:bg-white">
          <Search size={18} className="shrink-0 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search sunglasses, styles…"
            className="h-10 w-full bg-transparent px-3 text-sm text-ink outline-none placeholder:text-faint"
          />
          <button
            type="submit"
            className="m-1 hidden shrink-0 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:block"
          >
            Search
          </button>
        </form>

        {/* account */}
        {isAuthed ? (
          <div className="group relative hidden shrink-0 md:block">
            <button className="flex items-center gap-1.5 text-sm text-ink-soft">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent"><User size={17} /></span>
              <span className="max-w-[90px] truncate font-medium">{user?.name}</span>
              <ChevronDown size={14} />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 opacity-0 shadow-pop transition-all group-hover:visible group-hover:opacity-100">
              {isAdmin && <Link to="/admin" className="block px-4 py-2.5 text-sm font-semibold text-accent hover:bg-card-alt">Admin Dashboard</Link>}
              <Link to="/orders" className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-card-alt">My Orders</Link>
              <Link to="/cart" className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-card-alt">My Cart</Link>
              <button onClick={logout} className="block w-full px-4 py-2.5 text-left text-sm text-ink-soft hover:bg-card-alt">Log out</button>
            </div>
          </div>
        ) : (
          <div className="hidden shrink-0 items-center gap-1.5 text-sm md:flex">
            <Link to="/login" className="font-medium text-ink-soft hover:text-brand">Login</Link>
            <Link to="/register" className="rounded-lg bg-ink px-4 py-2 font-semibold text-white hover:bg-black">Sign Up</Link>
          </div>
        )}

        <button type="button" title="Wishlist — coming soon" className="hidden p-1 text-ink-soft hover:text-brand lg:block">
          <Heart size={22} />
        </button>

        <Link to="/cart" className="relative shrink-0 p-1 text-ink-soft hover:text-brand">
          <ShoppingCart size={24} />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* ── Category strip ── */}
      <nav className="border-t border-line">
        <div className="shell flex items-center gap-1 overflow-x-auto px-3 no-scrollbar">
          <Link to="/shop" className="flex shrink-0 items-center gap-1.5 px-2 py-2.5 text-sm font-bold text-ink">
            <Store size={16} /> All
          </Link>
          {styles.map((s) => (
            <NavLink
              key={s}
              to={`/shop?cat=${encodeURIComponent(s)}`}
              className="shrink-0 whitespace-nowrap px-3 py-2.5 text-sm text-ink-soft transition-colors hover:text-brand"
            >
              {s}
            </NavLink>
          ))}
          <Link
            to="/shop"
            className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent"
          >
            <ScanFace size={15} /> AR Try-On
          </Link>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <nav className="flex flex-col p-2">
              {!isAuthed && (
                <div className="mb-1 flex gap-2 p-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-line py-2.5 text-center text-sm font-semibold text-ink">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-brand py-2.5 text-center text-sm font-semibold text-white">Sign Up</Link>
                </div>
              )}
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink hover:bg-card-alt">All Sunglasses</Link>
              {styles.map((s) => (
                <NavLink key={s} to={`/shop?cat=${encodeURIComponent(s)}`} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-card-alt">{s}</NavLink>
              ))}
              {isAuthed && (
                <>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-accent hover:bg-card-alt">Admin Dashboard</Link>}
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-card-alt">My Orders</Link>
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="rounded-lg px-3 py-2.5 text-left text-sm text-ink-soft hover:bg-card-alt">Log out ({user?.name})</button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
