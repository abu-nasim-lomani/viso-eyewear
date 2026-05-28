import crypto from 'node:crypto'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { preparePayment } from '../utils/payment.js'
import ApiError from '../utils/ApiError.js'

const FREE_SHIP_MIN = 3000
const SHIP_FEE = 60

// POST /api/orders   (protected)
export const createOrder = asyncHandler(async (req, res) => {
  const { items = [], shippingAddress, paymentMethod = 'cod' } = req.body
  if (!items.length) throw new ApiError(400, 'Your cart is empty.')

  // Load real products and rebuild line items from server-trusted prices.
  const ids = items.map((i) => i.product)
  const products = await Product.find({ _id: { $in: ids } })
  const byId = new Map(products.map((p) => [p._id, p]))

  const lineItems = items.map((i) => {
    const p = byId.get(i.product)
    if (!p) throw new ApiError(400, `Product "${i.product}" is no longer available.`)
    const qty = Math.max(1, parseInt(i.qty) || 1)
    return { product: p._id, name: p.name, price: p.price, qty, frameColor: p.frameColor, lensColor: p.lensColor }
  })

  const itemsPrice = lineItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shippingPrice = itemsPrice >= FREE_SHIP_MIN ? 0 : SHIP_FEE
  const totalPrice = itemsPrice + shippingPrice

  // COD is live; other methods throw 501 until configured.
  await preparePayment(paymentMethod)

  const orderNumber = 'VISO-' + crypto.randomBytes(3).toString('hex').toUpperCase()
  const order = await Order.create({
    orderNumber,
    user: req.user._id,
    items: lineItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    status: 'pending',
  })

  // Best-effort stock/sold update.
  await Promise.all(
    lineItems.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: -i.qty, sold: i.qty } })
    )
  )

  res.status(201).json({ order })
})

// GET /api/orders/my   (protected)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt').lean()
  res.json({ orders })
})

// GET /api/orders   (admin) — all orders
export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort('-createdAt').lean()
  res.json({ orders })
})

// PUT /api/orders/:id/status   (admin)
const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  if (!STATUSES.includes(status)) throw new ApiError(400, 'Invalid status.')
  const order = await Order.findById(req.params.id)
  if (!order) throw new ApiError(404, 'Order not found.')
  order.status = status
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = new Date() }
  if ((status === 'paid' || status === 'delivered') && !order.isPaid) {
    order.isPaid = true
    order.paidAt = new Date()
  }
  await order.save()
  res.json({ order })
})

// GET /api/orders/:id   (protected — owner or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean()
  if (!order) throw new ApiError(404, 'Order not found.')
  if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not your order.')
  }
  res.json({ order })
})
