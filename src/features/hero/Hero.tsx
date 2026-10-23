import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
// From src/assets/images/{plano,obra,entrega}.jpg: upscaled 4x with Real-ESRGAN (realesrgan-x4plus),
// baked-in captions cropped off, exported as WebP
import planImage from '@/assets/images/hero/plano.webp'
import site1600 from '@/assets/images/hero/obra-1600.webp'
import site2800 from '@/assets/images/hero/obra-2800.webp'
import delivery1600 from '@/assets/images/hero/entrega-1600.webp'
import delivery2800 from '@/assets/images/hero/entrega-2800.webp'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { EASE_FLUID } from '@/shared/lib/motion'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { HeroCopy } from './HeroCopy'

// Photos are ~2.15:1 and cover a full-height stage, so their rendered width follows the viewport height
const FULL_BLEED_SIZES = 'max(100vw, 220vh)'
const SITE_SRCSET = `${site1600} 1600w, ${site2800} 2800w`
const DELIVERY_SRCSET = `${delivery1600} 1600w, ${delivery2800} 2800w`

const PLAN_ALT =
  'Planos arquitectónicos sobre una mesa de dibujo con casco, escuadra, escalímetro y lápices'
const SITE_ALT =
  'Casa en obra negra con muros de block y castillos de varilla, un trabajador con carretilla y otro sobre la losa'
const DELIVERY_ALT =
  'Casa terminada de dos niveles con fachada clara, terraza techada y jardín con andadores de concreto'

// Scroll timeline (0 → 1 across the pinned section)
//   Intro    0.00-0.02  copy on the left, the three stages stacked as a 3D deck on the right
//   Plano    0.02-0.16  plan card unfolds to full-bleed and loses its blueprint tint
//   → Obra   0.34-0.46  camera dives into the plan while the site photo dollies in
//   → Entrega 0.66-0.80 finished house rises over the site behind a signal-yellow scanline
const CARD_CLIP = 'inset(14% 9% 16% 52% round 28px)'
const FULL_CLIP = 'inset(0% 0% 0% 0% round 0px)'
const CARD_TILT_Y = -16
const CARD_TILT_X = 5
const EXPAND = [0.02, 0.16]
const DIVE = [0.34, 0.46]
const RISE = [0.66, 0.8]
// Timeline label colors on the paper hero (AA on #eef2f5: 5.0:1 and 4.8:1)
// The perspective floor needs stronger strokes than the flat grid to read as 3D
const FLOOR_GRID = {
  '--grid-major': 'rgb(12 26 43 / 0.2)',
  '--grid-minor': 'rgb(12 26 43 / 0.08)',
} as CSSProperties

const MUTED = '#56697d'
const SIGNAL = '#9a5c06'

type Stage = {
  label: string
  title: string
  text: string
  /** progress where the timeline marks this stage as reached */
  reachedAt: number
  /** progress the timeline button scrolls to */
  focusAt: number
  /** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]; the last stage never fades out */
  window: [number, number, number, number]
}

const STAGES: Stage[] = [
  {
    label: 'Plano',
    title: 'Todo empieza en el plano.',
    text: 'Analizamos y conceptualizamos cada detalle de tu proyecto antes de mover tierra.',
    reachedAt: 0.12,
    focusAt: 0.27,
    window: [0.16, 0.22, 0.32, 0.38],
  },
  {
    label: 'Obra',
    title: 'Obra supervisada, todos los días.',
    text: 'Damos seguimiento en sitio para que todo avance según lo planeado.',
    reachedAt: 0.42,
    focusAt: 0.57,
    window: [0.46, 0.52, 0.62, 0.68],
  },
  {
    label: 'Entrega',
    title: 'Cada obra se entrega como se planeó.',
    text: 'Tu proyecto, impecable y listo para disfrutarse.',
    reachedAt: 0.78,
    focusAt: 0.96,
    window: [0.8, 0.87, 2, 2],
  },
]

export function Hero() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const prefersReducedMotion = useReducedMotion()
  return isDesktop && !prefersReducedMotion ? <HeroPinned /> : <HeroStatic />
}

