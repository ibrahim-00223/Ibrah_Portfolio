import { useEffect } from 'react'
import { useTypewriter } from '../../../hooks/useTypewriter'
import { useBootSequence } from '../../../hooks/useBootSequence'
import { bootLines } from '../../../data/bootSequence'
import { Cursor } from '../../ui/Cursor'
import clsx from 'clsx'

interface BootSequenceProps {
  onComplete: () => void
}

const colorClass: Record<string, string> = {
  green: 'text-terminal-green',
  amber: 'text-terminal-amber',
  muted: 'text-terminal-muted',
  red: 'text-terminal-red',
  cyan: 'text-terminal-cyan',
}

function BootLine({
  line,
  index,
  isActive,
  isComplete,
  onDone,
}: {
  line: (typeof bootLines)[number]
  index: number
  isActive: boolean
  isComplete: boolean
  onDone: (i: number) => void
}) {
  const { displayed, isDone } = useTypewriter({
    text: line.text,
    speed: line.speed ?? 'fast',
    enabled: isActive || isComplete,
  })

  useEffect(() => {
    if (isDone && isActive) {
      onDone(index)
    }
  }, [isDone, isActive, index, onDone])

  if (!isActive && !isComplete) return null

  return (
    <div className={clsx('text-sm leading-relaxed', colorClass[line.color ?? 'muted'])}>
      {isComplete ? line.text : displayed}
      {isActive && !isDone && <Cursor />}
    </div>
  )
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const { currentLineIndex, completedLines, onLineComplete } = useBootSequence(
    bootLines,
    onComplete
  )

  return (
    <div className="space-y-0.5 font-mono text-sm">
      {bootLines.map((line, i) => (
        <BootLine
          key={i}
          line={line}
          index={i}
          isActive={i === currentLineIndex}
          isComplete={completedLines.has(i)}
          onDone={onLineComplete}
        />
      ))}
    </div>
  )
}
