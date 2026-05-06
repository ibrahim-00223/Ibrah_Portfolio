export type Skill = {
  name: string
  value: number
}

export type StatModule = {
  label: string
  short: string
  skills: Skill[]
}

const STORAGE_KEY = 'portfolio_scorecard'

export const DEFAULT_MODULES: StatModule[] = [
  {
    label: 'Business', short: 'BUS',
    skills: [
      { name: 'Storytelling',    value: 92 },
      { name: 'Sales Strategy',  value: 88 },
      { name: 'Négociation',     value: 85 },
      { name: 'Client Mgmt',     value: 87 },
    ],
  },
  {
    label: 'IA', short: 'AI',
    skills: [
      { name: 'LLM / Prompting', value: 85 },
      { name: 'Multi-agent',     value: 80 },
      { name: 'AI Automation',   value: 82 },
      { name: 'No-code AI',      value: 81 },
    ],
  },
  {
    label: 'Data', short: 'DAT',
    skills: [
      { name: 'Data Enrichment', value: 78 },
      { name: 'CRM Analytics',   value: 74 },
      { name: 'Reporting',       value: 72 },
      { name: 'SQL / Sheets',    value: 72 },
    ],
  },
  {
    label: 'Engineering', short: 'ENG',
    skills: [
      { name: 'Python',          value: 73 },
      { name: 'FastAPI',         value: 68 },
      { name: 'API Integration', value: 72 },
      { name: 'React / Web',     value: 67 },
    ],
  },
  {
    label: 'Proj. Mgmt', short: 'PM',
    skills: [
      { name: 'GTM Planning',    value: 80 },
      { name: 'Roadmapping',     value: 79 },
      { name: 'Process Design',  value: 78 },
      { name: 'Coordination',    value: 75 },
    ],
  },
]

export function moduleValue(m: StatModule): number {
  if (!m.skills.length) return 0
  return Math.round(m.skills.reduce((s, sk) => s + sk.value, 0) / m.skills.length)
}

export function getScorecard(): StatModule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_MODULES
}

export function saveScorecard(modules: StatModule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(modules))
}

export function resetScorecard(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isUsingCustomScorecard(): boolean {
  return !!localStorage.getItem(STORAGE_KEY)
}
