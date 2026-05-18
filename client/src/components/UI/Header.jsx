import { Link, NavLink } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

const navClass = ({ isActive }) =>
  `text-sm transition ${
    isActive ? 'text-viso-accent' : 'text-white/70 hover:text-white'
  }`

export default function Header() {
  const count = useCartStore((s) => s.count())

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-viso-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          VISO<span className="text-viso-accent">.</span>
        </Link>

        <nav className="flex items-center gap-7">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={navClass}>
            Shop
          </NavLink>
          <NavLink to="/cart" className={navClass}>
            Cart{count > 0 && ` (${count})`}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
