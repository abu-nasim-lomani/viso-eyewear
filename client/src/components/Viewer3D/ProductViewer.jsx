import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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
      <div className="text-sm text-muted">Loading 3D…</div>
    </Html>
  )
}

/* Eases the orbit camera to a target azimuth when a gallery angle is picked. */
function CameraEase({ controlsRef, azimuth }) {
  useFrame(() => {
    const c = controlsRef.current
    if (azimuth == null || !c) return
    const cur = c.getAzimuthalAngle()
    c.setAzimuthalAngle(cur + (azimuth - cur) * 0.12)
    c.update()
  })
  return null
}

/**
 * 360° interactive 3D product viewer.
 * `modelUrl` → real .glb; omit → procedural placeholder.
 * `azimuth` (radians) → ease the camera to a preset angle (null = free + auto-rotate).
 */
export default function ProductViewer({
  modelUrl,
  frameColor,
  lensColor,
  autoRotate = true,
  azimuth = null,
  className = '',
}) {
  const controlsRef = useRef()
  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-white to-[#e9ebf0] lg:aspect-[4/3] ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 45, near: 0.01, far: 100 }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[8, 10, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
        <directionalLight position={[-5, 4, 2]} intensity={0.6} />

        <Suspense fallback={<Loader />}>
          {modelUrl ? (
            <GlassModel url={modelUrl} />
          ) : (
            <PlaceholderSunglasses frameColor={frameColor} lensColor={lensColor} />
          )}
          <Environment preset="studio" />
          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={5} blur={2.4} far={2} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan={false}
          autoRotate={azimuth == null && autoRotate}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          minDistance={1.6}
          maxDistance={5}
        />
        <CameraEase controlsRef={controlsRef} azimuth={azimuth} />
      </Canvas>
    </div>
  )
}
