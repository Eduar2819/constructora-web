import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { fadeUp } from '@/shared/lib/motion'
import type { TrustMetric } from './trustMetrics.data'

export function AnimatedMetric({ value, suffix, label }: TrustMetric) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const prefersReducedMotion = useReducedMotion()
  const count = useMotionValue(prefersReducedMotion ? value : 0)
  const display = useTransform(count, (latest) => Math.round(latest).toLocaleString('es-MX'))

  useEffect(() => {
    if (!isInView) return
    if (prefersReducedMotion) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [count, isInView, prefersReducedMotion, value])

  return (
    <motion.div
      variants={fadeUp}
      ref={ref}
      className="relative flex flex-col-reverse justify-end border-t border-line pt-6 before:absolute before:-top-px before:left-0 before:h-px before:w-12 before:bg-brand-500 before:content-['']"
    >
      <dt className="mt-3 max-w-[24ch] text-sm leading-snug text-steel-400">{label}</dt>
      <dd className="font-display font-semibold tracking-tight whitespace-nowrap text-paper-100 tabular-nums text-4xl sm:text-6xl">
        <motion.span>{display}</motion.span>
        <span className="text-xl text-signal-500 sm:text-3xl">{suffix}</span>
      </dd>
    </motion.div>
  )
}
