import { unsplash, type StockImage } from '@/shared/lib/stock'

export type Project = {
  name: string
  location: string
  category: string
  image: StockImage
}

export const projects: Project[] = [
  {
    name: 'Torre Alameda',
    location: 'Monterrey, N.L.',
    category: 'Oficinas corporativas',
    image: unsplash('1551295022-de5522c94e08', 900),
  },
  {
    name: 'Residencial Cumbres',
    location: 'Saltillo, Coah.',
    category: 'Desarrollo habitacional',
    image: unsplash('1605276374104-dee2a0ed3cd6', 900),
  },
  {
    name: 'Centro Logístico Apodaca',
    location: 'Apodaca, N.L.',
    category: 'Nave industrial',
    image: unsplash('1557761469-f29c6e201784', 900),
  },
  {
    name: 'Plaza Andares Norte',
    location: 'Monterrey, N.L.',
    category: 'Remodelación comercial',
    image: unsplash('1741482529066-66878ff835c5', 900),
  },
]
