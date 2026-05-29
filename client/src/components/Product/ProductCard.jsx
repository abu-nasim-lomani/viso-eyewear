import { useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Box, ScanFace } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { bdt, discountPct, sizedImg } from '../../utils/format'
import FrameThumb from './FrameThumb'

const compact = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0).replace(/\.0$/, '')}k` : `${n}`

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const navigate = useNavigate()
  const off = discountPct(product.price, product.originalPrice)
  const swatches = [product.frameColor, product.lensColor, '#5b6472']
  const primary = (product.images && product.images[0]) || product.image
  const has3D = !!product.modelUrl

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group card-hover relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-card shadow-card hover:shadow-card-hover"
    >
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white to-card-alt">
        {primary ? (
          <img
            src={sizedImg(primary, 500)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6">
            <FrameThumb product={product} className="w-[80%] transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}

        {off > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-sale px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
            -{off}%
          </span>
        )}

        {/* wishlist */}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add to wishlist"
          title="Wishlist — coming soon"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-sm backdrop-blur transition-colors hover:text-sale"
        >
          <Heart size={16} />
        </button>

        {/* 3D / AR feature badges — only when the product really has a 3D model */}
        {has3D && (
          <div className="absolute bottom-2.5 left-2.5 flex gap-1">
            <span className="flex items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent shadow-sm">
              <Box size={11} /> 3D
            </span>
            <span className="flex items-center gap-1 rounded-md bg-ink/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              <ScanFace size={11} /> AR
            </span>
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* swatches */}
        <div className="mb-2 flex items-center gap-1">
          {swatches.map((c, i) => (
            <span key={i} className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: c }} />
          ))}
          <span className="ml-1 text-[11px] text-faint">+{product.faceShapes?.length || 2} fits</span>
        </div>

        <h3 className="clamp-2 min-h-[40px] text-[13px] leading-5 text-ink-soft transition-colors group-hover:text-brand">
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-price">{bdt(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-faint line-through">{bdt(product.originalPrice)}</span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          <span className="flex items-center gap-0.5 rounded bg-success/10 px-1.5 py-0.5 font-semibold text-success">
            <Star size={11} fill="currentColor" /> {product.rating}
          </span>
          <span className="text-faint">({compact(product.numReviews)})</span>
          <span className="ml-auto text-faint">{compact(product.sold)} sold</span>
        </div>

        {/* add to cart — visible on mobile, reveals on hover for desktop */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); addItem(product) }}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-brand-soft py-2 text-[13px] font-semibold text-brand transition-all hover:bg-brand hover:text-white md:opacity-0 md:group-hover:opacity-100"
        >
          <ShoppingCart size={15} /> Add to Cart
        </button>
      </div>
    </div>
  )
}
