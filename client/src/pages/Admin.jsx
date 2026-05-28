import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Plus, Pencil, Trash2, X, Check,
  TrendingUp, Clock, Loader2, AlertCircle,
} from 'lucide-react'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import { bdt } from '../utils/format'
import FrameThumb from '../components/Product/FrameThumb'

const STYLES = ['Aviator', 'Round', 'Wayfarer', 'Cat-Eye', 'Wrap', 'Shield', 'Browline']
const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_CLS = {
  pending: 'bg-amber-100 text-amber-700', paid: 'bg-success/10 text-success',
  processing: 'bg-accent-soft text-accent', shipped: 'bg-accent-soft text-accent',
  delivered: 'bg-success/10 text-success', cancelled: 'bg-sale/10 text-sale',
}
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

const blankProduct = {
  _id: '', name: '', brand: 'VISO', price: '', originalPrice: '', style: 'Wayfarer',
  description: '', frameColor: '#1a1a1a', lensColor: '#1e3a5f', frameWidthMm: 140,
  stock: 100, tag: '', image: '', modelUrl: '', faceShapes: '', freeShipping: false, isFeatured: false,
}

export default function Admin() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // product form state or null
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    if (!token || user?.role !== 'admin') return
    Promise.all([api.get('/products', { params: { limit: 100 } }), api.get('/orders')])
      .then(([p, o]) => { setProducts(p.data.products || []); setOrders(o.data.orders || []) })
      .catch((e) => setError(e.response?.data?.message || 'Failed to load admin data.'))
      .finally(() => setLoading(false))
  }, [token, user])

  if (!token) return <Navigate to="/login?redirect=/admin" replace />
  if (user?.role !== 'admin') {
    return (
      <div className="shell px-4 py-24 text-center">
        <AlertCircle size={32} className="mx-auto text-sale" />
        <h1 className="mt-3 text-lg font-bold text-ink">Admin access required</h1>
        <p className="mt-1 text-sm text-muted">Log in with an admin account (e.g. admin@viso.com).</p>
      </div>
    )
  }

  const revenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0)
  const pending = orders.filter((o) => o.status === 'pending').length

  const openNew = () => { setEditing({ ...blankProduct }); setIsNew(true) }
  const openEdit = (p) => {
    setEditing({ ...blankProduct, ...p, faceShapes: (p.faceShapes || []).join(', ') })
    setIsNew(false)
  }

  const saveProduct = async (form) => {
    const payload = {
      ...form,
      price: Number(form.price), originalPrice: Number(form.originalPrice) || undefined,
      frameWidthMm: Number(form.frameWidthMm) || 140, stock: Number(form.stock) || 0,
      faceShapes: form.faceShapes.split(',').map((s) => s.trim()).filter(Boolean),
      tag: form.tag || null,
    }
    if (isNew) {
      const { data } = await api.post('/products', payload)
      setProducts((cur) => [data.product, ...cur])
    } else {
      const { data } = await api.put(`/products/${form._id}`, payload)
      setProducts((cur) => cur.map((p) => (p._id === form._id ? data.product : p)))
    }
    setEditing(null)
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await api.delete(`/products/${id}`)
    setProducts((cur) => cur.filter((p) => p._id !== id))
  }

  const changeStatus = async (id, status) => {
    const { data } = await api.put(`/orders/${id}/status`, { status })
    setOrders((cur) => cur.map((o) => (o._id === id ? data.order : o)))
  }

  const TABS = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['products', 'Products', Package],
    ['orders', 'Orders', ShoppingBag],
  ]

  return (
    <div className="shell px-2 py-4 sm:px-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <h1 className="text-xl font-bold text-ink">Admin Dashboard</h1>
        <span className="text-sm text-muted">Signed in as {user.name}</span>
      </div>

      {/* tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-white p-1 shadow-card">
        {TABS.map(([k, label, Icon]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              tab === k ? 'bg-ink text-white' : 'text-ink-soft hover:bg-card-alt'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-sale/10 px-4 py-3 text-sm text-sale">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl bg-white py-24 shadow-card">
          <Loader2 size={26} className="animate-spin text-accent" />
        </div>
      ) : tab === 'dashboard' ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={Package} label="Products" value={products.length} />
          <Stat icon={ShoppingBag} label="Orders" value={orders.length} />
          <Stat icon={TrendingUp} label="Revenue" value={bdt(revenue)} accent />
          <Stat icon={Clock} label="Pending" value={pending} />
        </div>
      ) : tab === 'products' ? (
        <div className="rounded-2xl bg-white p-3 shadow-card sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">{products.length} Products</h2>
            <button onClick={openNew} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              <Plus size={16} /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase text-muted">
                  <th className="px-2 py-2 font-medium">Product</th>
                  <th className="px-2 py-2 font-medium">Price</th>
                  <th className="px-2 py-2 font-medium">Stock</th>
                  <th className="px-2 py-2 font-medium">Style</th>
                  <th className="px-2 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-line-soft">
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-card-alt">
                          <FrameThumb product={p} className="w-8" />
                        </div>
                        <span className="clamp-1 max-w-[220px] text-ink-soft">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 font-semibold text-price">{bdt(p.price)}</td>
                    <td className="px-2 py-2 text-ink-soft">{p.stock}</td>
                    <td className="px-2 py-2 text-muted">{p.style}</td>
                    <td className="px-2 py-2">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="rounded-md p-1.5 text-ink-soft hover:bg-card-alt hover:text-accent" title="Edit"><Pencil size={15} /></button>
                        <button onClick={() => deleteProduct(p._id)} className="rounded-md p-1.5 text-ink-soft hover:bg-sale/10 hover:text-sale" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-3 shadow-card sm:p-4">
          <h2 className="mb-3 text-sm font-bold text-ink">{orders.length} Orders</h2>
          {orders.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase text-muted">
                    <th className="px-2 py-2 font-medium">Order</th>
                    <th className="px-2 py-2 font-medium">Customer</th>
                    <th className="px-2 py-2 font-medium">Total</th>
                    <th className="px-2 py-2 font-medium">Pay</th>
                    <th className="px-2 py-2 font-medium">Date</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-line-soft align-top">
                      <td className="px-2 py-2">
                        <p className="font-semibold text-ink">{o.orderNumber}</p>
                        <p className="text-xs text-muted">{o.items.reduce((n, i) => n + i.qty, 0)} item(s)</p>
                      </td>
                      <td className="px-2 py-2 text-ink-soft">
                        <p>{o.shippingAddress?.name}</p>
                        <p className="text-xs text-muted">{o.shippingAddress?.city}, {o.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-2 py-2 font-semibold text-price">{bdt(o.totalPrice)}</td>
                      <td className="px-2 py-2 text-xs uppercase text-muted">{o.paymentMethod}</td>
                      <td className="px-2 py-2 text-muted">{fmtDate(o.createdAt)}</td>
                      <td className="px-2 py-2">
                        <select
                          value={o.status}
                          onChange={(e) => changeStatus(o._id, e.target.value)}
                          className={`rounded-md px-2 py-1 text-xs font-semibold capitalize outline-none ${STATUS_CLS[o.status] || 'bg-card-alt text-ink'}`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {editing && (
        <ProductForm form={editing} isNew={isNew} onClose={() => setEditing(null)} onSave={saveProduct} />
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent ? 'bg-brand-soft text-brand' : 'bg-accent-soft text-accent'}`}>
        <Icon size={18} />
      </span>
      <p className="mt-3 text-2xl font-extrabold text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}

function ProductForm({ form: initial, isNew, onClose, onSave }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setChk = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }))

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setSaving(true)
    try { await onSave(form) }
    catch (e2) { setErr(e2.response?.data?.message || 'Save failed.'); setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="my-8 w-full max-w-lg rounded-2xl bg-white p-5 shadow-pop">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{isNew ? 'Add Product' : 'Edit Product'}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-ink-soft hover:bg-card-alt"><X size={20} /></button>
        </div>

        {err && <p className="mb-3 rounded-lg bg-sale/10 px-3 py-2 text-sm text-sale">{err}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Slug (ID)" value={form._id} onChange={set('_id')} required disabled={!isNew} placeholder="phantom-x" />
          <Field label="Brand" value={form.brand} onChange={set('brand')} />
          <Field label="Name" value={form.name} onChange={set('name')} required className="col-span-2" />
          <Field label="Price (৳)" type="number" value={form.price} onChange={set('price')} required />
          <Field label="Original Price (৳)" type="number" value={form.originalPrice} onChange={set('originalPrice')} />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">Style</span>
            <select value={form.style} onChange={set('style')} className="h-10 w-full rounded-lg border border-line px-2 text-sm outline-none focus:border-brand">
              {STYLES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <Field label="Frame width (mm)" type="number" value={form.frameWidthMm} onChange={set('frameWidthMm')} />
          <Field label="Stock" type="number" value={form.stock} onChange={set('stock')} />
          <Field label="Tag" value={form.tag} onChange={set('tag')} placeholder="Bestseller / New / Hot" />
          <Field label="Frame color" type="color" value={form.frameColor} onChange={set('frameColor')} />
          <Field label="Lens color" type="color" value={form.lensColor} onChange={set('lensColor')} />
          <Field label="Face shapes (comma)" value={form.faceShapes} onChange={set('faceShapes')} className="col-span-2" placeholder="Oval, Square, Heart" />
          <Field label="Image URL" value={form.image} onChange={set('image')} className="col-span-2" placeholder="/models/... or https://..." />
          <Field label="3D model URL (.glb)" value={form.modelUrl} onChange={set('modelUrl')} className="col-span-2" placeholder="/models/phantom-x.glb" />
          <label className="col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted">Description</span>
            <textarea value={form.description} onChange={set('description')} rows={2} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand" />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.freeShipping} onChange={setChk('freeShipping')} className="h-4 w-4 accent-brand" /> Free shipping
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.isFeatured} onChange={setChk('isFeatured')} className="h-4 w-4 accent-brand" /> Featured
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-card-alt">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} {isNew ? 'Create' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <input {...props} className="h-10 w-full rounded-lg border border-line px-3 text-sm outline-none transition focus:border-brand disabled:bg-card-alt disabled:text-muted" />
    </label>
  )
}
