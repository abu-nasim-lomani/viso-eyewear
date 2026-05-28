import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Box, ScanFace, RotateCw } from 'lucide-react'
import ProductViewer from '../Viewer3D/ProductViewer'
import GlassModel from '../Viewer3D/GlassModel'
import PlaceholderSunglasses from '../Viewer3D/PlaceholderSunglasses'

/* preset angles shown as thumbnails (azimuth in radians; null = free + auto-rotate) */
const ANGLES = [
  { id: '360', azimuth: null, staticAz: 0.0, label: '360°' },
  { id: 'left', azimuth: -0.7, staticAz: -0.7 },
  { id: 'right', azimuth: 0.7, staticAz: 0.7 },
  { id: 'back', azimuth: Math.PI, staticAz: Math.PI },
]

export default function ProductGallery({ product, onTryAr }) {
  const images = product.images || []
  // selection: { kind:'3d', azimuth } | { kind:'img', src }
  const [sel, setSel] = useState({ kind: '3d', azimuth: null })

  return (
    <div className="rounded-2xl bg-white p-3 shadow-card sm:p-4">
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {/* thumbnail rail */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:w-[68px] sm:flex-col sm:overflow-visible sm:pb-0">
          {ANGLES.map((a) => {
            const active = sel.kind === '3d' && sel.azimuth === a.azimuth
            return (
              <button
                key={a.id}
                onClick={() => setSel({ kind: '3d', azimuth: a.azimuth })}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-card-alt transition-colors ${active ? 'border-brand ring-1 ring-brand' : 'border-line hover:border-ink/30'}`}
              >
                <AngleThumb product={product} az={a.staticAz} />
                {a.label && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded bg-white/80 px-1 text-[9px] font-bold text-ink">{a.label}</span>
                )}
              </button>
            )
          })}

          {images.map((src, i) => {
            const active = sel.kind === 'img' && sel.src === src
            return (
              <button
                key={src}
                onClick={() => setSel({ kind: 'img', src })}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition-colors ${active ? 'border-brand ring-1 ring-brand' : 'border-line hover:border-ink/30'}`}
              >
                <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            )
          })}

          {/* AR tile */}
          <button
            onClick={onTryAr}
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-accent/40 bg-accent-soft text-accent transition-colors hover:bg-accent/15"
          >
            <ScanFace size={20} />
            <span className="text-[9px] font-bold uppercase">Try AR</span>
          </button>
        </div>

        {/* main stage */}
        <div className="relative flex-1">
          {sel.kind === '3d' ? (
            <>
              <ProductViewer
                modelUrl={product.modelUrl}
                frameColor={product.frameColor}
                lensColor={product.lensColor}
                azimuth={sel.azimuth}
                height={460}
              />
              <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                <Box size={12} /> 360° 3D View
              </span>
              <button
                onClick={onTryAr}
                className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-accent-dark"
              >
                <ScanFace size={14} /> Try in AR
              </button>
              <span className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] text-muted backdrop-blur">
                <RotateCw size={12} /> Drag to rotate · scroll to zoom
              </span>
            </>
          ) : (
            <ZoomImage src={sel.src} alt={product.name} />
          )}
        </div>
      </div>
    </div>
  )
}

function AngleThumb({ product, az }) {
  return (
    <Canvas frameloop="demand" dpr={1} camera={{ position: [0, 0, 3], fov: 42 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <Suspense fallback={null}>
        <group rotation={[0, az, 0]}>
          {product.modelUrl ? (
            <GlassModel url={product.modelUrl} fit={2.0} />
          ) : (
            <PlaceholderSunglasses frameColor={product.frameColor} lensColor={product.lensColor} />
          )}
        </group>
      </Suspense>
    </Canvas>
  )
}

function ZoomImage({ src, alt }) {
  const [zoom, setZoom] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  return (
    <div
      className="h-[460px] w-full overflow-hidden rounded-xl border border-line bg-white"
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain transition-transform duration-150"
        style={{ transform: zoom ? 'scale(1.9)' : 'scale(1)', transformOrigin: `${pos.x}% ${pos.y}%` }}
      />
    </div>
  )
}
