import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react'
import ProductCard from '../components/Product/ProductCard'
import { products as LOCAL } from '../data/products'
import { fetchProducts } from '../services/catalog'

const PRICE_BANDS = [
  { id: 'all', label: 'All prices', test: () => true },
  { id: 'lt1500', label: 'Under ৳1,500', test: (p) => p.price < 1500 },
  { id: '1500-2000', label: '৳1,500 – ৳2,000', test: (p) => p.price >= 1500 && p.price <= 2000 },
  { id: 'gt2000', label: 'Over ৳2,000', test: (p) => p.price > 2000 },
]
const SORTS = [
  { id: 'best', label: 'Best Match' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'discount', label: 'Biggest Discount' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const cat = params.get('cat') ?? ''

  const [selStyles, setSelStyles] = useState(cat ? [cat] : [])
  const [band, setBand] = useState('all')
  const [sort, setSort] = useState('best')
  const [freeOnly, setFreeOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [items, setItems] = useState(LOCAL) // instant render, then hydrate from API

  useEffect(() => { fetchProducts().then(setItems) }, [])

  const STYLE_OPTIONS = useMemo(() => [...new Set(items.map((p) => p.style))], [items])

  // Reset the style filter when the category in the URL changes
  // (React's "adjust state during render" pattern — no effect needed).
  const [prevCat, setPrevCat] = useState(cat)
  if (cat !== prevCat) {
    setPrevCat(cat)
    setSelStyles(cat ? [cat] : [])
  }

  const toggleStyle = (s) =>
    setSelStyles((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

  const results = useMemo(() => {
    const priceTest = PRICE_BANDS.find((b) => b.id === band).test
    let list = items.filter(
      (p) =>
        (q ? p.name.toLowerCase().includes(q.toLowerCase()) : true) &&
        (selStyles.length ? selStyles.includes(p.style) : true) &&
        (freeOnly ? p.freeShipping : true) &&
        priceTest(p)
    )
    const off = (p) => (p.originalPrice ? (p.originalPrice - p.price) / p.originalPrice : 0)
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'discount') list = [...list].sort((a, b) => off(b) - off(a))
    if (sort === 'best') list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    return list
  }, [q, selStyles, band, sort, freeOnly, items])

  const clearAll = () => {
    setSelStyles([])
    setBand('all')
    setFreeOnly(false)
    if (q || cat) setParams({}, { replace: true })
  }
  const activeFilters = selStyles.length + (band !== 'all' ? 1 : 0) + (freeOnly ? 1 : 0)
  const heading = q ? `Results for “${q}”` : cat || 'All Sunglasses'

  return (
    <div className="shell px-2 py-4 sm:px-4">
      {/* breadcrumb */}
      <nav className="mb-3 flex items-center gap-1 px-1 text-xs text-muted">
        <Link to="/" className="hover:text-brand">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-brand">Sunglasses</Link>
        {(cat || q) && (
          <>
            <ChevronRight size={13} />
            <span className="text-ink-soft">{heading}</span>
          </>
        )}
      </nav>

      <div className="grid gap-4 lg:grid-cols-[230px_1fr]">
        {/* ── Sidebar ── */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} h-fit rounded-2xl bg-white shadow-card p-4 lg:block`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Filters</h2>
            {activeFilters > 0 && (
              <button onClick={clearAll} className="text-xs text-brand hover:underline">Clear all</button>
            )}
          </div>

          <FilterGroup title="Style">
            {STYLE_OPTIONS.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={selStyles.includes(s)}
                  onChange={() => toggleStyle(s)}
                  className="h-4 w-4 accent-brand"
                />
                {s}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            {PRICE_BANDS.map((b) => (
              <label key={b.id} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink-soft">
                <input
                  type="radio"
                  name="price"
                  checked={band === b.id}
                  onChange={() => setBand(b.id)}
                  className="h-4 w-4 accent-brand"
                />
                {b.label}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Shipping" last>
            <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              Free Shipping
            </label>
          </FilterGroup>
        </aside>

        {/* ── Results ── */}
        <div>
          {/* toolbar */}
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-white shadow-card px-3 py-2.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded border border-line px-3 py-1.5 text-sm text-ink-soft lg:hidden"
              >
                <SlidersHorizontal size={15} /> Filters{activeFilters > 0 ? ` (${activeFilters})` : ''}
              </button>
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">{results.length}</span> items
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="hidden sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-brand"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {/* active filter chips */}
          {(selStyles.length > 0 || freeOnly) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selStyles.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleStyle(s)}
                  className="flex items-center gap-1 rounded-full border border-brand/40 bg-brand-soft px-3 py-1 text-xs text-brand"
                >
                  {s} <X size={12} />
                </button>
              ))}
              {freeOnly && (
                <button
                  onClick={() => setFreeOnly(false)}
                  className="flex items-center gap-1 rounded-full border border-brand/40 bg-brand-soft px-3 py-1 text-xs text-brand"
                >
                  Free Shipping <X size={12} />
                </button>
              )}
            </div>
          )}

          {results.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl bg-white shadow-card py-24 text-center">
              <p className="text-sm text-muted">No products match your filters.</p>
              <button onClick={clearAll} className="mt-3 text-sm font-semibold text-brand hover:underline">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children, last }) {
  return (
    <div className={`pb-4 ${last ? '' : 'mb-4 border-b border-line'}`}>
      <h3 className="mb-2 text-sm font-bold text-ink">{title}</h3>
      {children}
    </div>
  )
}
