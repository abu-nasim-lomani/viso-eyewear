import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Wallet, Smartphone, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '../components/UI/Button'
import api from '../utils/api'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { bdt } from '../utils/format'

const FREE_SHIP_MIN = 3000

const PAY_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Wallet, note: 'Pay in cash when your order arrives.' },
  { id: 'bkash', label: 'bKash', icon: Smartphone, note: 'You’ll get a bKash payment prompt.' },
  { id: 'nagad', label: 'Nagad', icon: Smartphone, note: 'You’ll get a Nagad payment prompt.' },
  { id: 'card', label: 'Card', icon: CreditCard, note: 'Visa / Mastercard accepted.' },
]

export default function Checkout() {
  const { items, total, clearCart } = useCartStore()
  const user = useAuthStore((s) => s.user)
  const isAuthed = useAuthStore((s) => Boolean(s.token))

  const [placed, setPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pay, setPay] = useState('cod')
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: '',
    address: '',
    city: '',
    district: '',
    payNumber: '',
    card: '',
  })

  if (!isAuthed) return <Navigate to="/login?redirect=/checkout" replace />
  if (items.length === 0 && !placed) return <Navigate to="/shop" replace />

  const subtotal = total()
  const shipping = subtotal >= FREE_SHIP_MIN ? 0 : 60
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        items: items.map((i) => ({ product: i._id, qty: i.qty })),
        shippingAddress: {
          name: form.name, phone: form.phone, address: form.address,
          city: form.city, district: form.district,
        },
        paymentMethod: pay,
      }
      const { data } = await api.post('/orders', payload)
      setOrderNumber(data.order.orderNumber)
      setPlaced(true)
      clearCart()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (placed) {
    return (
      <div className="shell px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md rounded-2xl bg-white shadow-card p-10"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 size={34} className="text-success" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Order Confirmed!</h1>
          <p className="mt-3 text-sm text-muted">
            Thank you, {form.name || 'friend'}. Your order{' '}
            <span className="font-semibold text-brand">{orderNumber}</span> has been placed.
          </p>
          <p className="mt-1 text-sm text-muted">
            We’ll deliver to {form.city || 'your address'} in 2–4 days.
            {pay === 'cod' ? ' Keep cash ready on delivery.' : ' Payment received.'}
          </p>
          <Link to="/shop" className="mt-6 inline-block"><Button>Continue Shopping</Button></Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="shell px-2 py-4 sm:px-4">
      <nav className="mb-3 flex items-center gap-1 px-1 text-xs text-muted">
        <Link to="/cart" className="hover:text-brand">Cart</Link>
        <ChevronRight size={13} />
        <span className="text-ink-soft">Checkout</span>
      </nav>

      <form onSubmit={submit} className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-sale/10 px-4 py-3 text-sm text-sale">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
          {/* shipping */}
          <Section title="Shipping Address">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={set('name')} required />
              <Field label="Phone number" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={set('phone')} required />
              <Field label="Full address" value={form.address} onChange={set('address')} required className="sm:col-span-2" />
              <Field label="City / Area" value={form.city} onChange={set('city')} required />
              <Field label="District" value={form.district} onChange={set('district')} required />
            </div>
          </Section>

          {/* payment */}
          <Section title="Payment Method">
            <div className="grid gap-2 sm:grid-cols-2">
              {PAY_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPay(m.id)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    pay === m.id
                      ? 'border-brand bg-brand-soft text-brand'
                      : 'border-line text-ink-soft hover:border-ink/30'
                  }`}
                >
                  <m.icon size={20} /> {m.label}
                </button>
              ))}
            </div>

            {(pay === 'bkash' || pay === 'nagad') && (
              <div className="mt-3">
                <Field label={`${pay === 'bkash' ? 'bKash' : 'Nagad'} number`} placeholder="01XXXXXXXXX" value={form.payNumber} onChange={set('payNumber')} required />
              </div>
            )}
            {pay === 'card' && (
              <div className="mt-3">
                <Field label="Card number" placeholder="4242 4242 4242 4242" value={form.card} onChange={set('card')} required />
              </div>
            )}
            <p className="mt-3 text-xs text-muted">
              {PAY_METHODS.find((m) => m.id === pay).note}
              {pay !== 'cod' && ' (Online payment isn’t enabled yet — please use Cash on Delivery.)'}
            </p>
          </Section>
        </div>

        {/* summary */}
        <div className="h-fit rounded-2xl bg-white shadow-card p-4 lg:sticky lg:top-32">
          <h2 className="mb-3 text-sm font-bold text-ink">Order Summary</h2>
          <div className="space-y-2 border-b border-line pb-3">
            {items.map((i) => (
              <div key={i._id} className="flex items-center justify-between text-sm">
                <span className="truncate pr-3 text-muted">
                  {i.name.split(' ').slice(0, 3).join(' ')} <span className="text-faint">×{i.qty}</span>
                </span>
                <span className="shrink-0 text-ink">{bdt(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-b border-line py-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="text-ink">{bdt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="text-ink">{shipping === 0 ? 'Free' : bdt(shipping)}</span></div>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-ink">Total</span>
            <span className="text-xl font-bold text-price">{bdt(subtotal + shipping)}</span>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Placing order…' : 'Place Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-white shadow-card p-4">
      <h2 className="mb-4 text-sm font-bold text-ink">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-line px-3 text-sm text-ink outline-none transition focus:border-brand"
      />
    </label>
  )
}
