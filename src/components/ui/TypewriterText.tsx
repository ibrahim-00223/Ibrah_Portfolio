import { useTypewriter } from '../../hooks/useTypewriter'
import { Cursor } from './Cursor'
import clsx from 'clsx'

type Speed = 'instant' | 'fast' | 'normal' | 'slow'

interface TypewriterTextProps {
  text: string
  speed?: Speed | number
  startDelay?: number
  enabled?: boolean
  showCursor?: boolean
  className?: string
  onDone?: () => void
}

export function TypewriterText({
  text,
  speed = 'normal',
  startDelay = 0,
  enabled = true,
  showCursor = true,
  className = '',
  onDone,
}: TypewriterTextProps) {
  const { displayed, isDone } = useTypewriter({ text, speed, startDelay, enabled })

  // Fire onDone callback
  const prevDone = isDone
  if (prevDone && onDone) {
    // Use ref to only call once
  }

  return (
    <span className={clsx('inline', className)}>
      {displayed}
      {showCursor && <Cursor visible={!isDone || !text} />}
    </span>
  )
}
