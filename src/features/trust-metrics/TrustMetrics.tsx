import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Container } from '@/shared/ui/Container'
import { staggerChildren, fadeUp, viewportOnce } from '@/shared/lib/motion'
import { unsplash } from '@/shared/lib/stock'
import { trustMetrics } from './trustMetrics.data'
import { AnimatedMetric } from './AnimatedMetric'

const MAIN_PHOTO = unsplash('1644221150167-fb4fafa7f411', 1000)
const DETAIL_PHOTO = unsplash('1504307651254-35680f356dfd', 600)

export function TrustMetrics() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  // Detail photo drifts against the main one to separate the two planes.
  const detailY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [48, -48])

  return (
    <section ref={sectionRef} className="pt-13.75 pb-13.75 lg:pb-23.75">
      <Container className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative mr-10 sm:mr-20 lg:col-span-5 lg:mr-12"
        >
          <img
            src={MAIN_PHOTO.src}
            srcSet={MAIN_PHOTO.srcSet}
            sizes="(min-width: 1024px) 34vw, 90vw"
            alt="Edificio de concreto en obra negra con grúa torre y maquinaria en el patio de maniobras"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-3xl object-cover"
          />
          <motion.img
            src={DETAIL_PHOTO.src}
            srcSet={DETAIL_PHOTO.srcSet}
            sizes="(min-width: 1024px) 16vw, 45vw"
            alt="Dos trabajadores con casco armando acero de refuerzo sobre una losa"
            loading="lazy"
            style={{ y: detailY }}
            className="absolute -bottom-10 -right-10 aspect-square w-[46%] rounded-3xl object-cover shadow-[0_24px_48px_-16px_rgba(12,26,43,0.5)] sm:-right-20 lg:-right-12"
          />
        </motion.div>

        <div className="lg:col-span-6 lg:col-start-7">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="balance max-w-[18ch] font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper-100 sm:text-5xl"
          >
            Obra que se mide en entregas.
          </motion.h2>

          <motion.dl
            variants={staggerChildren(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12"
          >
            {trustMetrics.map((metric) => (
              <AnimatedMetric key={metric.label} {...metric} />
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  )
}
