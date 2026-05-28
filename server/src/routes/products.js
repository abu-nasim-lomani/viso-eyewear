import { Router } from 'express'
import {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct,
} from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'

const router = Router()

router.get('/', listProducts)
router.get('/:id', getProduct)

// Admin-only management.
router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router
