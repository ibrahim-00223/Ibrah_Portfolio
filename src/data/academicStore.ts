export type AcademicEntry = {
  id: string
  period: string
  title: string
  school: string
  description: string
  tags: string[]
  color: 'amber' | 'cyan' | 'green'
}

const STORAGE_KEY = 'portfolio_academic'

export const DEFAULT_ACADEMIC: AcademicEntry[] = [
  {
    id: 'bts',
    period: '2019 — 2021',
    title: 'BTS Management Commercial',
    school: 'Formation initiale',
    description: "Bases en gestion commerciale, négociation et management. Développement des compétences en relation client, stratégie commerciale et pilotage d'équipe.",
    tags: ['Commerce', 'Négociation', 'Management', 'Marketing'],
    color: 'amber',
  },
  {
    id: 'growth',
    period: '2021 — 2024',
    title: 'Growth & Stratégie Éditoriale',
    school: 'Auto-formation',
    description: "Maîtrise du SEO YouTube, stratégie de contenu, growth hacking et analytics. +100 vidéos produites et une compréhension fine de l'algorithme.",
    tags: ['SEO YouTube', 'Content Strategy', 'Analytics', 'Storytelling'],
    color: 'cyan',
  },
  {
    id: 'ai-eng',
    period: '2024 — Présent',
    title: 'IA & Ingénierie Logicielle',
    school: 'DeepLearning.AI · Anthropic · OpenAI',
    description: 'LLMs, systèmes multi-agents, Python, FastAPI et automatisation. Application directe en production chez Scalefast avec des résultats mesurables.',
    tags: ['Python', 'LLM', 'Multi-agent', 'FastAPI', 'Prompt Engineering'],
    color: 'green',
  },
]

export function getAcademic(): AcademicEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_ACADEMIC
}

export function saveAcademic(entries: AcademicEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function resetAcademic(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isUsingCustomAcademic(): boolean {
  return !!localStorage.getItem(STORAGE_KEY)
}
