import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
} from '@react-three/drei'
import GlassModel from './GlassModel'
import PlaceholderSunglasses from './PlaceholderSunglasses'

function Loader() {
  return (
    <Html center>
      <div className="text-sm text-white/70">Loading 3D…</div>
    </Html>
  )
}

/**
 * 360° interactive 3D product viewer (plan §6).
 *
 * Pass `modelUrl` to render a real .glb; omit it to render the
 * procedural placeholder so the experience works before assets land.
 */
export default function ProductViewer({
  modelUrl,
  frameColor,
  lensColor,
  autoRotate = true,
  className = '',
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-2xl bg-viso-bg ${className}`}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 45, near: 0.01, far: 100 }}
        style={{ height: 420 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[8, 10, 10]}
          angle={0.2}
          penumbra={1}
          intensity={1.2}
          castShadow
        />
        <directionalLight position={[-5, 4, 2]} intensity={0.6} />

        <Suspense fallback={<Loader />}>
          {modelUrl ? (
            <GlassModel url={modelUrl} />
          ) : (
            <PlaceholderSunglasses
              frameColor={frameColor}
              lensColor={lensColor}
            />
          )}
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.5}
            scale={5}
            blur={2.4}
            far={2}
          />
        </Suspense>

        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          minDistance={1.6}
          maxDistance={5}
        />
      </Canvas>
    </div>
  )
}
