import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <div className={clsx('text-xl font-bold', className)}>
      <span className="text-pistachio-400">Siji</span>
      <span className="text-terminal-text">GPT</span>
    </div>
  )
}
