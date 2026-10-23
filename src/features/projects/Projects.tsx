import { ArrowLeft, ArrowRight, MapPin } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { Container } from '@/shared/ui/Container'
import { fadeUp, viewportOnce } from '@/shared/lib/motion'
import { projects } from './projects.data'

// Aligns the first card with the Container's content edge (max-w-7xl + px-6 / md:px-10).
const TRACK_INSET =
  'px-6 scroll-px-6 md:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] md:scroll-px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]'

const ARROW_BUTTON =
  'flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/60 text-paper-100 transition-colors duration-200 hover:border-steel-400 hover:bg-white active:scale-95'

export function Projects() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('article')
    const step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8
    track.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <section id="proyectos" className="py-13.75">
      <Container className="flex items-end justify-between gap-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="balance max-w-[24ch] font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper-100 sm:text-5xl"
        >
          Proyectos entregados, no solo prometidos.
        </motion.h2>

        <div className="hidden shrink-0 gap-3 md:flex">
          <button type="button" aria-label="Proyecto anterior" onClick={() => scrollByCard(-1)} className={ARROW_BUTTON}>
            <ArrowLeft size={18} weight="bold" />
          </button>
          <button type="button" aria-label="Siguiente proyecto" onClick={() => scrollByCard(1)} className={ARROW_BUTTON}>
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </Container>

      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Proyectos entregados, desplázate con las flechas del teclado"
        className={`mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 focus-visible:outline-offset-[-4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${TRACK_INSET}`}
      >
        {projects.map((project) => (
          <motion.article
            key={project.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="surface-dark group relative shrink-0 basis-[80vw] snap-start overflow-hidden rounded-3xl shadow-[0_18px_40px_-24px_rgba(12,26,43,0.45)] sm:basis-[26rem]"
          >
            <div className="relative aspect-[4/5]">
              <img
                src={project.image.src}
                srcSet={project.image.srcSet}
                sizes="(min-width: 640px) 26rem, 80vw"
                alt={`${project.name}, ${project.category} en ${project.location}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-sm font-medium text-signal-400">{project.category}</p>
              <h3 className="mt-1.5 font-display text-2xl font-semibold text-paper-100">
                {project.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-steel-300">
                <MapPin size={14} weight="light" />
                {project.location}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
