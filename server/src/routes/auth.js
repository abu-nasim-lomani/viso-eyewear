import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import { register, login, me } from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// Stricter limiter on auth to slow brute-force.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false })

router.post(
  '/register',
  authLimiter,
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  validate,
  register
)

router.post(
  '/login',
  authLimiter,
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
  login
)

router.get('/me', protect, me)

export default router
