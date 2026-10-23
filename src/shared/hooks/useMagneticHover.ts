import { useRef } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import type { PointerEvent } from 'react'

const SPRING = { stiffness: 200, damping: 18, mass: 0.4 }
const STRENGTH = 0.35

export function useMagneticHover() {
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || !ref.current) return
    const bounds = ref.current.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * STRENGTH)
    y.set((event.clientY - bounds.top - bounds.height / 2) * STRENGTH)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { ref, x: springX, y: springY, onPointerMove, onPointerLeave }
}
