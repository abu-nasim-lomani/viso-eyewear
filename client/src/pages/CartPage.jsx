import { Link } from 'react-router-dom'
import Button from '../components/UI/Button'
import { useCartStore } from '../store/cartStore'

const taka = (n) => `৳${n.toLocaleString('en-BD')}`

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-white/60">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-viso-accent">
          Browse sunglasses →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Cart</h1>

      <ul className="mt-8 divide-y divide-white/10">
        {items.map((item) => (
          <li key={item._id} className="flex items-center gap-4 py-4">
            <span
              className="h-10 w-16 shrink-0 rounded-lg border-2"
              style={{
                borderColor: item.frameColor,
                background: `${item.lensColor}cc`,
              }}
            />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-white/50">{taka(item.price)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) =>
                updateQty(item._id, Number(e.target.value))
              }
              className="w-16 rounded-lg border border-white/15 bg-transparent px-2 py-1 text-center text-sm"
            />
            <button
              onClick={() => removeItem(item._id)}
              className="text-xs text-white/40 hover:text-red-400"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <button
          onClick={clearCart}
          className="text-sm text-white/40 hover:text-white"
        >
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-sm text-white/50">Subtotal</p>
          <p className="text-2xl font-bold text-viso-accent">
            {taka(total())}
          </p>
        </div>
      </div>

      <div className="mt-6 text-right">
        <Button disabled title="Checkout arrives in Phase 3">
          Checkout — Phase 3
        </Button>
      </div>
    </div>
  )
}
