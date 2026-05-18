import { Link } from 'react-router-dom'

const taka = (n) => `৳${n.toLocaleString('en-BD')}`

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-viso-surface transition hover:border-white/25"
    >
      <div
        className="relative flex h-44 items-center justify-center"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${product.lensColor}55, ${product.frameColor}22 70%, transparent)`,
        }}
      >
        <span
          className="h-16 w-32 rounded-[40%] border-4"
          style={{
            borderColor: product.frameColor,
            background: `${product.lensColor}cc`,
          }}
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-viso-accent px-2.5 py-0.5 text-[11px] font-semibold text-black">
            {product.tag}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[11px] text-white/80 opacity-0 transition group-hover:opacity-100">
          View in 3D →
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="text-xs text-white/50">★ {product.rating}</span>
        </div>
        <p className="text-xs text-white/50">{product.style}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-viso-accent">
            {taka(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-white/40 line-through">
              {taka(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
