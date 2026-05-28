import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronRight, Zap, ScanFace, Box, Camera, Smile,
  Truck, RotateCcw, Star, Quote,
} from 'lucide-react'
import ProductViewer from '../components/Viewer3D/ProductViewer'
import ProductCard from '../components/Product/ProductCard'
import FrameThumb from '../components/Product/FrameThumb'
import { products as LOCAL } from '../data/products'
import { fetchProducts } from '../services/catalog'
import { discountPct } from '../utils/format'

const benefits = [
  { icon: Box, label: '360° 3D View', sub: 'Inspect every angle' },
  { icon: ScanFace, label: 'AR Virtual Try-On', sub: 'See it on your face' },
  { icon: Truck, label: 'Free Delivery', sub: 'On orders ৳3,000+' },
  { icon: RotateCcw, label: '7-Day Returns', sub: 'Easy & hassle-free' },
]

const tryOnSteps = [
  { icon: Box, title: 'Pick a frame', desc: 'Browse the collection and open any product.' },
  { icon: Camera, title: 'Allow your camera', desc: 'We map 468 points on your face in real time.' },
  { icon: Smile, title: 'See it live', desc: 'The frame sits on your face — move and check the fit.' },
]

const reviews = [
  { name: 'Tahsin Ahmed', city: 'Dhaka', rating: 5, text: 'The AR try-on actually helped me pick the right size. Frame quality is solid and delivery was quick.' },
  { name: 'Nusrat Jahan', city: 'Chattogram', rating: 5, text: 'Loved spinning the glasses in 3D before ordering. Paid with bKash, got it in 3 days.' },
  { name: 'Rifat Hossain', city: 'Sylhet', rating: 4, text: 'Good value for the price. Cash on delivery made it easy to trust the first order.' },
]

