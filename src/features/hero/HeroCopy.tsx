import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/shared/ui/Button'
import { EASE_FLUID } from '@/shared/lib/motion'

const HEADLINE_LINES = [
  ['Del', 'plano', 'a', 'la', 'entrega,'],
  ['sin', 'sorpresas.'],
]

const WORD_DELAY = 0.06
const HEADLINE_START = 0.2
const COPY_DELAY = HEADLINE_START + 7 * WORD_DELAY + 0.25

export function HeroCopy() {
  const prefersReducedMotion = useReducedMotion()
  let wordIndex = 0

  const enter = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE_FLUID },
        }

  return (
    <>
      {/* Words flip up in 3D from their baseline, one after another */}
      <h1 className="balance font-display text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-paper-100 [perspective:900px] sm:text-5xl lg:text-[2.6rem] xl:text-[3.4rem]">
        {HEADLINE_LINES.map((line) => (
          <span key={line.join(' ')} className="lg:block">
            {line.map((word) => {
              const delay = HEADLINE_START + wordIndex++ * WORD_DELAY
              return (
                <motion.span
                  key={word}
                  className="mr-[0.24em] inline-block origin-bottom"
                  initial={prefersReducedMotion ? false : { opacity: 0, rotateX: -85, y: '0.35em' }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{ duration: 0.9, delay, ease: EASE_FLUID }}
                >
                  {word}
                </motion.span>
              )
            })}
          </span>
        ))}
      </h1>

      <motion.p
        {...enter(COPY_DELAY)}
        className="mt-6 max-w-[40ch] text-[17px] leading-relaxed text-steel-300"
      >
        SosaCraft diseña, gestiona y construye proyectos residenciales, comerciales e industriales
        en todo el norte del país.
      </motion.p>

      <motion.div {...enter(COPY_DELAY + 0.12)} className="mt-9 flex flex-wrap items-center gap-4">
        <Button href="#contacto">Cotiza tu proyecto</Button>
        <Button href="#proyectos" variant="light" icon={false}>
          Ver proyectos
        </Button>
      </motion.div>
    </>
  )
}
