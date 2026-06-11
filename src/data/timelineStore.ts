import type { TimelinePhase } from './timeline'
import {
  getTimelineRaw, saveTimeline, resetKey,
} from './api'

export function getTimeline(): TimelinePhase[] {
  return getTimelineRaw()
}

export { saveTimeline }

export function resetTimeline(): void {
  resetKey('timeline')
}

export function isUsingCustomTimeline(): boolean {
  return localStorage.getItem('portfolio_timeline') !== null
}
