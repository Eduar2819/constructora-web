import { Quotes } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { Container } from '@/shared/ui/Container'
import { fadeUp, staggerChildren, viewportOnce } from '@/shared/lib/motion'
import { testimonials, type Testimonial } from './testimonials.data'

function Attribution({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figcaption className="mt-6">
      <p className="text-sm font-medium text-paper-100">{testimonial.name}</p>
      <p className="mt-0.5 text-sm text-steel-400">{testimonial.role}</p>
    </figcaption>
  )
}

export function Testimonials() {
  const [featured, ...rest] = testimonials

  return (
    <section className="py-13.75">
      <Container>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="balance max-w-[20ch] font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper-100 sm:text-5xl"
        >
          Lo dicen quienes ya construyeron con nosotros.
        </motion.h2>

        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 lg:grid-cols-12"
        >
          <motion.figure
            variants={fadeUp}
            className="surface-dark relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-ink-800 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-12 lg:col-span-7 lg:row-span-2"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(74,118,160,0.3),_transparent_55%)]"
            />
            <div className="relative">
              <Quotes size={32} weight="fill" className="text-signal-500" />
              <blockquote className="balance mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-paper-100 sm:text-3xl">
                “{featured.quote}”
              </blockquote>
            </div>
            <div className="relative">
              <Attribution testimonial={featured} />
            </div>
          </motion.figure>

          {rest.map((testimonial) => (
            <motion.figure
              key={testimonial.name}
              variants={fadeUp}
              className="flex flex-col justify-between border-t border-line pt-6 lg:col-span-5 lg:px-4"
            >
              <blockquote className="text-lg leading-relaxed text-paper-100">
                “{testimonial.quote}”
              </blockquote>
              <Attribution testimonial={testimonial} />
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
