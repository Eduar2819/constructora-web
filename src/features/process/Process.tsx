import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef } from 'react'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { staggerChildren, fadeUp, viewportOnce } from '@/shared/lib/motion'
import { unsplash } from '@/shared/lib/stock'
import { processSteps, type ProcessStep } from './process.data'

const PROCESS_PHOTO = unsplash('1503387837-b154d5074bd2', 900)

// Theme-aware node colors, resolved from the current scope tokens
const NODE_IDLE = 'var(--color-surface)'
const NODE_REACHED = 'var(--color-signal-500)'

export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 70%', 'end 55%'],
  })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="proceso" className="py-13.75">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <motion.div
          variants={staggerChildren(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-5"
        >
          <div className="lg:sticky lg:top-32">
            <motion.h2
              variants={fadeUp}
              className="balance max-w-[18ch] font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper-100 sm:text-5xl"
            >
              Cómo pasamos de la idea a la entrega.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 max-w-[40ch] leading-relaxed text-steel-300">
              Cuatro etapas claras para que siempre sepas en qué punto va tu obra.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="relative mt-8 hidden overflow-hidden rounded-3xl lg:block"
            >
              <img
                src={PROCESS_PHOTO.src}
                srcSet={PROCESS_PHOTO.srcSet}
                sizes="(min-width: 1024px) 34vw, 90vw"
                alt="Arquitecto trazando sobre un plano con escuadra y lápiz"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 to-transparent" />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <Button href="#contacto">Cotiza tu proyecto</Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.ol
          ref={listRef}
          variants={staggerChildren(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative space-y-4 pl-10 lg:col-span-6 lg:col-start-7"
        >
          <span aria-hidden className="absolute inset-y-10 left-[7px] w-px bg-line" />
          <motion.span
            aria-hidden
            style={{ scaleY: prefersReducedMotion ? 1 : lineProgress }}
            className="absolute inset-y-10 left-[6.5px] w-[2px] origin-top bg-signal-500"
          />

          {processSteps.map((step, index) => (
            <StepCard
              key={step.title}
              step={step}
              reachedAt={index / (processSteps.length - 1)}
              progress={lineProgress}
              reduced={Boolean(prefersReducedMotion)}
            />
          ))}
        </motion.ol>
      </Container>
    </section>
  )
}

function StepCard({
  step,
  reachedAt,
  progress,
  reduced,
}: {
  step: ProcessStep
  reachedAt: number
  progress: MotionValue<number>
  reduced: boolean
}) {
  const Icon = step.icon
  // The node fills with the accent once the progress line reaches this step
  const nodeFill = useTransform(progress, [reachedAt - 0.04, reachedAt], [NODE_IDLE, NODE_REACHED])

  return (
    <motion.li variants={fadeUp} className="relative">
      <motion.span
        aria-hidden
        style={{ backgroundColor: reduced ? NODE_REACHED : nodeFill }}
        className="absolute -left-10 top-9 h-[15px] w-[15px] rounded-full border-2 border-signal-500"
      />
      <div className="flex gap-5 rounded-3xl bg-white/80 p-6 shadow-[0_16px_36px_-20px_rgba(12,26,43,0.4)] sm:p-7">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-ink-900 shadow-[inset_0_-2px_0_rgba(12,26,43,0.12)]">
          <Icon size={24} weight="bold" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-paper-100 sm:text-2xl">{step.title}</h3>
          <p className="mt-1.5 max-w-[44ch] leading-relaxed text-steel-300">{step.description}</p>
        </div>
      </div>
    </motion.li>
  )
}
