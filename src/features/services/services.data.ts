import { Buildings, ClipboardText, House, Wrench, type Icon } from '@phosphor-icons/react'
import { unsplash, type StockImage } from '@/shared/lib/stock'

export type Service = {
  title: string
  description: string
  image: StockImage
  imageAlt: string
  icon: Icon
}

export const services: Service[] = [
  {
    title: 'Construcción residencial',
    description: 'Casas y desarrollos habitacionales, de la cimentación al acabado final.',
    image: unsplash('1672627170267-fca17bb54156'),
    imageAlt: 'Casa de dos niveles en construcción con muros de triplay y ventanas por instalar',
    icon: House,
  },
  {
    title: 'Comercial e industrial',
    description: 'Naves, oficinas y centros logísticos diseñados para operar desde el primer día.',
    image: unsplash('1527335988388-b40ee248d80c'),
    imageAlt: 'Estructura de acero de un edificio en montaje junto a dos grúas torre',
    icon: Buildings,
  },
  {
    title: 'Remodelación y ampliación',
    description: 'Intervenciones a inmuebles en uso, sin detener su operación.',
    image: unsplash('1634586648651-f1fb9ec10d90'),
    imageAlt: 'Interior en remodelación apuntalado con puntales metálicos y escombro en el piso',
    icon: Wrench,
  },
  {
    title: 'Gestión de proyecto y obra',
    description: 'Supervisión técnica, costos y calendario bajo control en cada etapa.',
    image: unsplash('1541888946425-d81bb19240f5'),
    imageAlt: 'Equipo de supervisores con casco y chaleco revisando una losa en construcción',
    icon: ClipboardText,
  },
]