export default function Home() {
  const [items, setItems] = useState(LOCAL) // instant render, then hydrate from API
  const [endsAt] = useState(() => Date.now() + 5 * 3600e3 + 23 * 60e3 + 11 * 1000)

  useEffect(() => { fetchProducts().then(setItems) }, [])

  const hero = items[0]
  const styleSample = useMemo(() => {
    const styles = [...new Set(items.map((p) => p.style))]
    return styles.map((s) => items.find((p) => p.style === s))
  }, [items])
  const flashItems = useMemo(
    () => [...items].sort((a, b) => discountPct(b.price, b.originalPrice) - discountPct(a.price, a.originalPrice)),
    [items]
  )

  return (
    <div className="shell space-y-4 px-2 py-4 sm:px-4 sm:py-5">

      {/* ══════════ HERO ══════════ */}
      <section className="hero-glow relative overflow-hidden rounded-2xl bg-ink text-white">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          {/* copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live AR Virtual Try-On
            </span>
            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.06] sm:text-5xl">
              Try sunglasses on,<br />
              in <span className="text-brand">3D</span> &amp; <span className="text-accent">AR.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/65 sm:text-base">
              Spin any frame in 360°, then see it on your face with your camera — before you buy.
              Cash on Delivery &amp; bKash, delivered across Bangladesh.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(251,86,7,.6)] transition-colors hover:bg-brand-dark">
                Shop Collection <ArrowRight size={18} />
              </Link>
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]">
                <ScanFace size={18} /> Try-On in AR
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {['100% UV400', '7-Day Returns', 'Cash on Delivery'].map((t) => (
                <span key={t} className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/70">{t}</span>
              ))}
            </div>
          </div>

          {/* 3D viewer panel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-white p-2 shadow-pop">
              <ProductViewer frameColor={hero?.frameColor} lensColor={hero?.lensColor} />
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> 3D LIVE
              </span>
              <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">
                <ScanFace size={12} /> AR READY
              </span>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/85 px-3 py-2 backdrop-blur">
                <span className="truncate text-xs font-semibold text-ink">{hero?.name?.split(' ').slice(0, 3).join(' ')}</span>
                <span className="shrink-0 text-[11px] text-muted">Drag to rotate ↻</span>
              </div>
            </div>
            <span className="animate-floaty absolute -bottom-3 -left-3 hidden rounded-xl bg-white px-3 py-2 text-xs font-semibold text-ink shadow-pop sm:block">
              ⭐ 4.7 · 1.2k+ reviews
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ BENEFITS ══════════ */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.label} className="flex items-center gap-3 rounded-xl bg-white p-3.5 shadow-card sm:p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <b.icon size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink sm:text-sm">{b.label}</p>
              <p className="truncate text-[11px] text-muted">{b.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ══════════ SHOP BY STYLE ══════════ */}
      <section className="rounded-2xl bg-white p-4 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink sm:text-xl">Shop by Style</h2>
          <Link to="/shop" className="flex items-center text-sm font-semibold text-brand hover:text-brand-dark">View all <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {styleSample.map((p) => (
            <Link
              key={p.style}
              to={`/shop?cat=${encodeURIComponent(p.style)}`}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-card-alt"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card-alt ring-1 ring-line transition-all group-hover:ring-brand/40 group-hover:shadow-card">
                <FrameThumb product={p} className="w-11" />
              </div>
              <span className="text-center text-xs font-medium text-ink-soft group-hover:text-brand">{p.style}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════ AR TRY-ON SHOWCASE ══════════ */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          {/* copy + steps */}
          <div className="p-6 sm:p-10">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Virtual Try-On</span>
            <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">See how they look — before they arrive</h2>
            <p className="mt-3 max-w-md text-sm text-muted">
              No more guessing. VISO maps your face in real time so every frame sits exactly where it should.
              View in 3D, then try it on with your camera.
            </p>
            <ol className="mt-6 space-y-4">
              {tryOnSteps.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">{i + 1}</span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ink"><s.icon size={15} className="text-accent" /> {s.title}</p>
                    <p className="text-[13px] text-muted">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/shop" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(67,97,238,.55)] transition-colors hover:bg-accent-dark">
              <ScanFace size={18} /> Start AR Try-On
            </Link>
          </div>

          {/* visual */}
          <div className="accent-gradient relative flex min-h-[280px] items-center justify-center overflow-hidden p-8">
            <div className="dot-grid absolute inset-0 opacity-40" />
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white/15 backdrop-blur sm:h-56 sm:w-56">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-pop sm:h-36 sm:w-36">
                <FrameThumb product={hero} className="w-24 sm:w-28" />
              </div>
              <span className="absolute -right-2 top-4 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-accent shadow-pop">468-pt tracking</span>
              <span className="animate-floaty absolute -bottom-2 left-2 rounded-lg bg-ink px-2.5 py-1 text-[11px] font-semibold text-white shadow-pop">Real-time fit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FLASH SALE ══════════ */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-brand sm:text-xl">
              <Zap size={20} fill="currentColor" /> Flash Sale
            </h2>
            <Countdown to={endsAt} />
          </div>
          <Link to="/shop" className="flex items-center text-sm font-semibold text-brand hover:text-brand-dark">See All <ChevronRight size={16} /></Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-5 no-scrollbar sm:px-6">
          {flashItems.map((p) => (
            <div key={p._id} className="w-40 shrink-0 sm:w-48">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ JUST FOR YOU ══════════ */}
      <section className="rounded-2xl bg-white p-4 shadow-card sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-ink sm:text-xl">Just For You</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 rounded-lg border border-line px-8 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ══════════ REVIEWS ══════════ */}
      <section className="rounded-2xl bg-white p-4 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink sm:text-xl">What customers say</h2>
          <span className="flex items-center gap-1 text-sm text-muted"><Star size={16} className="text-star" fill="currentColor" /> 4.7 average</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-xl border border-line p-4">
              <Quote size={20} className="text-accent/40" />
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{r.text}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{r.name}</p>
                  <p className="text-xs text-muted">{r.city}</p>
                </div>
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? 'text-star' : 'text-line'} fill="currentColor" />
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Countdown({ to }) {
  const [left, setLeft] = useState(() => Math.max(0, to - Date.now()))
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, to - Date.now())), 1000)
    return () => clearInterval(id)
  }, [to])

  const pad = (n) => String(n).padStart(2, '0')
  const h = Math.floor(left / 3.6e6)
  const m = Math.floor(left / 6e4) % 60
  const s = Math.floor(left / 1000) % 60

  return (
    <div className="flex items-center gap-1">
      <span className="hidden text-xs text-muted sm:inline">Ends in</span>
      {[h, m, s].map((n, i) => (
        <span key={i} className="rounded-md bg-ink px-1.5 py-1 font-mono text-xs font-bold text-white">{pad(n)}</span>
      ))}
    </div>
  )
}
