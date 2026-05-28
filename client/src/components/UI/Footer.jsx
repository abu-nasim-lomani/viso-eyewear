import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Share2, MessageCircle, Truck, ShieldCheck, RotateCcw, Phone, Mail, Send } from 'lucide-react'

const columns = [
  { title: 'Customer Care', links: ['Help Center', 'How to Buy', 'Returns & Refunds', 'Warranty Policy', 'Contact Us'] },
  { title: 'About VISO', links: ['About Us', 'Careers', 'Terms & Conditions', 'Privacy Policy', 'Blog'] },
  { title: 'Earn With VISO', links: ['Sell on VISO', 'Affiliate Program', 'Become a Partner', 'VISO Business'] },
]

// Map the link labels that have real pages to their routes.
const ROUTES = {
  'Privacy Policy': '/privacy',
  'Terms & Conditions': '/terms',
  'Returns & Refunds': '/returns',
}

const trust = [
  { icon: Truck, title: 'Nationwide Delivery', desc: 'All 64 districts' },
  { icon: RotateCcw, title: '7-Day Returns', desc: 'Easy & hassle-free' },
  { icon: ShieldCheck, title: '100% Authentic', desc: 'Genuine products' },
  { icon: Phone, title: 'Support 10am–8pm', desc: 'Call 16XXX' },
]

const payments = [
  { label: 'bKash', cls: 'bg-[#e2136e] text-white' },
  { label: 'Nagad', cls: 'bg-[#ee7421] text-white' },
  { label: 'Rocket', cls: 'bg-[#8c3494] text-white' },
  { label: 'VISA', cls: 'bg-[#1a1f71] text-white' },
  { label: 'Mastercard', cls: 'bg-white text-ink border border-line' },
  { label: 'Cash on Delivery', cls: 'bg-success text-white' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <footer className="mt-6">
      <div className="shell px-2 sm:px-4">
        {/* newsletter */}
        <div className="accent-gradient relative overflow-hidden rounded-2xl px-6 py-7 text-white sm:px-10">
          <div className="dot-grid absolute inset-0 opacity-30" />
          <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="text-xl font-bold">Get ৳200 off your first order</h3>
              <p className="mt-1 text-sm text-white/80">Subscribe for new drops, AR features & exclusive deals.</p>
            </div>
            {done ? (
              <p className="rounded-lg bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur">✓ You’re subscribed — check your inbox.</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) setDone(true) }}
                className="flex w-full max-w-md overflow-hidden rounded-lg bg-white p-1"
              >
                <div className="flex flex-1 items-center pl-3">
                  <Mail size={18} className="text-faint" />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-faint"
                  />
                </div>
                <button type="submit" className="flex items-center gap-1.5 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-black">
                  <Send size={15} /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white">
        {/* trust strip */}
        <div className="border-y border-line">
          <div className="shell grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
            {trust.map((t) => (
              <div key={t.title} className="flex items-center gap-3">
                <t.icon size={24} className="shrink-0 text-brand" strokeWidth={1.6} />
                <div>
                  <p className="text-sm font-semibold text-ink">{t.title}</p>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* link columns */}
        <div className="shell grid grid-cols-2 gap-8 px-4 py-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient text-base font-extrabold text-white">V</span>
              <span className="text-2xl font-extrabold tracking-tight text-ink">VISO</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Premium sunglasses with a real-time 3D viewer and AR virtual try-on.
              Shop the look, try before you buy — delivered across Bangladesh.
            </p>
            <div className="mt-5 flex gap-3">
              {[Globe, Share2, MessageCircle].map((Icon, i) => (
                <a key={i} href="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-card-alt text-ink-soft transition-colors hover:bg-brand hover:text-white">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold text-ink">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}><Link to={ROUTES[l] || '/'} className="text-sm text-muted transition-colors hover:text-brand">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* payments */}
        <div className="border-t border-line">
          <div className="shell flex flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">We Accept</p>
              <div className="flex flex-wrap gap-2">
                {payments.map((p) => (
                  <span key={p.label} className={`rounded-md px-2.5 py-1 text-xs font-bold ${p.cls}`}>{p.label}</span>
                ))}
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Delivered By</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                {['Pathao', 'RedX', 'Steadfast', 'Sundarban'].map((c) => (
                  <span key={c} className="rounded-md border border-line bg-card-alt px-2.5 py-1 text-xs font-medium text-ink-soft">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="bg-ink">
          <div className="shell flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row">
            <p>© {new Date().getFullYear()} VISO Eyewear. All rights reserved.</p>
            <p>Made in Bangladesh 🇧🇩 · Prices in BDT (৳)</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
