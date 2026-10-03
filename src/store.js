import { create } from 'zustand'

export const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

// Non-reactive input, read every frame by Player
export const input = { moveX: 0, moveY: 0, lookX: 0, lookY: 0 }
export const controlsRef = { current: null }

export const useGame = create((set) => ({
  started: false,
  activeIndex: null,
  finale: false,
  finaleDismissed: false,
  start: () => set({ started: true }),
  pause: () => set({ started: false }),
  setActive: (i) => set({ activeIndex: i }),
  triggerFinale: () => set({ finale: true }),
  dismissFinale: () => set({ finaleDismissed: true }),
}))
