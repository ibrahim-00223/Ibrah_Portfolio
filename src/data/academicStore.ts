export type AcademicEntry = {
  id: string
  period: string
  title: string
  school: string
  description: string
  tags: string[]
  color: 'amber' | 'cyan' | 'green'
}

import {
  getAcademicRaw, saveAcademic, resetKey,
} from './api'

export function getAcademic(): AcademicEntry[] {
  return getAcademicRaw()
}

export { saveAcademic }

export function resetAcademic(): void {
  resetKey('academic')
}

export function isUsingCustomAcademic(): boolean {
  return localStorage.getItem('portfolio_academic') !== null
}
