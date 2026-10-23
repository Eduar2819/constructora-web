import { motion, useReducedMotion } from 'motion/react'
import { EASE_FLUID } from '@/shared/lib/motion'

// The SosaCraft roof mark builds itself as confirmation: roof, chimney, walls, then a check inside.
// Geometry follows public/favicon.svg so the success state reads as the brand, not a generic tick.
const STEPS = {
  roof: { delay: 0.1, duration: 0.6 },
  chimney: { delay: 0.55, duration: 0.35 },
  walls: { delay: 0.7, duration: 0.55 },
  check: { delay: 1.15, duration: 0.4 },
  pulse: { delay: 1.45, duration: 0.9 },
}

export const SUCCESS_MARK_DURATION = STEPS.check.delay + STEPS.check.duration

export function SuccessMark() {
  const prefersReducedMotion = useReducedMotion()

  const draw = (step: keyof typeof STEPS) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { ...STEPS[step], ease: EASE_FLUID },
            opacity: { delay: STEPS[step].delay, duration: 0.01 },
          },
        }

  return (
    <div className="relative h-24 w-24">
      {!prefersReducedMotion && (
        /* Leading 0 keyframe keeps the ring hidden during its delay */
        <motion.span
          aria-hidden
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.7, 0.7, 1.6], opacity: [0, 0.8, 0] }}
          transition={{ ...STEPS.pulse, times: [0, 0.05, 1], ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-signal-500"
        />
      )}

      <svg viewBox="0 0 96 96" className="relative h-full w-full" aria-hidden>
        <motion.rect
          x="64"
          y="20"
          width="7"
          height="14"
          className="fill-signal-500"
          style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { scaleY: 0 },
                animate: { scaleY: 1 },
                transition: { ...STEPS.chimney, type: 'spring', stiffness: 260, damping: 16 },
              })}
        />
        <motion.path
          d="M14 44 L48 18 L82 44"
          fill="none"
          strokeWidth="5"
          strokeLinejoin="miter"
          className="stroke-signal-500"
          {...draw('roof')}
        />
        <motion.path
          d="M22 44 V78 H74 V44"
          fill="none"
          strokeWidth="3"
          strokeLinejoin="round"
          className="stroke-steel-300"
          {...draw('walls')}
        />
        <motion.path
          d="M36 60 L45 69 L62 51"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-signal-500"
          {...draw('check')}
        />
      </svg>
    </div>
  )
}
