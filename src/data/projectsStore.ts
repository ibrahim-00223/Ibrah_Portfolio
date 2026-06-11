import type { Project } from './projects'
import {
  getProjectsRaw, saveProjects, resetKey,
} from './api'

export function getProjects(): Project[] {
  return getProjectsRaw()
}

export { saveProjects }

export function resetProjects(): void {
  resetKey('projects')
}

export function isUsingCustomProjects(): boolean {
  return localStorage.getItem('portfolio_projects') !== null
}
