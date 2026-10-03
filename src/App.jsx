import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Hallway from './Hallway'
import GalleryWall from './GalleryWall'
import CakeFinale from './CakeFinale'
import Player from './Player'
import UIOverlay from './UIOverlay'
import { HALL } from './layout'

export default function App() {
  return (
    <>
      <Canvas dpr={[1, 2]} camera={{ fov: 70, near: 0.1, far: 120, position: [0, HALL.eye, 0] }}>
        <color attach="background" args={['#120a16']} />
        <fog attach="fog" args={['#120a16', 10, 40]} />
        <ambientLight intensity={0.7} />
        <hemisphereLight args={['#ffe7bf', '#2a1830', 0.5]} />
        {/* Loading UI is the HTML start screen (useProgress); the canvas itself suspends silently. */}
        <Suspense fallback={null}>
          <Hallway />
          <GalleryWall />
          <CakeFinale />
        </Suspense>
        <Player />
      </Canvas>
      <UIOverlay />
    </>
  )
}
