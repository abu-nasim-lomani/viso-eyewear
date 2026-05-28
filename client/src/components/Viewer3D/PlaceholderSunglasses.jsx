import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedurally-generated sunglasses.
 *
 * Phase 1 ships before any real .glb assets exist (those come from the
 * 3D Model Pipeline in section 13). This component lets the 3D viewer +
 * AR pipeline be built and tested end-to-end today. Swap it for
 * <GlassModel url={...} /> once optimized .glb files are available.
 */
function roundedRect(w, h, r) {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

export default function PlaceholderSunglasses({
  frameColor = '#1a1a1a',
  lensColor = '#1e3a5f',
  lensOpacity = 0.85,
  lensTransmission = 0.55,
}) {
  const { frameGeo, lensGeo } = useMemo(() => {
    const lensW = 1.05
    const lensH = 0.78
    const radius = 0.22

    // Frame = outer rounded rect with an inner rounded-rect hole.
    const outer = roundedRect(lensW + 0.16, lensH + 0.16, radius + 0.05)
    const hole = roundedRect(lensW, lensH, radius)
    outer.holes.push(new THREE.Path(hole.getPoints(32)))

    const frameGeo = new THREE.ExtrudeGeometry(outer, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSize: 0.015,
      bevelThickness: 0.015,
      bevelSegments: 2,
      curveSegments: 32,
    })
    frameGeo.center()

    const lensGeo = new THREE.ExtrudeGeometry(roundedRect(lensW, lensH, radius), {
      depth: 0.05,
      bevelEnabled: false,
      curveSegments: 32,
    })
    lensGeo.center()

    return { frameGeo, lensGeo }
  }, [])

  const offsetX = 0.68
  const templeLength = 1.7

  return (
    <group rotation={[0, 0, 0]} scale={1.15}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * offsetX, 0, 0]}>
          <mesh geometry={frameGeo} castShadow>
            <meshStandardMaterial
              color={frameColor}
              metalness={0.55}
              roughness={0.35}
            />
          </mesh>
          <mesh geometry={lensGeo}>
            <meshPhysicalMaterial
              color={lensColor}
              metalness={0.1}
              roughness={0.08}
              transmission={lensTransmission}
              thickness={0.4}
              ior={1.45}
              clearcoat={1}
              clearcoatRoughness={0.1}
              transparent
              opacity={lensOpacity}
            />
          </mesh>

          {/* Temple arm */}
          <mesh
            position={[side * 0.78, 0.18, -templeLength / 2 + 0.08]}
            castShadow
          >
            <boxGeometry args={[0.07, 0.1, templeLength]} />
            <meshStandardMaterial
              color={frameColor}
              metalness={0.55}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}

      {/* Nose bridge */}
      <mesh position={[0, 0.28, 0.02]} castShadow>
        <boxGeometry args={[0.5, 0.09, 0.12]} />
        <meshStandardMaterial
          color={frameColor}
          metalness={0.55}
          roughness={0.35}
        />
      </mesh>
    </group>
  )
}
