import { memories } from './config/memories'

// Hallway runs along -Z. Player starts at z = 0 facing -Z.
export const HALL = { width: 8, height: 4.2, eye: 1.65, startPad: 7, spacing: 6, endPad: 16, backPad: 3 }

const rows = Math.ceil(memories.length / 2)
export const hallLength = HALL.startPad + Math.max(rows - 1, 0) * HALL.spacing + HALL.endPad
export const cakeZ = -(hallLength - 5)
export const hallCenterZ = -(hallLength - HALL.backPad) / 2
export const hallTotal = hallLength + HALL.backPad

// Alternate left / right walls, one pair per row.
export const placements = memories.map((m, i) => {
  const left = i % 2 === 0
  return {
    ...m,
    index: i,
    x: left ? -HALL.width / 2 + 0.06 : HALL.width / 2 - 0.06,
    z: -(HALL.startPad + Math.floor(i / 2) * HALL.spacing),
    rotY: left ? Math.PI / 2 : -Math.PI / 2,
  }
})
