import { useState, useEffect, useCallback } from 'react'
import type { BootLine } from '../data/bootSequence'

interface UseBootSequenceResult {
  currentLineIndex: number
  completedLines: Set<number>
  onLineComplete: (index: number) => void
}

export function useBootSequence(
  lines: BootLine[],
  onComplete: () => void,
  enabled: boolean = true
): UseBootSequenceResult {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [completedLines, setCompletedLines] = useState<Set<number>>(new Set())

  const onLineComplete = useCallback(
    (index: number) => {
      setCompletedLines((prev) => new Set([...prev, index]))

      const nextIndex = index + 1

      if (nextIndex >= lines.length) {
        setTimeout(onComplete, 600)
        return
      }

      const nextLine = lines[nextIndex]
      setTimeout(() => {
        setCurrentLineIndex(nextIndex)
      }, nextLine.delay)
    },
    [lines, onComplete]
  )

  useEffect(() => {
    if (!enabled) return
    setCurrentLineIndex(0)
    setCompletedLines(new Set())
  }, [enabled])

  return { currentLineIndex, completedLines, onLineComplete }
}