function HeroPinned() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32, mass: 0.35 })

  // Pointer-driven tilt, only while the stages are still a deck
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const tiltX = useSpring(pointerY, { stiffness: 120, damping: 18 })
  const tiltY = useSpring(pointerX, { stiffness: 120, damping: 18 })

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 10)
    pointerY.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 8)
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const scrollToStage = (at: number) => {
    const section = sectionRef.current
    if (!section) return
    const top = section.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + at * (section.offsetHeight - window.innerHeight), behavior: 'smooth' })
  }

  // Deck geometry shared by the plan card and the two cards stacked behind it
  const expand = useTransform(progress, EXPAND, [0, 1], { clamp: true })
  const rotateY = useTransform([expand, tiltY], ([e, t]: number[]) => (1 - e) * (CARD_TILT_Y + t))
  const rotateX = useTransform([expand, tiltX], ([e, t]: number[]) => (1 - e) * (CARD_TILT_X + t))
  const deckOpacity = useTransform(progress, [0.01, 0.08], [1, 0])
  const deckSpread = useTransform(progress, [0, 0.08], [1, 0])

  // Plano
  const planClip = useTransform(progress, EXPAND, [CARD_CLIP, FULL_CLIP])
  const planX = useTransform(expand, [0, 1], ['10%', '0%'])
  const planScale = useTransform(progress, [0, EXPAND[1], DIVE[0], DIVE[1]], [1.08, 1, 1.05, 1.7])
  const planOpacity = useTransform(progress, [DIVE[0] + 0.02, DIVE[1]], [1, 0])
  const planTint = useTransform(progress, [0.06, 0.18], [1, 0])

  // Obra
  const siteOpacity = useTransform(progress, [DIVE[0] - 0.02, DIVE[0]], [0, 1])
  const siteScale = useTransform(progress, [DIVE[0], DIVE[1], RISE[1]], [1.3, 1.05, 1])

  // Entrega
  const deliveryClip = useTransform(progress, RISE, ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const deliveryScale = useTransform(progress, [RISE[0], 1], [1.15, 1])
  const scanY = useTransform(progress, RISE, ['100%', '0%'])
  const scanOpacity = useTransform(progress, [RISE[0], RISE[0] + 0.02, RISE[1] - 0.03, RISE[1]], [0, 1, 1, 0])

  const floorOpacity = useTransform(progress, [0, 0.14], [1, 0])
  const floorY = useTransform(progress, [0, 0.3], [0, 200])

  const copyOpacity = useTransform(progress, [0, 0.07], [1, 0])
  const copyY = useTransform(progress, [0, 0.1], [0, -70])
  const copyPointerEvents = useTransform(progress, (v) => (v > 0.05 ? 'none' : 'auto'))

  const scrimOpacity = useTransform(progress, [0.08, 0.18], [0, 1])

  return (
    <section id="top" ref={sectionRef} className="relative h-[400vh] bg-surface">
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* Blueprint floor receding in perspective */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE_FLUID }}
          className="pointer-events-none absolute inset-0 [perspective:1100px]"
        >
          <motion.div
            style={{ opacity: floorOpacity, y: floorY, rotateX: 64, ...FLOOR_GRID }}
            className="blueprint-grid absolute -inset-x-1/2 -bottom-[30%] h-[150%] origin-bottom [mask-image:radial-gradient(ellipse_at_50%_100%,black_30%,transparent_78%)]"
          />
        </motion.div>

        {/* Obra + Entrega: full-bleed stage revealed once the camera dives through the plan */}
        <motion.div style={{ opacity: siteOpacity }} className="absolute inset-0 overflow-hidden">
          <motion.img
            src={site1600}
            srcSet={SITE_SRCSET}
            sizes={FULL_BLEED_SIZES}
            alt={SITE_ALT}
            style={{ scale: siteScale }}
            className="h-full w-full object-cover object-[48%_center]"
            decoding="async"
          />
          <motion.img
            src={delivery1600}
            srcSet={DELIVERY_SRCSET}
            sizes={FULL_BLEED_SIZES}
            alt={DELIVERY_ALT}
            style={{ clipPath: deliveryClip, scale: deliveryScale }}
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            decoding="async"
          />
          <motion.div
            aria-hidden
            style={{ y: scanY, opacity: scanOpacity }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="h-[2px] w-full bg-signal-500 shadow-[0_0_24px_4px_rgba(227,155,18,0.35)]" />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 [perspective:1600px]">
          {/* Deck: Entrega and Obra cards peek out behind the plan card */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, delay: 0.25, ease: EASE_FLUID }}
            className="absolute inset-0"
          >
            <motion.div
              style={{ opacity: deckOpacity, rotateX, rotateY }}
              className="absolute inset-0 origin-[75%_50%]"
            >
              <DeckCard src={delivery1600} depth={2} spread={deckSpread} />
              <DeckCard src={site1600} depth={1} spread={deckSpread} />
            </motion.div>
          </motion.div>

          {/* Plano: front card that unfolds into the first full-bleed stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.3, delay: 0.1, ease: EASE_FLUID }}
            className="absolute inset-0 origin-[75%_50%]"
          >
            <motion.div
              style={{ clipPath: planClip, rotateX, rotateY, opacity: planOpacity }}
              className="absolute inset-0 origin-[75%_50%] overflow-hidden will-change-transform"
            >
              <motion.img
                src={planImage}
                alt={PLAN_ALT}
                style={{ scale: planScale, x: planX }}
                className="h-full w-full object-cover object-[58%_center]"
                loading="eager"
                fetchPriority="high"
              />
              {/* Muted while in the deck, turns into the full-color photo as it opens */}
              <motion.div aria-hidden style={{ opacity: planTint }} className="absolute inset-0">
                <div className="absolute inset-0 bg-surface opacity-70 mix-blend-color" />
                <div className="absolute inset-0 bg-ink-900/10" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Readability scrim for the stage captions */}
        <motion.div
          aria-hidden
          style={{ opacity: scrimOpacity }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,_rgba(238,242,245,0.86)_0%,_rgba(238,242,245,0.46)_36%,_rgba(238,242,245,0)_60%),linear-gradient(to_top,_rgba(238,242,245,0.9)_0%,_transparent_42%)]"
        />

        {/* Opening copy */}
        <Container className="relative flex h-full items-center">
          <motion.div
            style={{ opacity: copyOpacity, y: copyY, pointerEvents: copyPointerEvents }}
            className="max-w-[36rem] pt-16 xl:max-w-[40rem]"
          >
            <HeroCopy />
          </motion.div>
        </Container>

        {/* Ends the stage on the page paper so it flows straight into the next section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent"
        />

        {/* Stage captions + clickable timeline */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-10">
          <Container>
            <div className="grid">
              {STAGES.map((stage, index) => (
                <StageCaption
                  key={stage.label}
                  stage={stage}
                  progress={progress}
                  isLast={index === STAGES.length - 1}
                />
              ))}
            </div>

            <StageTimeline progress={progress} onSelect={scrollToStage} />
          </Container>
        </div>
      </div>
    </section>
  )
}

