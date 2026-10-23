import logo from '@/assets/brand/sosacraft-logo.png'
import { Container } from '@/shared/ui/Container'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="surface-dark py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img
              src={logo}
              alt="SosaCraft Constructora"
              width={828}
              height={380}
              loading="lazy"
              className="h-16 w-auto"
            />
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-steel-400">
              Construcción residencial, comercial e industrial en el norte de México.
            </p>
            <p className="mt-4 text-sm text-steel-400">
              Av. Fundadores 1420, Col. Centro, Monterrey, N.L.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-paper-100">Empresa</p>
            <ul className="mt-4 space-y-2.5 text-sm text-steel-400">
              <li>
                <a href="#servicios" className="transition-colors hover:text-paper-100">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#proyectos" className="transition-colors hover:text-paper-100">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#proceso" className="transition-colors hover:text-paper-100">
                  Proceso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-paper-100">Contacto</p>
            <ul className="mt-4 space-y-2.5 text-sm text-steel-400">
              <li>
                <a href="mailto:contacto@sosacraft.mx" className="transition-colors hover:text-paper-100">
                  contacto@sosacraft.mx
                </a>
              </li>
              <li>
                <a href="tel:+528112345678" className="transition-colors hover:text-paper-100">
                  +52 81 1234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 text-sm text-steel-400">
          © {YEAR} SosaCraft Constructora. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  )
}
