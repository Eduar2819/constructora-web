import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import logo from '@/assets/brand/sosacraft-logo.png'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Contacto', href: '#contacto' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState('')

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className="pt-5">
        <div className="surface-dark flex items-center justify-between rounded-full border border-white/10 bg-ink-900/90 px-5 py-2.5 shadow-[0_8px_30px_-12px_rgba(8,19,33,0.5)] backdrop-blur-xl">
          <a href="#top" className="shrink-0" aria-label="SosaCraft Constructora, ir al inicio">
            <img src={logo} alt="SosaCraft Constructora" width={828} height={380} className="h-9 w-auto" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.href.slice(1)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 text-sm transition-colors duration-200 ${
                    isActive ? 'text-paper-100' : 'text-steel-300 hover:text-paper-100'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-signal-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              )
            })}
          </nav>

          <div className="hidden lg:block">
            <Button href="#contacto" variant="ghost" className="!py-1.5 text-sm">
              Cotiza tu proyecto
            </Button>
          </div>

          <button
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="relative flex h-9 w-9 items-center justify-center lg:hidden"
          >
            <motion.span
              className="absolute h-[1.5px] w-5 bg-paper-100"
              animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="absolute h-[1.5px] w-5 bg-paper-100"
              animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="surface-dark fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-ink-950/97 backdrop-blur-2xl lg:hidden"
          >
            {NAV_LINKS.map((link, index) => {
              const isActive = activeId === link.href.slice(1)
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-display text-3xl font-medium ${isActive ? 'text-signal-500' : 'text-paper-100'}`}
                >
                  {link.label}
                </motion.a>
              )
            })}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * NAV_LINKS.length, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button href="#contacto" onClick={closeMenu}>
                Cotiza tu proyecto
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
