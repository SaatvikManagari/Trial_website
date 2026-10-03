import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { useGame, input, controlsRef, isTouch } from './store'
import { HALL, hallLength, placements, cakeZ } from './layout'

const keys = {}
const SHOW_DIST = 3.4
const HIDE_DIST = 4.6
const CAKE_DIST = 5

export default function Player() {
  const { camera } = useThree()
  const yaw = useRef(0)
  const pitch = useRef(0)
  const dir = useRef(new THREE.Vector3())
  const side = useRef(new THREE.Vector3())
  const light = useRef()

  useEffect(() => {
    camera.position.set(0, HALL.eye, 0)
    camera.rotation.order = 'YXZ'
    const down = (e) => (keys[e.code] = true)
    const up = (e) => (keys[e.code] = false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [camera])

  useFrame((state, dt) => {
    const g = useGame.getState()
    if (!g.started) return
    dt = Math.min(dt, 0.05)

    // Touch-drag look (desktop look is handled by PointerLockControls)
    if (isTouch) {
      yaw.current -= input.lookX
      pitch.current = THREE.MathUtils.clamp(pitch.current - input.lookY, -1.2, 1.2)
      input.lookX = input.lookY = 0
      camera.rotation.set(pitch.current, yaw.current, 0)
    }

    // Movement: keyboard + joystick
    let fwd = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) + input.moveY
    let str = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0) + input.moveX
    const len = Math.hypot(fwd, str)
    if (len > 1) { fwd /= len; str /= len }

    camera.getWorldDirection(dir.current)
    dir.current.y = 0
    dir.current.normalize()
    side.current.crossVectors(dir.current, camera.up)

    const speed = keys.ShiftLeft ? 6 : 3.6
    camera.position.addScaledVector(dir.current, fwd * speed * dt)
    camera.position.addScaledVector(side.current, str * speed * dt)

    const m = HALL.width / 2 - 0.7
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -m, m)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -hallLength + 1, HALL.backPad - 1)
    camera.position.y = HALL.eye + Math.sin(state.clock.elapsedTime * 8) * 0.025 * Math.min(len, 1)

    light.current?.position.set(camera.position.x, HALL.height - 0.8, camera.position.z - 1)

    // Proximity: nearest photo
    const px = camera.position.x
    const pz = camera.position.z
    let nearest = null
    let nearestD = Infinity
    for (const p of placements) {
      const d = Math.hypot(px - p.x * 0.4, pz - p.z) // photos sit on the walls; bias toward the hallway centre
      if (d < nearestD) { nearestD = d; nearest = p }
    }
    if (nearest && nearestD < SHOW_DIST) {
      if (g.activeIndex !== nearest.index) g.setActive(nearest.index)
    } else if (g.activeIndex !== null) {
      const cur = placements[g.activeIndex]
      if (!cur || Math.hypot(px - cur.x * 0.4, pz - cur.z) > HIDE_DIST) g.setActive(null)
    }

    // Finale
    if (!g.finale && Math.hypot(px, pz - cakeZ) < CAKE_DIST) g.triggerFinale()
  })

  return (
    <>
      {!isTouch && (
        <PointerLockControls
          ref={controlsRef}
          onLock={() => useGame.getState().start()}
          onUnlock={() => {
            Object.keys(keys).forEach((k) => (keys[k] = false))
            useGame.getState().pause()
          }}
        />
      )}
      <pointLight ref={light} color="#ffd9a0" intensity={45} distance={16} decay={2} />
    </>
  )
}
