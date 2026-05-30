import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, Star, Minus, Plus, ShoppingCart, Check,
  Truck, RotateCcw, ShieldCheck, MapPin, Heart, Share2,
} from 'lucide-react'
import ProductCard from '../components/Product/ProductCard'
import ProductGallery from '../components/Product/ProductGallery'
import Button from '../components/UI/Button'
import { products as LOCAL, getProductById as localGet } from '../data/products'
import { fetchProduct, fetchProducts } from '../services/catalog'
import { useCartStore } from '../store/cartStore'
import { bdt, discountPct } from '../utils/format'

const ARTryOn = lazy(() => import('../components/ARTryOn/ARTryOn'))

const compact = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0).replace(/\.0$/, '')}k` : `${n}`

export default function ProductPage() {
  const { id } = useParams()
  const addItem = useCartStore((s) => s.addItem)
  const navigate = useNavigate()
  const [product, setProduct] = useState(() => localGet(id))
  const [all, setAll] = useState([])
  const [resolved, setResolved] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [ci, setCi] = useState(0)
  const [tab, setTab] = useState('desc')
  const [arOpen, setArOpen] = useState(false)

  // Reset per-product state when the URL id changes (adjust-during-render).
  const [prevId, setPrevId] = useState(id)
  if (id !== prevId) {
    setPrevId(id)
    setProduct(localGet(id))
    setResolved(false)
    setCi(0); setQty(1); setTab('desc')
  }

  useEffect(() => {
    let active = true
    fetchProduct(id).then((p) => { if (active) { setProduct(p); setResolved(true) } })
    fetchProducts().then((list) => { if (active) setAll(list) })
    return () => { active = false }
  }, [id])

  if (!product) {
    if (!resolved) return <div className="shell px-4 py-24 text-center text-sm text-muted">Loading…</div>
    return (
      <div className="shell px-4 py-24 text-center">
        <p className="text-sm text-muted">Product not found.</p>
        <Link to="/shop" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">← Back to shop</Link>
      </div>
    )
  }

  const colorOptions = [
    { name: 'As Shown', frame: product.frameColor, lens: product.lensColor },
    { name: 'Matte Black', frame: '#141414', lens: '#1d1d1d' },
    { name: 'Tortoise', frame: '#3b2a1a', lens: '#2a2a2a' },
    { name: 'Gold', frame: '#b08d2e', lens: '#5a3a1e' },
  ]
  const color = colorOptions[ci]
  const colored = { ...product, frameColor: color.frame, lensColor: color.lens }

  const off = discountPct(product.price, product.originalPrice)
  const full = Math.round(product.rating)
  const related = (all.length ? all : LOCAL).filter((p) => p._id !== product._id).slice(0, 5)
  const shipFee = product.freeShipping ? 0 : 60
  const save = product.originalPrice ? product.originalPrice - product.price : 0

  const addToCart = (n = qty) => {
    for (let i = 0; i < n; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }
  const buyNow = () => { addToCart(qty); navigate('/cart') }

  return (
    <div className="shell px-2 py-4 sm:px-4">
      {/* breadcrumb */}
      <nav className="mb-3 flex items-center gap-1 px-1 text-xs text-muted">
        <Link to="/" className="hover:text-brand">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-brand">Sunglasses</Link>
        <ChevronRight size={13} />
        <Link to={`/shop?cat=${encodeURIComponent(product.style)}`} className="hover:text-brand">{product.style}</Link>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Media gallery ── */}
        <div className="lg:sticky lg:top-36 lg:self-start">
          <ProductGallery product={colored} onTryAr={() => setArOpen(true)} />
        </div>

        {/* ── Info + buy ── */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{product.brand} · {product.style}</p>
              <div className="flex gap-1.5">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-card-alt text-ink-soft hover:text-sale" title="Wishlist"><Heart size={16} /></button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-card-alt text-ink-soft hover:text-brand" title="Share"><Share2 size={16} /></button>
              </div>
            </div>
            <h1 className="mt-1.5 text-xl font-bold leading-snug text-ink">{product.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 font-semibold text-success">
                <Star size={13} fill="currentColor" /> {product.rating}
              </span>
              <span className="text-muted">{compact(product.numReviews)} Ratings</span>
              <span className="text-line">|</span>
              <span className="text-muted">{compact(product.sold)} Sold</span>
            </div>

            {/* price */}
            <div className="mt-4 rounded-xl bg-brand-soft p-4">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-3xl font-extrabold text-price">{bdt(product.price)}</span>
                {product.originalPrice && <span className="text-base text-faint line-through">{bdt(product.originalPrice)}</span>}
                {off > 0 && <span className="rounded-md bg-sale px-2 py-0.5 text-xs font-bold text-white">-{off}%</span>}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-muted">
                {save > 0 && <span className="font-semibold text-success">You save {bdt(save)}</span>}
                <span>or 3× {bdt(Math.round(product.price / 3))} interest-free</span>
              </div>
            </div>

            {/* color */}
            <div className="mt-5">
              <p className="mb-2 text-sm text-ink-soft">Color: <span className="font-semibold text-ink">{color.name}</span></p>
              <div className="flex gap-2.5">
                {colorOptions.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setCi(i)}
                    title={c.name}
                    className={`relative h-10 w-10 rounded-full transition-transform hover:scale-105 ${ci === i ? 'ring-2 ring-brand ring-offset-2' : 'ring-1 ring-line'}`}
                    style={{ background: `linear-gradient(135deg, ${c.frame} 50%, ${c.lens} 50%)` }}
                  >
                    {ci === i && <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            {/* quantity */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-sm text-ink-soft">Quantity</span>
              <div className="flex items-center rounded-lg border border-line">
                <button onClick={() => setQty((n) => Math.max(1, n - 1))} disabled={qty <= 1} className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-brand disabled:opacity-40"><Minus size={15} /></button>
                <span className="w-10 text-center text-sm font-medium text-ink">{qty}</span>
                <button onClick={() => setQty((n) => n + 1)} className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-brand"><Plus size={15} /></button>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="soft" onClick={() => addToCart()}>
                  {added ? <><Check size={16} /> Added</> : <><ShoppingCart size={16} /> Add to Cart</>}
                </Button>
                <Button onClick={buyNow}>Buy Now</Button>
              </div>
            </div>
          </div>

          {/* delivery / trust */}
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <div className="space-y-3 text-sm">
              <Trust icon={MapPin} title="Delivery to Dhaka" sub="2–4 days · all 64 districts" />
              <Trust icon={Truck} title={shipFee === 0 ? 'Free Delivery' : `Standard Delivery ${bdt(shipFee)}`} sub="Cash on Delivery available" />
              <Trust icon={RotateCcw} title="7-Day Easy Returns" sub="Change of mind accepted" />
              <Trust icon={ShieldCheck} title="100% Authentic + 6-mo Warranty" sub="Genuine VISO product" accent />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mt-4 rounded-2xl bg-white shadow-card">
        <div className="flex gap-1 border-b border-line px-2 sm:px-4">
          {[['desc', 'Description'], ['specs', 'Specifications'], ['reviews', `Reviews (${compact(product.numReviews)})`]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative px-4 py-3 text-sm font-semibold transition-colors ${tab === k ? 'text-brand' : 'text-muted hover:text-ink'}`}
            >
              {label}
              {tab === k && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {tab === 'desc' && (
            <div className="max-w-3xl">
              <p className="text-sm leading-relaxed text-ink-soft">{product.description}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[`${product.uvProtection} UV protection`, 'Lightweight, all-day comfort', 'Scratch-resistant lenses', `Suits ${product.faceShapes.join(', ')} faces`, 'Includes case + cleaning cloth', '6-month brand warranty'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink-soft"><Check size={15} className="text-success" /> {f}</li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'specs' && (
            <dl className="grid max-w-2xl grid-cols-[140px_1fr] gap-y-3 text-sm">
              {[
                ['Brand', product.brand], ['Frame Style', product.style], ['UV Protection', product.uvProtection],
                ['Material', 'Acetate / Metal'], ['Lens', 'Polarized'], ['Frame Width', `${product.frameWidthMm || 140} mm`],
                ['Weight', '28 g'], ['Best For', `${product.faceShapes.join(', ')} faces`], ['Warranty', '6 months'],
              ].map(([k, v]) => (
                <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="text-ink">{v}</dd></div>
              ))}
            </dl>
          )}

          {tab === 'reviews' && (
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
              <div className="rounded-xl bg-card-alt p-5 text-center">
                <p className="text-4xl font-extrabold text-ink">{product.rating}</p>
                <div className="mt-1 flex justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < full ? 'text-star' : 'text-line'} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">{compact(product.numReviews)} ratings</p>
              </div>
              <div className="space-y-4">
                {[
                  { n: 'Tahsin A.', r: 5, t: 'Exactly as shown in 3D. Fit is perfect and the lenses are genuinely dark. Recommended.' },
                  { n: 'Nusrat J.', r: 5, t: 'Ordered after checking the 360° view. Quality feels premium for the price.' },
                  { n: 'Rifat H.', r: 4, t: 'Good frame, delivery took 4 days to Sylhet. COD worked fine.' },
                ].map((rv) => (
                  <div key={rv.n} className="border-b border-line pb-4 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">{rv.n[0]}</span>
                      <span className="text-sm font-semibold text-ink">{rv.n}</span>
                      <span className="ml-auto flex">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < rv.r ? 'text-star' : 'text-line'} fill="currentColor" />)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-soft">{rv.t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* related */}
      <section className="mt-4 rounded-2xl bg-white p-4 shadow-card sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {arOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 text-sm text-white">Loading AR…</div>}>
          <ARTryOn product={colored} onClose={() => setArOpen(false)} />
        </Suspense>
      )}
    </div>
  )
}

function Trust({ icon: Icon, title, sub, accent }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={18} className={`mt-0.5 shrink-0 ${accent ? 'text-success' : 'text-muted'}`} />
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
    </div>
  )
}