function DeckCard({
  src,
  depth,
  spread,
}: {
  src: string
  depth: number
  spread: MotionValue<number>
}) {
  const x = useTransform(spread, [0, 1], [0, depth * 56])
  const y = useTransform(spread, [0, 1], [0, depth * -34])
  const scale = useTransform(spread, [0, 1], [1, 1 - depth * 0.06])

  return (
    <motion.div
      style={{ x, y, scale }}
      className="absolute bottom-[16%] left-[52%] right-[9%] top-[14%] overflow-hidden rounded-[28px] bg-surface shadow-[0_24px_48px_-24px_rgba(12,26,43,0.35)]"
    >
      <img src={src} alt="" className="h-full w-full object-cover object-right" />
      <div className="absolute inset-0 bg-surface/25" />
    </motion.div>
  )
}

function StageCaption({
  stage,
  progress,
  isLast,
}: {
  stage: Stage
  progress: MotionValue<number>
  isLast: boolean
}) {
  const [inStart, inEnd, outStart, outEnd] = stage.window
  const opacity = useTransform(progress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0])
  const y = useTransform(progress, [inStart, inEnd, outStart, outEnd], [40, 0, 0, -30])
  const pointerEvents = useTransform(opacity, (v) => (isLast && v > 0.6 ? 'auto' : 'none'))

  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="col-start-1 row-start-1 self-end">
      <p className="text-sm font-medium text-signal-500">{stage.label}</p>
      <h2 className="balance mt-3 max-w-[17ch] font-display text-4xl font-semibold leading-[1.08] tracking-tight text-paper-100 xl:text-5xl">
        {stage.title}
      </h2>
      <p className="mt-4 max-w-[42ch] text-[17px] leading-relaxed text-steel-300">{stage.text}</p>
      {isLast && (
        <div className="mt-7">
          <Button href="#contacto">Cotiza tu proyecto</Button>
        </div>
      )}
    </motion.div>
  )
}

