// projectsStore.ts — gestion des projets via localStorage
// Les projets ajoutés via /admin sont sauvegardés ici.
// Fallback automatique vers les projets statiques (projects.ts) si localStorage vide.

import { projects as staticProjects, type Project } from './projects'

const STORAGE_KEY = 'portfolio_projects'

/** Retourne les projets custom (localStorage) ou les projets statiques par défaut */
export function getProjects(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Project[]
      }
    }
  } catch {
    // Erreur de parsing → fallback silencieux
  }
  return staticProjects
}

/** Sauvegarde les projets dans localStorage (recalcule les numéros) */
export function saveProjects(projects: Project[]): void {
  const withNumbers = projects.map((p, i) => ({
    ...p,
    number: String(i + 1).padStart(2, '0'),
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withNumbers))
}

/** Supprime la surcharge localStorage → retour aux projets statiques */
export function resetProjects(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** Indique si des projets custom sont actifs */
export function isUsingCustomProjects(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}
