// Logos from src/assets/images/logos/*.png, made transparent, trimmed and tinted steel (#3d5166)
// into ./logos/web so they sit on the light band without a white box.
import alameda from '@/assets/images/logos/web/alameda.png'
import andares from '@/assets/images/logos/web/andares.png'
import apodaca from '@/assets/images/logos/web/apodaca.png'
import cumbres from '@/assets/images/logos/web/cumbres.png'
import fundadores from '@/assets/images/logos/web/fundadores.png'
import naves from '@/assets/images/logos/web/naves.png'
import sendero from '@/assets/images/logos/web/sendero.png'
import solera from '@/assets/images/logos/web/solera.png'

export type Client = {
  name: string
  logo: string
}

export const clients: Client[] = [
  { name: 'Apodaca Logística', logo: apodaca },
  { name: 'Inmobiliaria Cumbres', logo: cumbres },
  { name: 'Plaza Andares Norte', logo: andares },
  { name: 'Grupo Fundadores', logo: fundadores },
  { name: 'Corporativo Alameda', logo: alameda },
  { name: 'Naves del Norte', logo: naves },
  { name: 'Parque Sendero', logo: sendero },
  { name: 'Grupo Solera', logo: solera },
]
