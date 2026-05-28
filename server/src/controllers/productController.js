import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

const SORT = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1 },
  best: { isFeatured: -1, sold: -1 },
}

// GET /api/products?q=&cat=&sort=&page=&limit=
export const listProducts = asyncHandler(async (req, res) => {
  const { q, cat, sort } = req.query
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(60, parseInt(req.query.limit) || 60)

  const filter = {}
  if (q) filter.name = { $regex: q, $options: 'i' }
  if (cat) filter.style = cat

  const [products, total] = await Promise.all([
    Product.find(filter).sort(SORT[sort] || SORT.best).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ])

  res.json({ products, total, page, pages: Math.ceil(total / limit) })
})

// GET /api/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean()
  if (!product) throw new ApiError(404, 'Product not found.')
  res.json({ product })
})

// POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json({ product })
})

// PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!product) throw new ApiError(404, 'Product not found.')
  res.json({ product })
})

// DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) throw new ApiError(404, 'Product not found.')
  res.json({ message: 'Product deleted.' })
})
