import { ArrowUpRight } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useMagneticHover } from '@/shared/hooks/useMagneticHover'

type ButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'primary' | 'ghost' | 'light'
  icon?: boolean
  className?: string
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-500 text-ink-950 shadow-[0_0_0_rgba(227,155,18,0)] hover:bg-brand-400 hover:shadow-[0_10px_30px_-6px_rgba(227,155,18,0.3)]',
  // Solid paper-white secondary for busy light backgrounds (navy on white: 17:1)
  light:
    'bg-white text-ink-900 shadow-[0_8px_24px_-12px_rgba(12,26,43,0.35)] hover:shadow-[0_12px_30px_-12px_rgba(12,26,43,0.45)]',
  ghost:
    'border border-current/25 text-paper-100 hover:border-current/50 hover:bg-current/5',
}

const ICON_STYLES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-ink-950/15',
  ghost: 'bg-current/10',
  light: 'bg-ink-900/8',
}

const HOVER_SPRING = { type: 'spring', stiffness: 400, damping: 22 } as const

export function Button({
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  icon = true,
  className = '',
}: ButtonProps) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagneticHover()
  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      ref={ref as never}
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      disabled={href ? undefined : disabled}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      whileHover={disabled ? undefined : { scale: 1.025 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={HOVER_SPRING}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 font-body text-[15px] font-medium transition-[background-color,border-color,box-shadow] duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${icon ? 'pr-2' : 'pr-6'} ${VARIANT_STYLES[variant]} ${className}`}
    >
      <span className="whitespace-nowrap">{children}</span>
      {icon && (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110 ${ICON_STYLES[variant]}`}
        >
          <ArrowUpRight size={16} weight="bold" />
        </span>
      )}
    </Tag>
  )
}
