export type Testimonial = {
  quote: string
  name: string
  role: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'SosaCraft entregó nuestra nave industrial dos semanas antes de lo previsto, con el mismo presupuesto que firmamos.',
    name: 'Rodrigo Elizondo',
    role: 'Director de Operaciones, Apodaca Logística',
  },
  {
    quote:
      'La comunicación durante la obra fue constante. Siempre supimos en qué etapa íbamos y por qué.',
    name: 'Daniela Farías',
    role: 'Gerente de Proyecto, Inmobiliaria Cumbres',
  },
  {
    quote:
      'Nos remodelaron un centro comercial en operación y no cerraron un solo local durante la obra.',
    name: 'Luis Olvera',
    role: 'Gerente General, Plaza Andares Norte',
  },
]
