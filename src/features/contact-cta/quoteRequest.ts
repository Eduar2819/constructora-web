export const QUOTE_EMAIL = 'contacto@sosacraft.mx'

export const PROJECT_TYPES = [
  'Residencial',
  'Comercial e industrial',
  'Remodelación',
  'Gestión de obra',
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]

export type QuoteRequest = {
  name: string
  email: string
  phone: string
  projectType: ProjectType | ''
  message: string
}

export type QuoteErrors = Partial<Record<keyof QuoteRequest, string>>

export const EMPTY_QUOTE: QuoteRequest = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateQuote(quote: QuoteRequest): QuoteErrors {
  const errors: QuoteErrors = {}

  if (quote.name.trim().length < 2) errors.name = 'Escribe tu nombre.'

  if (!quote.email.trim()) errors.email = 'Escribe tu correo para responderte.'
  else if (!EMAIL_PATTERN.test(quote.email.trim())) errors.email = 'Revisa el formato del correo.'

  const phoneDigits = quote.phone.replace(/\D/g, '')
  if (quote.phone.trim() && phoneDigits.length < 10) {
    errors.phone = 'El teléfono debe tener al menos 10 dígitos.'
  }

  if (!quote.projectType) errors.projectType = 'Elige el tipo de proyecto.'

  if (quote.message.length > 500) errors.message = 'Máximo 500 caracteres.'

  return errors
}

// Set VITE_QUOTE_ENDPOINT (e.g. a Formspree form URL or your own API route) to deliver requests.
// Without it the request is simulated, so the form and its success state work during development.
const QUOTE_ENDPOINT = import.meta.env.VITE_QUOTE_ENDPOINT as string | undefined
const SIMULATED_LATENCY_MS = 1200

export async function sendQuoteRequest(quote: QuoteRequest): Promise<void> {
  const payload = {
    name: quote.name.trim(),
    email: quote.email.trim(),
    phone: quote.phone.trim(),
    projectType: quote.projectType,
    message: quote.message.trim(),
  }

  if (!QUOTE_ENDPOINT) {
    if (import.meta.env.DEV) console.info('[quote] simulated request', payload)
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS))
    return
  }

  const response = await fetch(QUOTE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Quote request failed with status ${response.status}`)
}
