import { motion } from 'motion/react'
import { Container } from '@/shared/ui/Container'
import { fadeUp, viewportOnce } from '@/shared/lib/motion'
import { clients, type Client } from './clients.data'

function ClientLogo({ client, decorative }: { client: Client; decorative: boolean }) {
  return (
    <li className="flex shrink-0 items-center px-10 sm:px-12">
      <img
        src={client.logo}
        alt={decorative ? '' : client.name}
        loading="lazy"
        className="h-8 w-auto opacity-80 transition-opacity duration-300 hover:opacity-100 sm:h-10"
      />
    </li>
  )
}

export function Clients() {
  // Second copy only exists for the seamless loop, so screen readers skip it
  const track = [
    ...clients.map((client) => ({ client, decorative: false })),
    ...clients.map((client) => ({ client, decorative: true })),
  ]

  return (
    <section className="pb-13.75 pt-20">
      <Container>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center font-display text-xl font-medium text-paper-100 sm:text-2xl"
        >
          Empresas con las que ya construimos.
        </motion.p>
      </Container>

      <div className="relative mt-10 overflow-hidden marquee-fade">
        <ul
          aria-label="Clientes"
          className="flex w-max items-center marquee-track hover:[animation-play-state:paused]"
        >
          {track.map(({ client, decorative }, index) => (
            <ClientLogo key={`${client.name}-${index}`} client={client} decorative={decorative} />
          ))}
        </ul>
      </div>
    </section>
  )
}
