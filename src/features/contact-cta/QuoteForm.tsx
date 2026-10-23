import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'
import { EASE_FLUID } from '@/shared/lib/motion'
import { SuccessMark, SUCCESS_MARK_DURATION } from './SuccessMark'
import {
  EMPTY_QUOTE,
  PROJECT_TYPES,
  QUOTE_EMAIL,
  sendQuoteRequest,
  validateQuote,
  type QuoteErrors,
  type QuoteRequest,
} from './quoteRequest'

type Status = 'idle' | 'sending' | 'ready' | 'error'

const INPUT_STYLES =
  'w-full rounded-xl border bg-ink-950/50 px-4 py-3 text-[15px] text-paper-100 placeholder:text-steel-400 transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2'
const INPUT_OK = 'border-white/15 hover:border-white/25 focus-visible:border-signal-500 focus-visible:ring-signal-500/30'
const INPUT_ERROR = 'border-danger-400 focus-visible:ring-danger-400/30'

// Short beat on the button so a fast response still reads as a send, not a jump cut
const MIN_SENDING_MS = 900

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Success copy cascades in once the house mark has finished building
const successItem = (index: number, reduced: boolean | null) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: SUCCESS_MARK_DURATION - 0.25 + index * 0.09, ease: EASE_FLUID },
      }

const SWAP = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: EASE_FLUID },
}

export function QuoteForm() {
  const [quote, setQuote] = useState<QuoteRequest>(EMPTY_QUOTE)
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const prefersReducedMotion = useReducedMotion()

  const update = (field: keyof QuoteRequest) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const next = { ...quote, [field]: event.target.value }
    setQuote(next)
    // After the first submit attempt, errors clear as soon as a field becomes valid
    if (submitted) setErrors(validateQuote(next))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const nextErrors = validateQuote(quote)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      // Wait for React to paint aria-invalid before moving focus to the first broken field
      const form = event.currentTarget
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }

    setStatus('sending')
    try {
      await Promise.all([sendQuoteRequest(quote), wait(MIN_SENDING_MS)])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setQuote(EMPTY_QUOTE)
    setErrors({})
    setSubmitted(false)
    setStatus('idle')
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'ready' ? (
        <motion.div key="ready" {...SWAP} role="status" className="flex flex-col items-start gap-4 py-6">
          <SuccessMark />
          <motion.h3 {...successItem(0, prefersReducedMotion)} className="mt-2 font-display text-2xl font-semibold text-paper-100 sm:text-3xl">
            Gracias, {quote.name.trim().split(/\s+/)[0]}. Recibimos tu solicitud.
          </motion.h3>
          <motion.p {...successItem(1, prefersReducedMotion)} className="max-w-[44ch] leading-relaxed text-steel-300">
            Revisaremos tu proyecto y te contactaremos en{' '}
            <span className="text-paper-100">{quote.email.trim()}</span> en menos de 48 horas.
          </motion.p>
          <motion.button
            {...successItem(2, prefersReducedMotion)}
            type="button"
            onClick={reset}
            className="mt-2 text-sm font-medium text-signal-400 underline-offset-4 hover:underline"
          >
            Hacer otra solicitud
          </motion.button>
        </motion.div>
      ) : (
        <motion.form key="form" {...SWAP} noValidate onSubmit={onSubmit} className="grid gap-5">
          <Field label="Nombre" error={errors.name}>
            {(props) => (
              <input
                {...props}
                type="text"
                autoComplete="name"
                placeholder="Cómo te llamas"
                value={quote.name}
                onChange={update('name')}
              />
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Correo" error={errors.email}>
              {(props) => (
                <input
                  {...props}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="tu@correo.com"
                  value={quote.email}
                  onChange={update('email')}
                />
              )}
            </Field>
            <Field label="Teléfono" hint="Opcional" error={errors.phone}>
              {(props) => (
                <input
                  {...props}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="81 0000 0000"
                  value={quote.phone}
                  onChange={update('phone')}
                />
              )}
            </Field>
          </div>

          <ProjectTypePicker
            value={quote.projectType}
            error={errors.projectType}
            onChange={(projectType) => {
              const next = { ...quote, projectType }
              setQuote(next)
              if (submitted) setErrors(validateQuote(next))
            }}
          />

          <Field label="Cuéntanos del proyecto" hint="Opcional" error={errors.message}>
            {(props) => (
              <textarea
                {...props}
                rows={3}
                maxLength={500}
                placeholder="Ubicación, metros aproximados, fechas…"
                value={quote.message}
                onChange={update('message')}
                className={`${props.className} resize-none`}
              />
            )}
          </Field>

          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-steel-400">Solo usamos tus datos para responderte.</p>
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Solicitar cotización'}
            </Button>
          </div>

          {status === 'error' && (
            <p role="alert" className="text-sm text-danger-400">
              No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos a {QUOTE_EMAIL}.
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  )
}

type FieldControlProps = {
  id: string
  className: string
  'aria-invalid': boolean
  'aria-describedby'?: string
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: (props: FieldControlProps) => ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="grid content-start gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-paper-100">
        {label}
        {hint && <span className="text-xs font-normal text-steel-400">{hint}</span>}
      </label>
      {children({
        id,
        className: `${INPUT_STYLES} ${error ? INPUT_ERROR : INPUT_OK}`,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="text-sm text-danger-400">
          {error}
        </p>
      )}
    </div>
  )
}

function ProjectTypePicker({
  value,
  error,
  onChange,
}: {
  value: QuoteRequest['projectType']
  error?: string
  onChange: (value: QuoteRequest['projectType']) => void
}) {
  const name = useId()
  const errorId = `${name}-error`

  return (
    <fieldset aria-describedby={error ? errorId : undefined} className="grid gap-2">
      <legend className="mb-2 text-sm font-medium text-paper-100">Tipo de proyecto</legend>
      <div className="grid grid-cols-2 gap-2">
        {PROJECT_TYPES.map((type, index) => (
          <label
            key={type}
            className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center text-sm transition-colors duration-200 has-checked:border-signal-500 has-checked:bg-signal-500/10 has-checked:text-paper-100 has-focus-visible:ring-2 has-focus-visible:ring-signal-500/40 ${
              error ? 'border-danger-400 text-steel-300' : 'border-white/15 text-steel-300 hover:border-white/30'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={type}
              checked={value === type}
              onChange={() => onChange(type)}
              aria-invalid={index === 0 ? Boolean(error) : undefined}
              className="sr-only"
            />
            {type}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger-400">
          {error}
        </p>
      )}
    </fieldset>
  )
}
