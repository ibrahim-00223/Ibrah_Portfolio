export type TimelinePhase = {
  id: string
  period: string
  title: string
  company?: string
  shortTitle: string
  description: string
  tags: string[]
  color: 'amber' | 'cyan' | 'green'
  icon: string
}

export const timelinePhases: TimelinePhase[] = [
  {
    id: 'content',
    period: '2021 — 2024',
    title: 'YouTube Content Manager',
    shortTitle: 'Content',
    description:
      "J'accompagne des créateurs de contenu dans la production de leurs vidéos. Sélection des concepts, choix des formats, rédaction des briefs, montage vidéo, création des miniatures et publication. Une école du storytelling et de la stratégie éditoriale.",
    tags: ['Storytelling', 'Stratégie éditoriale', 'Montage vidéo', 'SEO YouTube'],
    color: 'amber',
    icon: '▶',
  },
  {
    id: 'sales',
    period: '2024 — 2025',
    title: 'Key Account Manager',
    company: 'Daikin',
    shortTitle: 'Sales',
    description:
      "En tant que Key Account Manager, je gère un portefeuille de comptes clés représentant +453k€ de revenus. Construction d'une base de 100+ prospects qualifiés avec données enrichies, création de supports de vente et pilotage des relations commerciales stratégiques.",
    tags: ['CRM', 'Prospection', 'Négociation', 'Data enrichissement'],
    color: 'cyan',
    icon: '◈',
  },
  {
    id: 'revops',
    period: '2025 — Aujourd\'hui',
    title: 'GTM & AI Engineer',
    company: 'Scalefast',
    shortTitle: 'RevOps / AI',
    description:
      "Chez Scalefast, je construis l'infrastructure scalable de l'équipe Sales & Growth. Génération de listes de prospection, création de contenu automatisée, automatisation des processus métier et déploiement de systèmes IA multi-agents.",
    tags: ['Python', 'FastAPI', 'LLM', 'Multi-agent', 'SEO/GEO', 'Automatisation'],
    color: 'green',
    icon: '⬡',
  },
]
