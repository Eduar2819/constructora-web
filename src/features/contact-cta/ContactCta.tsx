import { EnvelopeSimple, Phone } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { Container } from '@/shared/ui/Container'
import { fadeUp, viewportOnce } from '@/shared/lib/motion'
import { QuoteForm } from './QuoteForm'
import { QUOTE_EMAIL } from './quoteRequest'

export function ContactCta() {
  return (
    <section id="contacto" className="surface-light fade-bottom pb-48 pt-13.75">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="surface-dark relative grid gap-12 overflow-hidden rounded-3xl border border-white/10 bg-ink-800 px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-12 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:px-14 lg:py-16"
        >
          <div
            aria-hidden
            className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(74,118,160,0.28),_transparent_55%)]"
          />

          <div className="relative flex flex-col lg:col-span-5">
            <h2 className="balance font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper-100 sm:text-5xl lg:text-4xl">
              ¿Listo para construir tu proyecto?
            </h2>
            <p className="mt-5 max-w-[40ch] text-[17px] leading-relaxed text-steel-300">
              Cuéntanos qué necesitas y te compartimos un diagnóstico inicial sin costo en menos
              de 48 horas.
            </p>

            <div className="mt-10 flex flex-col gap-3 text-sm text-steel-300 lg:mt-auto lg:pt-10">
              <p className="text-paper-100">¿Prefieres hablar directo?</p>
              <a
                href="tel:+528112345678"
                className="flex w-fit items-center gap-2 transition-colors hover:text-paper-100"
              >
                <Phone size={16} weight="light" />
                +52 81 1234 5678
              </a>
              <a
                href={`mailto:${QUOTE_EMAIL}`}
                className="flex w-fit items-center gap-2 transition-colors hover:text-paper-100"
              >
                <EnvelopeSimple size={16} weight="light" />
                {QUOTE_EMAIL}
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <QuoteForm />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
