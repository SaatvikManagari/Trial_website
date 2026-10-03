import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import nipplejs from 'nipplejs'
import { useGame, input, controlsRef, isTouch } from './store'
import { placements } from './layout'
import { birthday } from './config/memories'

function MemoryCard() {
  const activeIndex = useGame((s) => s.activeIndex)
  const [shown, setShown] = useState(null)
  useEffect(() => { if (activeIndex !== null) setShown(activeIndex) }, [activeIndex])
  const m = shown !== null ? placements[shown] : null
  return (
    <div className={`memory ${activeIndex !== null ? 'is-visible' : ''}`} aria-live="polite">
      {m && (
        <figure>
          <img src={m.src} alt={m.caption} />
          <figcaption>{m.caption}</figcaption>
        </figure>
      )}
    </div>
  )
}

function StartScreen() {
  const started = useGame((s) => s.started)
  const start = useGame((s) => s.start)
  const { progress, active } = useProgress()
  const [grace, setGrace] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGrace(true), 800); return () => clearTimeout(t) }, [])
  const ready = progress >= 100 || (grace && !active)
  if (started) return null
  return (
    <div className="screen">
      <h1>Walk the hallway</h1>
      <p>{isTouch ? 'Left thumb moves. Drag on the right to look around.' : 'W A S D to walk, mouse to look, Shift to hurry, Esc to pause.'}</p>
      {ready ? (
        <button onClick={() => (isTouch ? start() : controlsRef.current?.lock())}>Start walking</button>
      ) : (
        <div className="bar" role="progressbar" aria-valuenow={Math.round(progress)}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

function Joystick() {
  const zone = useRef()
  useEffect(() => {
    const j = nipplejs.create({ zone: zone.current, mode: 'static', position: { left: '50%', top: '50%' }, color: '#ffd9a0', size: 110 })
    j.on('move', (_, d) => { input.moveX = d.vector.x; input.moveY = d.vector.y })
    j.on('end', () => { input.moveX = 0; input.moveY = 0 })
    return () => j.destroy()
  }, [])
  return <div ref={zone} className="joystick" />
}

function LookZone() {
  const last = useRef(null)
  return (
    <div
      className="look-zone"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); last.current = { x: e.clientX, y: e.clientY } }}
      onPointerMove={(e) => {
        if (!last.current) return
        input.lookX += (e.clientX - last.current.x) * 0.005
        input.lookY += (e.clientY - last.current.y) * 0.005
        last.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerUp={() => (last.current = null)}
      onPointerCancel={() => (last.current = null)}
    />
  )
}

function Finale() {
  const finale = useGame((s) => s.finale)
  const dismissed = useGame((s) => s.finaleDismissed)
  const dismiss = useGame((s) => s.dismissFinale)
  return (
    <div className={`finale ${finale && !dismissed ? 'is-visible' : ''}`}>
      <h2>Happy Birthday, {birthday.name}!</h2>
      <p>{birthday.message}</p>
      <button onClick={dismiss}>Keep celebrating</button>
    </div>
  )
}

export default function UIOverlay() {
  const started = useGame((s) => s.started)
  return (
    <>
      <MemoryCard />
      <Finale />
      {isTouch && started && (<><LookZone /><Joystick /></>)}
      <StartScreen />
    </>
  )
}
