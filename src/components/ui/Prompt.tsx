import clsx from 'clsx'

interface PromptProps {
  path?: string
  className?: string
  dim?: boolean
}

export function Prompt({ path = '~', className = '', dim = false }: PromptProps) {
  return (
    <span className={clsx('select-none shrink-0 whitespace-nowrap', className)}>
      <span className={clsx(dim ? 'text-terminal-muted' : 'text-terminal-green-dim')}>
        ibrahim@portfolio
      </span>
      <span className={clsx(dim ? 'text-terminal-muted' : 'text-terminal-muted')}>:</span>
      <span className={clsx(dim ? 'text-terminal-muted' : 'text-terminal-cyan')}>
        {path}
      </span>
      <span className={clsx(dim ? 'text-terminal-muted' : 'text-terminal-green')}> $ </span>
    </span>
  )
}
