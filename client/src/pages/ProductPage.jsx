import { useParams, Link } from 'react-router-dom'
import ProductViewer from '../components/Viewer3D/ProductViewer'
import Button from '../components/UI/Button'
import { getProductById } from '../data/products'
import { useCartStore } from '../store/cartStore'

const taka = (n) => `৳${n.toLocaleString('en-BD')}`

export default function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id)
  const addItem = useCartStore((s) => s.addItem)

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-white/60">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-viso-accent">
          ← Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        to="/shop"
        className="text-sm text-white/50 hover:text-white"
      >
        ← Shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductViewer
          frameColor={product.frameColor}
          lensColor={product.lensColor}
          modelUrl={product.modelUrl}
        />

        <div>
          <p className="text-sm text-white/50">
            {product.brand} · {product.style}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-viso-accent">
              {taka(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-white/40 line-through">
                {taka(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 text-white/70">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-white/40">UV Protection</dt>
            <dd>{product.uvProtection}</dd>
            <dt className="text-white/40">Best for</dt>
            <dd>{product.faceShapes.join(', ')}</dd>
            <dt className="text-white/40">Rating</dt>
            <dd>
              ★ {product.rating} ({product.numReviews})
            </dd>
          </dl>

          <div className="mt-8 flex gap-3">
            <Button onClick={() => addItem(product)}>Add to Cart</Button>
            <Button
              variant="outline"
              disabled
              title="Webcam AR try-on arrives in Phase 2"
            >
              Try in AR — Phase 2
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
