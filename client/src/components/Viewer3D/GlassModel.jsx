import { useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Loads a .glb sunglasses model, clones it (so the same model can render in
 * several viewers/thumbnails at once), and auto-centers + scales it to a
 * consistent size regardless of the source units/origin. Draco enabled.
 */
export default function GlassModel({ url, fit = 1.85 }) {
  const { scene } = useGLTF(url, true)
  const model = useMemo(() => scene.clone(true), [scene]) // safe for multiple instances
  const ref = useRef()

  useLayoutEffect(() => {
    const obj = ref.current
    if (!obj) return
    const box = new THREE.Box3().setFromObject(obj)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const s = fit / maxDim
    obj.scale.setScalar(s)
    obj.position.set(-center.x * s, -center.y * s, -center.z * s)
  }, [model, fit])

  return <primitive ref={ref} object={model} />
}
