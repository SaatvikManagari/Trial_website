import { Component } from 'react'
import { useTexture } from '@react-three/drei'
import { placements } from './layout'

const MAX_W = 3
const MAX_H = 2.3

function fit(img) {
  const aspect = img.width / img.height
  let h = MAX_H
  let w = h * aspect
  if (w > MAX_W) { w = MAX_W; h = w / aspect }
  return [w, h]
}

const Frame = ({ w, h, children }) => (
  <>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[w + 0.3, h + 0.3, 0.1]} />
      <meshStandardMaterial color="#c8963e" metalness={0.7} roughness={0.35} />
    </mesh>
    {children}
  </>
)

function Picture({ src }) {
  const tex = useTexture(src) // suspends until loaded
  const [w, h] = fit(tex.image)
  return (
    <Frame w={w} h={h}>
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </Frame>
  )
}

// A broken URL shows a blank frame instead of crashing the whole scene.
class SafeFrame extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <Frame w={2} h={1.5}>
        <mesh position={[0, 0, 0.056]}>
          <planeGeometry args={[2, 1.5]} />
          <meshBasicMaterial color="#1d1122" />
        </mesh>
      </Frame>
    )
  }
}

export default function GalleryWall() {
  return (
    <group>
      {placements.map((p) => (
        <group key={p.index} position={[p.x, 2.1, p.z]} rotation={[0, p.rotY, 0]}>
          <SafeFrame>
            <Picture src={p.src} />
          </SafeFrame>
        </group>
      ))}
    </group>
  )
}
