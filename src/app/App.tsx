import { Clients } from '@/features/clients/Clients'
import { ContactCta } from '@/features/contact-cta/ContactCta'
import { Footer } from '@/features/footer/Footer'
import { Hero } from '@/features/hero/Hero'
import { Navigation } from '@/features/navigation/Navigation'
import { Process } from '@/features/process/Process'
import { Projects } from '@/features/projects/Projects'
import { Services } from '@/features/services/Services'
import { Testimonials } from '@/features/testimonials/Testimonials'
import { TrustMetrics } from '@/features/trust-metrics/TrustMetrics'

function App() {
  return (
    <>
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Navigation />
      <main id="contenido">
        <Hero />
        <Clients />
        <TrustMetrics />
        <Services />
        <Projects />
        <Process />
        <Testimonials />
        <ContactCta />
      </main>
      <Footer />
    </>
  )
}

export default App
