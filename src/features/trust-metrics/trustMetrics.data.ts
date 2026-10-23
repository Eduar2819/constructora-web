export type TrustMetric = {
  value: number
  suffix: string
  label: string
}

// TODO: valores de ejemplo, reemplazar con cifras reales de SosaCraft antes de publicar.
export const trustMetrics: TrustMetric[] = [
  { value: 18, suffix: ' años', label: 'de operación construyendo en el norte del país' },
  { value: 126, suffix: '', label: 'proyectos entregados en tiempo y forma' },
  { value: 342, suffix: ' mil m²', label: 'construidos a la fecha' },
  { value: 96, suffix: '%', label: 'de clientes que vuelven a contratarnos' },
]
