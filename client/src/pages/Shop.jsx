import ProductGrid from '../components/Product/ProductGrid'
import { products } from '../data/products'

export default function Shop() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Shop</h1>
      <p className="mt-1 text-sm text-white/50">
        {products.length} products · filters &amp; sort arrive in Phase 1
        Week 2
      </p>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
