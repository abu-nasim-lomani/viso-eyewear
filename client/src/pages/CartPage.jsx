import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import Button from '../components/UI/Button'
import FrameThumb from '../components/Product/FrameThumb'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { bdt } from '../utils/format'

const FREE_SHIP_MIN = 3000

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, total } = useCartStore()
  const navigate = useNavigate()
  const isAuthed = useAuthStore((s) => Boolean(s.token))

  const checkout = () => navigate(isAuthed ? '/checkout' : '/login?redirect=/checkout')

  if (items.length === 0) {
    return (
      <div className="shell px-4 py-20 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl bg-white shadow-card p-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card-alt">
            <ShoppingBag size={28} className="text-faint" />
          </div>
          <h1 className="text-xl font-bold text-ink">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted">Browse the collection and add a frame to get started.</p>
          <Link to="/shop" className="mt-6">
            <Button>Continue Shopping <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = total()
  const shipping = subtotal >= FREE_SHIP_MIN ? 0 : 60
  const toFree = FREE_SHIP_MIN - subtotal

  return (
    <div className="shell px-2 py-4 sm:px-4">
      <h1 className="mb-3 px-1 text-lg font-bold text-ink">
        Shopping Cart <span className="font-normal text-muted">({items.length})</span>
      </h1>

      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        {/* items */}
        <div className="rounded-2xl bg-white shadow-card">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 border-b border-line p-4 last:border-b-0 sm:gap-4"
              >
                <button
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-card-alt"
                >
                  <FrameThumb product={item} className="w-14" />
                </button>

                <div className="min-w-0 flex-1">
                  <button onClick={() => navigate(`/product/${item._id}`)} className="block text-left">
                    <p className="clamp-2 text-sm text-ink-soft hover:text-brand">{item.name}</p>
                  </button>
                  <p className="mt-1 text-xs text-muted">{item.style} · {item.uvProtection}</p>
                  <p className="mt-1 text-base font-bold text-price sm:hidden">{bdt(item.price)}</p>
                </div>

                <div className="hidden w-24 text-right text-base font-bold text-price sm:block">
                  {bdt(item.price)}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center rounded border border-line">
                    <button
                      onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                      className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-brand"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm text-ink">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-brand"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex items-center gap-1 text-xs text-faint hover:text-sale"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-between p-4">
            <button onClick={clearCart} className="text-sm text-muted hover:text-sale">Clear cart</button>
            <Link to="/shop" className="text-sm font-semibold text-brand hover:underline">+ Add more items</Link>
          </div>
        </div>

        {/* summary */}
        <div className="h-fit space-y-3 lg:sticky lg:top-32">
          <div className="rounded-2xl bg-white shadow-card p-4">
            <h2 className="mb-3 text-sm font-bold text-ink">Order Summary</h2>
            {shipping > 0 && toFree > 0 && (
              <p className="mb-3 rounded-sm bg-brand-soft px-3 py-2 text-xs text-brand">
                Add <b>{bdt(toFree)}</b> more for FREE delivery 🚚
              </p>
            )}
            <div className="space-y-2 border-b border-line pb-3 text-sm">
              <Row label={`Subtotal (${items.reduce((n, i) => n + i.qty, 0)} items)`} value={bdt(subtotal)} />
              <Row label="Shipping fee" value={shipping === 0 ? 'Free' : bdt(shipping)} />
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-ink">Total</span>
              <span className="text-xl font-bold text-price">{bdt(subtotal + shipping)}</span>
            </div>
            <Button onClick={checkout} className="w-full">
              Proceed to Checkout ({items.length})
            </Button>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">We Accept</p>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded px-2 py-1 bg-[#e2136e] text-white">bKash</span>
              <span className="rounded px-2 py-1 bg-[#ee7421] text-white">Nagad</span>
              <span className="rounded px-2 py-1 bg-success text-white">Cash on Delivery</span>
              <span className="rounded px-2 py-1 bg-[#1a1f71] text-white">Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}
