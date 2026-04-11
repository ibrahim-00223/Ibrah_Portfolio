import { useState, useEffect, useRef, useCallback } from 'react'

type Speed = 'instant' | 'fast' | 'normal' | 'slow'

const SPEED_MAP: Record<Speed, number> = {
  instant: 0,
  fast: 18,
  normal: 35,
  slow: 60,
}

interface UseTypewriterOptions {
  text: string
  speed?: Speed | number
  startDelay?: number
  enabled?: boolean
}

interface UseTypewriterResult {
  displayed: string
  isDone: boolean
  reset: () => void
}

export function useTypewriter({
  text,
  speed = 'normal',
  startDelay = 0,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterResult {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)
  const indexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const msPerChar = typeof speed === 'number' ? speed : SPEED_MAP[speed]

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    indexRef.current = 0
    setDisplayed('')
    setIsDone(false)
  }, [])

  useEffect(() => {
    if (!enabled) return

    if (!text) {
      setDisplayed('')
      setIsDone(true)
      return
    }

    if (msPerChar === 0) {
      setDisplayed(text)
      setIsDone(true)
      return
    }

    indexRef.current = 0
    setDisplayed('')
    setIsDone(false)

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current += 1
        setDisplayed(text.slice(0, indexRef.current))

        if (indexRef.current >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsDone(true)
        }
      }, msPerChar)
    }, startDelay)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [text, msPerChar, startDelay, enabled])

  return { displayed, isDone, reset }
}
