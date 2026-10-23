import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

type ContainerProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function Container<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  ...rest
}: ContainerProps<T>) {
  const Tag = as ?? 'div'
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-6 md:px-10 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
