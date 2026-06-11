export type Skill = {
  name: string
  value: number
}

export type StatModule = {
  label: string
  short: string
  skills: Skill[]
}

import {
  getScorecardRaw, saveScorecard, resetKey,
} from './api'

export function moduleValue(m: StatModule): number {
  if (!m.skills.length) return 0
  return Math.round(m.skills.reduce((s, sk) => s + sk.value, 0) / m.skills.length)
}

export function getScorecard(): StatModule[] {
  return getScorecardRaw()
}

export { saveScorecard }

export function resetScorecard(): void {
  resetKey('scorecard')
}

export function isUsingCustomScorecard(): boolean {
  return localStorage.getItem('portfolio_scorecard') !== null
}
