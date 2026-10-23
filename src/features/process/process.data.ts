import { Compass, HardHat, Key, MagnifyingGlass, type Icon } from '@phosphor-icons/react'

export type ProcessStep = {
  title: string
  description: string
  icon: Icon
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Diagnóstico',
    description: 'Visitamos el sitio y definimos alcance, presupuesto y tiempos.',
    icon: MagnifyingGlass,
  },
  {
    title: 'Diseño y planos',
    description: 'Ingeniería estructural y planos ejecutivos listos para construir.',
    icon: Compass,
  },
  {
    title: 'Construcción',
    description: 'Ejecución en obra con supervisión diaria y control de calidad.',
    icon: HardHat,
  },
  {
    title: 'Entrega',
    description: 'Cierre administrativo, garantías y acompañamiento post-obra.',
    icon: Key,
  },
]
