import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from './store'
import { cakeZ } from './layout'

const COUNT = 320
const PALETTE = ['#ff5d8f', '#ffd166', '#06d6a0', '#4cc9f0', '#b185ff', '#ffffff']

function Confetti({ active }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const bits = useMemo(
    () => Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 7, y: 1 + Math.random() * 7, z: (Math.random() - 0.5) * 7,
      vy: 0.8 + Math.random() * 1.4, sp: 1 + Math.random() * 2, rx: Math.random() * 6, rz: Math.random() * 6, ph: Math.random() * 6,
    })), [])

  useEffect(() => {
    const c = new THREE.Color()
    bits.forEach((_, i) => ref.current.setColorAt(i, c.set(PALETTE[i % PALETTE.length])))
    ref.current.instanceColor.needsUpdate = true
  }, [bits])

  useFrame((state, dt) => {
    if (!active || !ref.current) return
    const t = state.clock.elapsedTime
    bits.forEach((p, i) => {
      p.y -= p.vy * Math.min(dt, 0.05)
      if (p.y < 0.05) p.y = 7 + Math.random()
      dummy.position.set(p.x + Math.sin(t * p.sp + p.ph) * 0.4, p.y, p.z)
      dummy.rotation.set(p.rx + t * p.sp, t * 0.5, p.rz + t * p.sp)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, COUNT]} visible={active} frustumCulled={false}>
      <planeGeometry args={[0.14, 0.22]} />
      <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  )
}

export default function CakeFinale() {
  const finale = useGame((s) => s.finale)
  const flames = useRef([])

  useFrame((s) => {
    flames.current.forEach((f, i) => {
      if (f) f.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 12 + i * 2) * 0.18)
    })
  })

  const tiers = [
    { r: 0.95, h: 0.5, y: 1.15, c: '#ff8fb1' },
    { r: 0.68, h: 0.45, y: 1.62, c: '#fff1dc' },
    { r: 0.42, h: 0.4, y: 2.05, c: '#ff5d8f' },
  ]

  return (
    <group position={[0, 0, cakeZ]}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[1.3, 1.45, 0.9, 40]} />
        <meshStandardMaterial color="#c8963e" metalness={0.6} roughness={0.4} />
      </mesh>
      {tiers.map((t, i) => (
        <mesh key={i} position={[0, t.y, 0]}>
          <cylinderGeometry args={[t.r, t.r, t.h, 48]} />
          <meshStandardMaterial color={t.c} roughness={0.6} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(a) * 0.22, 2.25, Math.sin(a) * 0.22]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
              <meshStandardMaterial color="#4cc9f0" />
            </mesh>
            <mesh ref={(el) => (flames.current[i] = el)} position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#ffb347" emissive="#ff9a1f" emissiveIntensity={3} />
            </mesh>
          </group>
        )
      })}
      <pointLight position={[0, 3, 0]} color="#ffb347" intensity={finale ? 60 : 25} distance={12} decay={2} />
      <Confetti active={finale} />
    </group>
  )
}
