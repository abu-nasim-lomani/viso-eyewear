import api from '../utils/api'
import { products as LOCAL, getProductById as localGet } from '../data/products'

/**
 * Catalog data access. Uses the real API (GET /api/products) when the
 * backend is up, and transparently falls back to the bundled mock data
 * so the storefront keeps working during local dev / if the API is down.
 */
export async function fetchProducts() {
  try {
    const { data } = await api.get('/products', { params: { limit: 60 } })
    const list = data?.products ?? data
    return Array.isArray(list) && list.length ? list : LOCAL
  } catch {
    return LOCAL
  }
}

export async function fetchProduct(id) {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data?.product ?? data ?? localGet(id)
  } catch {
    return localGet(id) ?? null
  }
}
