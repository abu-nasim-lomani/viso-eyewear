import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Package, ChevronRight, AlertCircle } from 'lucide-react'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import { bdt } from '../utils/format'

const STATUS = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-success/10 text-success',
  processing: 'bg-accent-soft text-accent',
  shipped: 'bg-accent-soft text-accent',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-sale/10 text-sale',
}
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Orders() {
  const isAuthed = useAuthStore((s) => Boolean(s.token))
  const [orders, setOrders] = useState(null) // null = loading
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthed) return
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders || []))
      .catch((e) => { setError(e.response?.data?.message || 'Could not load orders.'); setOrders([]) })
  }, [isAuthed])

  if (!isAuthed) return <Navigate to="/login?redirect=/orders" replace />

  return (
    <div className="shell px-2 py-4 sm:px-4">
      <h1 className="mb-3 px-1 text-lg font-bold text-ink">My Orders</h1>

      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-sale/10 px-4 py-3 text-sm text-sale">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {orders === null ? (
        <div className="space-y-3">
          {[0, 1].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-card" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card-alt">
            <Package size={28} className="text-faint" />
          </div>
          <h2 className="text-lg font-bold text-ink">No orders yet</h2>
          <p className="mt-1 text-sm text-muted">When you place an order, it’ll show up here.</p>
          <Link to="/shop" className="mt-5 inline-flex items-center gap-1 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Start Shopping <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="rounded-2xl bg-white p-4 shadow-card sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div>
                  <p className="text-sm font-bold text-ink">{o.orderNumber}</p>
                  <p className="text-xs text-muted">Placed {fmtDate(o.createdAt)} · {o.paymentMethod.toUpperCase()}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS[o.status] || 'bg-card-alt text-muted'}`}>
                  {o.status}
                </span>
              </div>
              <div className="py-3 text-sm text-ink-soft">
                {o.items.map((i, idx) => (
                  <p key={idx} className="clamp-1">{i.name} <span className="text-faint">×{i.qty}</span></p>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3">
                <span className="text-sm text-muted">{o.items.reduce((n, i) => n + i.qty, 0)} item(s)</span>
                <span className="text-base font-bold text-price">{bdt(o.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