function StageTimeline({
  progress,
  onSelect,
}: {
  progress: MotionValue<number>
  onSelect: (at: number) => void
}) {
  const firstLeg = useTransform(progress, [STAGES[0].reachedAt, STAGES[1].reachedAt], [0, 1])
  const secondLeg = useTransform(progress, [STAGES[1].reachedAt, STAGES[2].reachedAt], [0, 1])
  // Hidden on the intro, appears as soon as the scroll journey starts. visibility also drops the
  // buttons from the tab order while it is invisible.
  const opacity = useTransform(progress, [0.005, 0.03], [0, 1])
  const y = useTransform(progress, [0.005, 0.03], [12, 0])
  const visibility = useTransform(opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'))

  return (
    <motion.nav
      aria-label="Etapas del proceso"
      style={{ opacity, y, visibility }}
      className="pointer-events-auto mt-10 flex items-center gap-5"
    >
      <StageMark stage={STAGES[0]} progress={progress} onSelect={onSelect} />
      <TimelineLeg fill={firstLeg} />
      <StageMark stage={STAGES[1]} progress={progress} onSelect={onSelect} />
      <TimelineLeg fill={secondLeg} />
      <StageMark stage={STAGES[2]} progress={progress} onSelect={onSelect} />
    </motion.nav>
  )
}

function StageMark({
  stage,
  progress,
  onSelect,
}: {
  stage: Stage
  progress: MotionValue<number>
  onSelect: (at: number) => void
}) {
  const color = useTransform(progress, [stage.reachedAt - 0.04, stage.reachedAt], [MUTED, SIGNAL])

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(stage.focusAt)}
      style={{ color }}
      className="rounded-full text-sm font-medium transition-opacity hover:opacity-80"
    >
      {stage.label}
    </motion.button>
  )
}

function TimelineLeg({ fill }: { fill: MotionValue<number> }) {
  return (
    <div className="relative h-px flex-1 bg-white/15">
      <motion.div
        style={{ scaleX: fill }}
        className="absolute inset-y-0 left-0 w-full origin-left bg-signal-500"
      />
    </div>
  )
}

function HeroStatic() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 120])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-end overflow-hidden bg-surface pb-16 sm:pb-20"
    >
      <motion.img
        src={site1600}
        srcSet={SITE_SRCSET}
        sizes={FULL_BLEED_SIZES}
        alt={SITE_ALT}
        style={{ y: imageY }}
        initial={prefersReducedMotion ? false : { scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.3, ease: EASE_FLUID }}
        className="absolute inset-0 -top-8 h-[calc(100%+2rem)] w-full object-cover object-[40%_center]"
        loading="eager"
        fetchPriority="high"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,_rgba(238,242,245,1)_0%,_rgba(238,242,245,0.78)_45%,_rgba(238,242,245,0.05)_80%)]"
      />
      <div
        aria-hidden
        className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_top,transparent_0%,black_25%,transparent_65%)]"
      />

      <Container className="relative">
        <div className="max-w-xl">
          <HeroCopy />
        </div>
      </Container>
    </section>
  )
}
