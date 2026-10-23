import { ArrowRight } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { Container } from '@/shared/ui/Container'
import { staggerChildren, fadeUp, viewportOnce, EASE_FLUID } from '@/shared/lib/motion'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { services, type Service } from './services.data'

const PANEL_SPRING = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const
const IMAGE_SIZES = '(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw'
const CARD_SHADOW = 'shadow-[0_18px_40px_-24px_rgba(12,26,43,0.45)]'

function IconChip({ service, size = 'md' }: { service: Service; size?: 'sm' | 'md' }) {
  const Icon = service.icon
  const box = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12'
  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-xl bg-brand-500 text-ink-900 shadow-[inset_0_-2px_0_rgba(12,26,43,0.12)]`}
    >
      <Icon size={size === 'sm' ? 20 : 24} weight="bold" aria-hidden />
    </span>
  )
}

function QuoteLink({ service }: { service: Service }) {
  return (
    <a
      href="#contacto"
      className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-paper-100 underline decoration-brand-500 decoration-2 underline-offset-[6px] transition-colors hover:text-signal-500"
      aria-label={`Cotizar ${service.title.toLowerCase()}`}
    >
      Cotizar este servicio
      <ArrowRight
        size={16}
        weight="bold"
        aria-hidden
        className="transition-transform duration-300 group-hover/link:translate-x-1"
      />
    </a>
  )
}

/* Desktop: expanding panels. The active one grows on a spring and reveals a paper card. */
function ServicePanel({
  service,
  isActive,
  onActivate,
}: {
  service: Service
  isActive: boolean
  onActivate: () => void
}) {
  const reduced = useReducedMotion()
  // Width is driven by its own spring so the panel still inherits the staggered fadeUp reveal
  const grow = useSpring(isActive ? 2.8 : 1, PANEL_SPRING)
  useEffect(() => {
    if (reduced) grow.jump(isActive ? 2.8 : 1)
    else grow.set(isActive ? 2.8 : 1)
  }, [grow, isActive, reduced])

  return (
    <motion.article
      variants={fadeUp}
      tabIndex={0}
      aria-label={service.title}
      aria-current={isActive ? 'true' : undefined}
      onPointerEnter={onActivate}
      onFocus={onActivate}
      style={{ flexGrow: grow }}
      className={`group relative isolate flex basis-0 cursor-pointer flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 ${CARD_SHADOW}`}
    >
      <motion.img
        src={service.image.src}
        srcSet={service.image.srcSet}
        sizes={IMAGE_SIZES}
        alt={service.imageAlt}
        loading="lazy"
        initial={false}
        animate={{ scale: isActive ? 1 : 1.08, filter: isActive ? 'brightness(1)' : 'brightness(0.88)' }}
        transition={reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_FLUID }}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Light navy fade only where the collapsed title sits; the active card carries its own surface */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: isActive ? 0.35 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/85 via-ink-900/20 via-45% to-transparent"
      />

      <AnimatePresence mode="wait" initial={false}>
        {isActive ? (
          <motion.div
            key="card"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.12, ease: EASE_FLUID } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.18 } }}
            className="m-4 w-[min(26rem,calc(100%-2rem))] rounded-2xl bg-white/92 p-6 shadow-[0_20px_40px_-20px_rgba(12,26,43,0.5)] backdrop-blur-md"
          >
            <IconChip service={service} />
            <h3 className="balance mt-4 font-display text-2xl font-semibold leading-tight text-paper-100">
              {service.title}
            </h3>
            <p className="mt-2 leading-relaxed text-steel-300">{service.description}</p>
            <QuoteLink service={service} />
          </motion.div>
        ) : (
          <motion.div
            key="label"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="surface-dark bg-transparent p-5"
          >
            <IconChip service={service} size="sm" />
            <h3 className="balance mt-3 font-display text-lg font-semibold leading-snug text-paper-100">
              {service.title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

/* Mobile and tablet: photo on top, paper body below, everything visible. */
function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.article variants={fadeUp} className={`overflow-hidden rounded-3xl bg-white ${CARD_SHADOW}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.image.src}
          srcSet={service.image.srcSet}
          sizes={IMAGE_SIZES}
          alt={service.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative px-6 pb-6">
        <div className="-mt-6">
          <IconChip service={service} />
        </div>
        <h3 className="balance mt-4 font-display text-xl font-semibold leading-tight text-paper-100 sm:text-2xl">
          {service.title}
        </h3>
        <p className="mt-2 leading-relaxed text-steel-300">{service.description}</p>
        <QuoteLink service={service} />
      </div>
    </motion.article>
  )
}

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <section id="servicios" className="py-13.75">
      <Container>
        <motion.div
          variants={staggerChildren(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.h2
            variants={fadeUp}
            className="balance max-w-[22ch] font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper-100 sm:text-5xl"
          >
            Un equipo para cada etapa de la obra.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-[48ch] leading-relaxed text-steel-300">
            Especialistas por tipo de proyecto, con el mismo estándar de calidad en cada obra.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerChildren(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={isDesktop ? 'mt-12 flex h-[560px] gap-3' : 'mt-10 grid gap-5 md:grid-cols-2'}
        >
          {services.map((service, index) =>
            isDesktop ? (
              <ServicePanel
                key={service.title}
                service={service}
                isActive={activeIndex === index}
                onActivate={() => setActiveIndex(index)}
              />
            ) : (
              <ServiceCard key={service.title} service={service} />
            ),
          )}
        </motion.div>
      </Container>
    </section>
  )
}
