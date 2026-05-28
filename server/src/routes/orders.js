import { Router } from 'express'
import { body } from 'express-validator'
import {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.post(
  '/',
  protect,
  body('items').isArray({ min: 1 }).withMessage('Your cart is empty.'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Name is required.'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required.'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required.'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required.'),
  body('shippingAddress.district').trim().notEmpty().withMessage('District is required.'),
  validate,
  createOrder
)

router.get('/my', protect, getMyOrders)
router.get('/', protect, admin, getAllOrders)
router.put('/:id/status', protect, admin, updateOrderStatus)
router.get('/:id', protect, getOrderById)

export default router
