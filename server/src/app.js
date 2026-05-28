import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import { notFound, errorHandler } from './middleware/error.js'

const app = express()

// Security + parsing
app.use(helmet())
const origins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((s) => s.trim())
app.use(cors({ origin: origins, credentials: true }))
app.use(express.json({ limit: '1mb' }))
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// Global rate limit on the API surface
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }))

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Errors
app.use(notFound)
app.use(errorHandler)

export default app
