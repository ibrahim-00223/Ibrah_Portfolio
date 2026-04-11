import { timelinePhases as staticPhases, type TimelinePhase } from './timeline'

const STORAGE_KEY = 'portfolio_timeline'

export function getTimeline(): TimelinePhase[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as TimelinePhase[]
    }
  } catch { /* silent fallback */ }
  return staticPhases
}

export function saveTimeline(phases: TimelinePhase[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phases))
}

export function resetTimeline(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isUsingCustomTimeline(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}
