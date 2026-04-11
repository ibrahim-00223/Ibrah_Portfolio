interface CursorProps {
  visible?: boolean
  className?: string
}

export function Cursor({ visible = true, className = '' }: CursorProps) {
  if (!visible) return null
  return (
    <span
      className={`inline-block w-2 h-4 bg-terminal-green animate-cursor-blink align-middle ${className}`}
      aria-hidden="true"
    />
  )
}
