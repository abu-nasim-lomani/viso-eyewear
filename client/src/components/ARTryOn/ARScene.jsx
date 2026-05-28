import { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, OrthographicCamera, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import PlaceholderSunglasses from '../Viewer3D/PlaceholderSunglasses'

/* ── Tuning constants (adjust during live testing) ─────────────── */
const IRIS_MM = 11.7   // human iris diameter ≈ 11.7mm — our real-world "ruler"
const DEFAULT_MM = 140 // fallback frame width if product has none
const SMOOTH_TAU = 0.08 // seconds; higher = smoother/slower follow
const POS_Y_OFFSET = 0.03 // nudge along the head's "down" (fraction of frame width); + = lower, − = higher
const SCALE_TRIM = 0.9  // global size fine-tune (lower = smaller glasses)
// Rotation pivot depth: 0 = model's bbox centre (temples drag it behind the
// head → lenses swing off the face on turn); 1 = front/lens plane. ~0.8 keeps
// the lenses pinned to the eyes while the temples swing back toward the ears.
const PIVOT_Z_FRAC = 0.8

// Invisible head-shaped occluder so parts of the frame that wrap behind the
// head (temples, far lens on turn) are hidden → looks worn, not pasted on.
// Sizes/offsets are fractions of the model width (× = relative to the frame).
const OCCLUDER = true
const OCC_RX = 0.52, OCC_RY = 0.72, OCC_RZ = 0.62 // ellipsoid radii
const OCC_X = 0, OCC_Y = -0.08, OCC_Z = -0.72     // centre offset (behind + slightly down)
// Peak-hold for the iris ruler: rise fast (face turns frontal / moves closer),
// decay slow — so the frame doesn't shrink when the head turns and the iris
// foreshortens. Real glasses keep their size when you turn your head.
const RULER_RISE = 0.5
const RULER_DECAY = 0.02
// Base orientation correction for the model (radians). The mesh already faces
// the camera (+Z front, temples −Z); tweak if a real .glb is oriented differently.
const BASE_EULER = [0, 0, 0]

// Orthographic frustum in pixel units: x∈[0,W] (left→right), y∈[0,-H] (top→bottom),
// so landmark pixels map 1:1 to world units. `manual` keeps drei from auto-fitting.
function CameraRig() {
  const size = useThree((s) => s.size)
  return (
    <OrthographicCamera
      makeDefault
      manual
      left={0}
      right={size.width}
      top={0}
      bottom={-size.height}
      near={-2000}
      far={2000}
      position={[0, 0, 1000]}
    />
  )
}

function GltfModel({ url }) {
  const { scene } = useGLTF(url, true) // enable Draco
  return <primitive object={scene} />
}

function Glasses({ product, faceRef }) {
  const group = useRef()
  const inner = useRef()
  const occRef = useRef()
  const widthRef = useRef(1)
  const measuredRef = useRef(false)
  const smoothRef = useRef(null)
  const rulerRef = useRef(0) // peak-held px-per-mm
  const downVec = useRef(new THREE.Vector3())
  const size = useThree((s) => s.size)
  const baseQuat = useRef(new THREE.Quaternion().setFromEuler(new THREE.Euler(...BASE_EULER)))

  // Measure + recenter the model once it has mounted.
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!inner.current) return
      const box = new THREE.Box3().setFromObject(inner.current)
      const s = new THREE.Vector3()
      const c = new THREE.Vector3()
      box.getSize(s)
      box.getCenter(c)
      // Pivot at the lens/front plane in Z (not the temple-dragged bbox centre)
      // so the frame rotates like it's worn, not floating off the face.
      const pivotZ = THREE.MathUtils.lerp(c.z, box.max.z, PIVOT_Z_FRAC)
      inner.current.position.set(-c.x, -c.y, -pivotZ)
      widthRef.current = s.x || 1
      measuredRef.current = true

      // Size + place the head occluder relative to the frame width.
      if (occRef.current) {
        const w = widthRef.current
        occRef.current.scale.set(OCC_RX * w, OCC_RY * w, OCC_RZ * w)
        occRef.current.position.set(OCC_X * w, OCC_Y * w, OCC_Z * w)
      }
    })
    return () => cancelAnimationFrame(id)
  }, [product._id])

  useFrame((_, delta) => {
    const g = group.current
    const f = faceRef.current
    if (!g) return
    if (!f?.found || !measuredRef.current) { g.visible = false; return }

    const W = size.width
    const H = size.height
    const frameMm = product.frameWidthMm || DEFAULT_MM

    // Peak-hold the iris ruler so head-turns don't shrink the frame.
    const measured = (f.iris * W) / IRIS_MM // px per mm this frame
    let ruler = rulerRef.current
    if (!ruler) ruler = measured
    else ruler += (measured - ruler) * (measured > ruler ? RULER_RISE : RULER_DECAY)
    rulerRef.current = ruler

    const targetWidthPx = frameMm * ruler * SCALE_TRIM
    const targetScale = targetWidthPx / widthRef.current

    // Anchor at the pupil mid-point (f.bx/f.by come from the iris centers).
    const ax = f.bx * W
    const ay = -(f.by * H)
    const tq = f.quat

    let sm = smoothRef.current
    if (!sm) {
      sm = smoothRef.current = { x: ax, y: ay, s: targetScale, q: tq.clone() }
    } else {
      const k = Math.min(1, 1 - Math.exp(-delta / SMOOTH_TAU))
      sm.x += (ax - sm.x) * k
      sm.y += (ay - sm.y) * k
      sm.s += (targetScale - sm.s) * k
      sm.q.slerp(tq, k)
    }

    // Nudge along the head's local "down" so the frame stays on the nose when
    // the head pitches up/down (instead of drifting to the forehead).
    const offPx = targetWidthPx * POS_Y_OFFSET
    const down = downVec.current.set(0, -1, 0).applyQuaternion(sm.q)

    g.visible = true
    g.position.set(sm.x + down.x * offPx, sm.y + down.y * offPx, down.z * offPx)
    g.scale.setScalar(sm.s)
    g.quaternion.copy(sm.q).multiply(baseQuat.current)
  })

  return (
    <group ref={group} visible={false}>
      {/* invisible head occluder — writes depth only, hides frame parts behind the head */}
      {OCCLUDER && (
        <mesh ref={occRef} renderOrder={-1}>
          <sphereGeometry args={[1, 24, 18]} />
          <meshBasicMaterial colorWrite={false} />
        </mesh>
      )}
      <group ref={inner}>
        {product.modelUrl ? (
          <GltfModel url={product.modelUrl} />
        ) : (
          <PlaceholderSunglasses
            frameColor={product.frameColor}
            lensColor={product.lensColor}
            lensTransmission={0}
            lensOpacity={0.6}
          />
        )}
      </group>
    </group>
  )
}

export default function ARScene({ faceRef, product }) {
  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <CameraRig />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <directionalLight position={[-4, 1, 2]} intensity={0.5} />
      <Suspense fallback={null}>
        <Glasses product={product} faceRef={faceRef} />
        {/* Procedural studio env (no network) so metal/lenses get reflections. */}
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 2, 4]} scale={[8, 8, 1]} />
          <Lightformer intensity={1.1} position={[-4, 0, 3]} scale={[3, 8, 1]} />
          <Lightformer intensity={1.1} position={[4, 0, 3]} scale={[3, 8, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  )
}
