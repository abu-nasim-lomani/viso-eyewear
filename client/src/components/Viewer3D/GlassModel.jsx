import { useGLTF } from '@react-three/drei'

/**
 * Loads an optimized .glb sunglasses model (section 13 pipeline output).
 * Used once real assets exist; until then the viewer falls back to
 * <PlaceholderSunglasses />.
 */
export default function GlassModel({ url, scale = 1.5 }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={scale} />
}
