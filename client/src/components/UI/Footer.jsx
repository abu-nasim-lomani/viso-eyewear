import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Sunglasses', to: '/shop' },
      { label: 'Bestsellers', to: '/shop' },
      { label: 'New Arrivals', to: '/shop' },
      { label: 'AR Try-On', to: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About VISO', to: '/' },
      { label: 'Our Story', to: '/' },
      { label: 'Blog', to: '/' },
      { label: 'Careers', to: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', to: '/' },
      { label: 'Shipping & Returns', to: '/' },
      { label: 'FAQ', to: '/' },
      { label: 'Track Order', to: '/' },
    ],
  },
]

const payments = ['bKash', 'Nagad', 'SSLCommerz', 'Visa', 'Mastercard']

function Social({ d, label }) {
  return (
    <a
      href="/"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-white/40 hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d={d} />
      </svg>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-viso-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-bold tracking-tight">
              VISO<span className="text-viso-accent">.</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/50">
              Premium sunglasses with real-time 3D viewing and AR virtual
              try-on. Made for Bangladesh.
            </p>
            <div className="mt-5 flex gap-3">
              <Social
                label="Facebook"
                d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0114 6h2.5v3H15a1 1 0 00-1 1V12h2.5l-.5 3H14v7A10 10 0 0022 12z"
              />
              <Social
                label="Instagram"
                d="M12 7.2A4.8 4.8 0 1012 16.8 4.8 4.8 0 0012 7.2zm0 7.9a3.1 3.1 0 110-6.2 3.1 3.1 0 010 6.2zM17 2H7a5 5 0 00-5 5v10a5 5 0 005 5h10a5 5 0 005-5V7a5 5 0 00-5-5zm3.2 15A3.2 3.2 0 0117 20.2H7A3.2 3.2 0 013.8 17V7A3.2 3.2 0 017 3.8h10A3.2 3.2 0 0120.2 7v10zm-2.9-9.4a1.15 1.15 0 11-2.3 0 1.15 1.15 0 012.3 0z"
              />
              <Social
                label="YouTube"
                d="M23 12s0-3.2-.4-4.7a3 3 0 00-2.1-2.1C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.5.4a3 3 0 00-2.1 2.1C1 8.8 1 12 1 12s0 3.2.4 4.7a3 3 0 002.1 2.1c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a3 3 0 002.1-2.1C23 15.2 23 12 23 12zm-13 3V9l5.2 3-5.2 3z"
              />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-white/50 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} VISO Eyewear. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
