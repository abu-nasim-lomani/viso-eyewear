import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Box, ScanFace, RotateCw, ImageIcon } from 'lucide-react'
import ProductViewer from '../Viewer3D/ProductViewer'
import GlassModel from '../Viewer3D/GlassModel'
import PlaceholderSunglasses from '../Viewer3D/PlaceholderSunglasses'
import FrameThumb from './FrameThumb'
import { sizedImg } from '../../utils/format'

/* preset 3D camera angles shown as thumbnails (azimuth radians; null = free + auto-rotate) */
const ANGLES = [
  { id: '360', azimuth: null, staticAz: 0.0, label: '360°' },
  { id: 'left', azimuth: -0.7, staticAz: -0.7 },
  { id: 'right', azimuth: 0.7, staticAz: 0.7 },
  { id: 'back', azimuth: Math.PI, staticAz: Math.PI },
]

/**
 * Product media gallery.
 *  • If the product has a 3D model (`modelUrl`) → show interactive 3D viewer +
 *    angle thumbnails + AR button alongside any product photos.
 *  • Otherwise → behave like a normal e-commerce gallery: photos only with
 *    hover-zoom (no 3D, no AR).
 */
export default function ProductGallery({ product, onTryAr }) {
  const has3D = !!product.modelUrl
  const images = product.images || []

  const defaultSel = () =>
    has3D
      ? { kind: '3d', azimuth: null }
      : images.length
        ? { kind: 'img', src: images[0] }
        : { kind: 'none' }

  const [sel, setSel] = useState(defaultSel)

  // Reset selection whenever the product changes (adjust-during-render).
  const [prevId, setPrevId] = useState(product._id)
  if (product._id !== prevId) {
    setPrevId(product._id)
    setSel(defaultSel())
  }

  const hasMedia = has3D || images.length > 0

  return (
    <div className="rounded-2xl bg-white p-3 shadow-card sm:p-4">
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {/* ── thumbnail rail ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:w-[68px] sm:flex-col sm:overflow-visible sm:pb-0">
          {/* 3D angle thumbnails — only when a 3D model exists */}
          {has3D && ANGLES.map((a) => {
            const active = sel.kind === '3d' && sel.azimuth === a.azimuth
            // Hide the extra angles on phones — keeps mobile under the
            // browser's WebGL-context limit and avoids clutter.
            const mobileHide = a.id === 'right' || a.id === 'back' ? 'hidden sm:block' : ''
            return (
              <button
                key={a.id}
                onClick={() => setSel({ kind: '3d', azimuth: a.azimuth })}
                className={`${mobileHide} relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-card-alt transition-colors ${active ? 'border-brand ring-1 ring-brand' : 'border-line hover:border-ink/30'}`}
              >
                <AngleThumb product={product} az={a.staticAz} />
                {a.label && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded bg-white/80 px-1 text-[9px] font-bold text-ink">{a.label}</span>
                )}
              </button>
            )
          })}

          {/* image thumbnails */}
          {images.map((src, i) => {
            const active = sel.kind === 'img' && sel.src === src
            return (
              <button
                key={src + i}
                onClick={() => setSel({ kind: 'img', src })}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition-colors ${active ? 'border-brand ring-1 ring-brand' : 'border-line hover:border-ink/30'}`}
              >
                <img src={sizedImg(src, 200)} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </button>
            )
          })}

          {/* AR tile — only when a 3D model exists */}
          {has3D && (
            <button
              onClick={onTryAr}
              className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-accent/40 bg-accent-soft text-accent transition-colors hover:bg-accent/15"
            >
              <ScanFace size={20} />
              <span className="text-[9px] font-bold uppercase">Try AR</span>
            </button>
          )}
        </div>

        {/* ── main stage ── */}
        <div className="relative flex-1">
          {sel.kind === '3d' ? (
            <>
              <ProductViewer
                modelUrl={product.modelUrl}
                frameColor={product.frameColor}
                lensColor={product.lensColor}
                azimuth={sel.azimuth}
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
          ) : sel.kind === 'img' ? (
            <ZoomImage src={sel.src} alt={product.name} />
          ) : (
            /* No 3D and no images — graceful SVG fallback */
            <div className="flex h-[300px] w-full items-center justify-center rounded-xl border border-line bg-card-alt sm:h-[400px] lg:h-[460px]">
              <div className="text-center text-muted">
                <ImageIcon size={36} className="mx-auto opacity-50" />
                <p className="mt-2 text-xs">No media available</p>
                <FrameThumb product={product} className="mx-auto mt-4 w-32 opacity-60" />
              </div>
            </div>
          )}

          {/* image-count hint at bottom-right when in image mode */}
          {sel.kind === 'img' && images.length > 1 && (
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              {images.indexOf(sel.src) + 1} / {images.length}
            </span>
          )}
        </div>
      </div>

      {/* small status strip below — communicates what kind of product this is */}
      {hasMedia && (
        <p className="mt-3 px-1 text-center text-[11px] text-muted">
          {has3D
            ? `3D model · ${images.length} photo${images.length === 1 ? '' : 's'} · AR Try-On available`
            : `${images.length} product photo${images.length === 1 ? '' : 's'}`}
        </p>
      )}
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
      className="h-[300px] w-full overflow-hidden rounded-xl border border-line bg-white sm:h-[400px] lg:h-[460px]"
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
        loading="lazy"
        className="h-full w-full object-contain transition-transform duration-150"
        style={{ transform: zoom ? 'scale(1.9)' : 'scale(1)', transformOrigin: `${pos.x}% ${pos.y}%` }}
      />
    </div>
  )
}
