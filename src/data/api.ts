import type { Project } from './projects'
import type { StackNode } from './stack'
import type { TimelinePhase } from './timeline'
import type { AcademicEntry } from './academicStore'
import type { StatModule } from './scorecardStore'
import type { StatusData } from './statusStore'
import type { ContactData } from './contactStore'

export type { Project, StackNode, TimelinePhase, AcademicEntry, StatModule, StatusData, ContactData }

export type PortfolioData = {
  projects: Project[]
  stackNodes: StackNode[]
  timeline: TimelinePhase[]
  academic: AcademicEntry[]
  scorecard: StatModule[]
  status: StatusData
  contact: ContactData
}

export type PortfolioKey = keyof PortfolioData

const STORAGE_KEYS: Record<PortfolioKey, string> = {
  projects:   'portfolio_projects',
  stackNodes: 'portfolio_stack_nodes',
  timeline:   'portfolio_timeline',
  academic:   'portfolio_academic',
  scorecard:  'portfolio_scorecard',
  status:     'portfolio_status',
  contact:    'portfolio_contact',
}

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || ''

let cache: PortfolioData | null = null
let _serverAvailable = false

export function isServerAvailable(): boolean {
  return _serverAvailable
}

async function fetchServerData(): Promise<PortfolioData | null> {
  try {
    const res = await fetch('/api/data')
    if (res.ok) {
      _serverAvailable = true
      return res.json()
    }
  } catch { /* pas d'API — mode dev ou fallback */ }
  _serverAvailable = false
  return null
}

async function postToServer(key: PortfolioKey, value: unknown): Promise<boolean> {
  if (!ADMIN_SECRET || !_serverAvailable) return false
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ key, value }),
    })
    return res.ok
  } catch { return false }
}

export async function postAllToServer(data: PortfolioData): Promise<boolean> {
  if (!ADMIN_SECRET || !_serverAvailable) return false
  try {
    const res = await fetch('/api/data/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify(data),
    })
    return res.ok
  } catch { return false }
}

function loadFromLocalStorage(key: PortfolioKey): unknown | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key])
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveToLocalStorage(key: PortfolioKey, value: unknown) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
  } catch {}
}

export function removeFromLocalStorage(key: PortfolioKey) {
  localStorage.removeItem(STORAGE_KEYS[key])
}

// ── Defaults (seed from static data) ───────────────────────────────────────────

const DEFAULT_DATA: PortfolioData = {
  projects: [
    {
      id: 'awa', number: '01', name: 'AWA',
      shortDesc: "Plateforme d'agents IA pour l'intégration administrative des ressortissants étrangers",
      fullDesc: "AWA est une plateforme d'agents IA conversationnels conçue pour les ressortissants étrangers en France, inspirée de Limova.ai. L'objectif : faciliter la transition culturelle entre la langue maternelle et le français, notamment sur le plan administratif. Le produit permet aux utilisateurs de comprendre rapidement leurs documents et démarches administratives françaises, tout en maintenant une transition fluide depuis leur langue natale — en commençant par le Bambara.",
      status: 'En cours',
      tags: ['Python', 'RAG', 'MCP', 'Data Gouv API', 'Base vectorielle', 'LLM', 'FastAPI'],
      highlights: [
        'Architecture RAG avec accès via MCP à Data Gouv',
        'Base de données vectorielles de documents et démarches administratives',
        'Interface conversationnelle multilingue (Bambara → Français)',
        'Agents spécialisés par domaine administratif (CAF, Préfecture, Sécurité sociale...)',
        'Inspiré de Limova.ai, adapté au contexte administratif français',
      ],
    },
    {
      id: 'prospection-scalefast', number: '02', name: 'Outil de Prospection Interne',
      shortDesc: 'Centralisation des campagnes Cold Calling pour une agence outbound SaaS B2B',
      fullDesc: "Chez SCALEFAST — agence outbound pour SaaS B2B IA, Data et Cyber — ma première mission a été de résoudre le chaos des centaines de fichiers CSV et XLSX pour la prospection téléphonique. J'ai conçu un outil permettant de centraliser toutes les campagnes de cold calling, détecter des patterns de succès et donner aux sales une interface terrain efficace. Construit sur Airtable pour la BDD et les interfaces, avec des automatisations n8n pour la génération et l'enrichissement des listes.",
      status: 'Complété',
      tags: ['Airtable', 'n8n', 'No-Code', 'Automatisation', 'CRM', 'Enrichissement data'],
      highlights: [
        'Remplacement de centaines de fichiers CSV/XLSX par une BDD centralisée',
        'Interface terrain dédiée pour les sessions de Cold Calling',
        'Détection automatique de patterns de succès par campagne',
        "Automatisations n8n pour la génération et l'enrichissement de listes",
        "Intégration avec les outils outbound existants de l'agence",
      ],
    },
    {
      id: 'coolbot', number: '03', name: 'CoolBot',
      shortDesc: 'Agent IA RAG pour techniciens frigoristes — accès instantané à la doc technique',
      fullDesc: "En tant qu'ancien technicien frigoriste, j'ai vécu le problème en première personne : un technicien peut perdre jusqu'à 2h par jour à chercher une information dans une documentation technique volumineuse — et parfois ne pas la trouver. CoolBot est un agent IA RAG qui donne aux techniciens un accès rapide et sécurisé à la documentation technique de leurs équipements, directement depuis le terrain. Le système crawle et indexe les documentations des fabricants pour les rendre interrogeables en langage naturel.",
      status: 'En cours',
      tags: ['Python', 'MistralAI', 'Crawl4AI', 'RAG', 'Base vectorielle', 'LangChain'],
      highlights: [
        'Réduction du temps de recherche de ~2h/jour à quelques secondes',
        'Crawl et indexation automatique des docs fabricants avec Crawl4AI',
        'Pipeline RAG avec MistralAI pour des réponses précises et sourcées',
        'Interface simple conçue pour une utilisation terrain',
        "Construit à partir d'un vécu terrain en tant que technicien frigoriste",
      ],
    },
    {
      id: 'content-engine', number: '04', name: 'Content Engine',
      shortDesc: "Système d'automatisation de contenu SEO/GEO pour YouTube et le web",
      fullDesc: "Système qui automatise la recherche de mots-clés, la génération de briefs éditoriaux et l'optimisation SEO/GEO des contenus. Combine l'analyse des tendances YouTube (via l'API), la data GSC/Semrush et des agents IA pour produire des stratégies de contenu data-driven. Conçu pour scaler la production de contenu sans sacrifier la qualité.",
      status: 'Concept',
      tags: ['Python', 'LLM', 'SEO/GEO', 'YouTube API', 'GSC', 'Semrush'],
      highlights: [
        'Recherche automatisée de mots-clés et opportunités de contenu',
        'Génération de briefs éditoriaux par IA avec contraintes SEO',
        "Pipeline d'analyse GSC + Semrush pour prioriser les sujets",
        'Dashboards de performance par chaîne et par format',
        "Architecture modulaire permettant d'ajouter de nouvelles plateformes",
      ],
    },
    {
      id: 'linkedin-automation', number: '05', name: 'LinkedIn Automation',
      shortDesc: "Pipeline d'automatisation outbound LinkedIn pour la prospection B2B SaaS",
      fullDesc: "Système d'automatisation de la prospection LinkedIn combinant enrichment de données, scoring de prospects et séquences de messages personnalisés. Construit autour de l'API LinkedIn, d'Airtable pour le CRM et de n8n pour l'orchestration des workflows. Permet de qualifier et d'engager des prospects à l'échelle tout en maintenant une approche personnalisée.",
      status: 'Concept',
      tags: ['LinkedIn API', 'n8n', 'Airtable', 'Python', 'Enrichissement data', 'CRM'],
      highlights: [
        'Enrichissement automatique des profils LinkedIn (poste, secteur, signaux)',
        'Scoring intelligent des prospects basé sur des critères métier',
        'Séquences de messages personnalisées avec templates dynamiques',
        'Dashboard de suivi des taux de réponse et conversion',
        'Intégration CRM bidirectionnelle (Airtable ↔ LinkedIn)',
      ],
    },
  ],
  stackNodes: [
    { id: 'python',     group: 'lang',      label: 'Python',           size: 14 },
    { id: 'javascript', group: 'lang',      label: 'JavaScript',       size: 8  },
    { id: 'sql',        group: 'lang',      label: 'SQL',              size: 8  },
    { id: 'html',       group: 'lang',      label: 'HTML/CSS',         size: 7  },
    { id: 'json',       group: 'lang',      label: 'JSON',             size: 6  },
    { id: 'fastapi',    group: 'framework', label: 'FastAPI',          size: 11, parent: 'python' },
    { id: 'langchain',  group: 'framework', label: 'LangChain',        size: 11, parent: 'python' },
    { id: 'pandas',     group: 'framework', label: 'Pandas',           size: 9,  parent: 'python' },
    { id: 'crawl4ai',   group: 'framework', label: 'Crawl4AI',         size: 9,  parent: 'python' },
    { id: 'flask',      group: 'framework', label: 'Flask',            size: 8,  parent: 'python' },
    { id: 'mistral',    group: 'ai',        label: 'Mistral AI',       size: 13 },
    { id: 'openai',     group: 'ai',        label: 'OpenAI',           size: 10 },
    { id: 'rag',        group: 'ai',        label: 'RAG',              size: 12 },
    { id: 'mcp',        group: 'ai',        label: 'MCP',              size: 9  },
    { id: 'vectordb',   group: 'ai',        label: 'Base vectorielle', size: 10 },
    { id: 'multiagent', group: 'ai',        label: 'Multi-agent',      size: 9  },
    { id: 'airtable',   group: 'revops',    label: 'Airtable',         size: 10 },
    { id: 'n8n',        group: 'revops',    label: 'n8n',              size: 10 },
    { id: 'semrush',    group: 'revops',    label: 'Semrush',          size: 8  },
    { id: 'gsc',        group: 'revops',    label: 'GSC',              size: 7  },
    { id: 'seo',        group: 'revops',    label: 'SEO/GEO',          size: 9  },
    { id: 'git',        group: 'devops',    label: 'Git/GitHub',       size: 9  },
    { id: 'docker',     group: 'devops',    label: 'Docker',           size: 8  },
    { id: 'notion',     group: 'devops',    label: 'Notion API',       size: 7  },
    { id: 'whatsapp',   group: 'devops',    label: 'WhatsApp API',     size: 7  },
  ],
  timeline: [
    {
      id: 'content', period: '2021 — 2024', title: 'YouTube Content Manager',
      shortTitle: 'Content',
      description: "J'accompagne des créateurs de contenu dans la production de leurs vidéos. Sélection des concepts, choix des formats, rédaction des briefs, montage vidéo, création des miniatures et publication. Une école du storytelling et de la stratégie éditoriale.",
      tags: ['Storytelling', 'Stratégie éditoriale', 'Montage vidéo', 'SEO YouTube'],
      color: 'amber', icon: '▶',
    },
    {
      id: 'sales', period: '2024 — 2025', title: 'Key Account Manager',
      company: 'Daikin', shortTitle: 'Sales',
      description: "En tant que Key Account Manager, je gère un portefeuille de comptes clés représentant +453k€ de revenus. Construction d'une base de 100+ prospects qualifiés avec données enrichies, création de supports de vente et pilotage des relations commerciales stratégiques.",
      tags: ['CRM', 'Prospection', 'Négociation', 'Data enrichissement'],
      color: 'cyan', icon: '◈',
    },
    {
      id: 'revops', period: '2025 — Aujourd\'hui', title: 'GTM & AI Engineer',
      company: 'Scalefast', shortTitle: 'RevOps / AI',
      description: "Chez Scalefast, je construis l'infrastructure scalable de l'équipe Sales & Growth. Génération de listes de prospection, création de contenu automatisée, automatisation des processus métier et déploiement de systèmes IA multi-agents.",
      tags: ['Python', 'FastAPI', 'LLM', 'Multi-agent', 'SEO/GEO', 'Automatisation'],
      color: 'green', icon: '⬡',
    },
  ],
  academic: [
    {
      id: 'bts', period: '2019 — 2021', title: 'BTS Management Commercial',
      school: 'Formation initiale',
      description: "Bases en gestion commerciale, négociation et management. Développement des compétences en relation client, stratégie commerciale et pilotage d'équipe.",
      tags: ['Commerce', 'Négociation', 'Management', 'Marketing'], color: 'amber',
    },
    {
      id: 'growth', period: '2021 — 2024', title: 'Growth & Stratégie Éditoriale',
      school: 'Auto-formation',
      description: "Maîtrise du SEO YouTube, stratégie de contenu, growth hacking et analytics. +100 vidéos produites et une compréhension fine de l'algorithme.",
      tags: ['SEO YouTube', 'Content Strategy', 'Analytics', 'Storytelling'], color: 'cyan',
    },
    {
      id: 'ai-eng', period: '2024 — Présent', title: 'IA & Ingénierie Logicielle',
      school: 'DeepLearning.AI · Anthropic · OpenAI',
      description: 'LLMs, systèmes multi-agents, Python, FastAPI et automatisation. Application directe en production chez Scalefast avec des résultats mesurables.',
      tags: ['Python', 'LLM', 'Multi-agent', 'FastAPI', 'Prompt Engineering'], color: 'green',
    },
  ],
  scorecard: [
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
  ],
  status: { label: 'Disponible · Paris', available: true },
  contact: {
    name: 'Ibrahim CISSE',
    role: 'GTM Engineer · AI Builder · Content Creator',
    photoUrl: './ibrahim.png',
    links: [
      { label: 'LinkedIn', sub: 'ibrahim-cissé', href: 'https://www.linkedin.com/in/ibrahim-ciss%C3%A9-6981b8240/', icon: 'linkedin' },
      { label: 'Réserver un call', sub: 'Notion Calendar', href: 'https://calendar.notion.so/meet/ibrahimcisse1/044on4pg6', icon: 'calendar' },
      { label: 'GitHub', sub: 'ibrahim-00223', href: 'https://github.com/ibrahim-00223', icon: 'github' },
      { label: 'YouTube', sub: '@by_ibrah07', href: 'https://youtube.com/@by_ibrah07', icon: 'youtube' },
    ],
  },
}

// ── Init / Cache ───────────────────────────────────────────────────────────────

function ensureCache(): PortfolioData {
  if (!cache) {
    cache = {
      projects:   (loadFromLocalStorage('projects')   as Project[])       ?? DEFAULT_DATA.projects,
      stackNodes: (loadFromLocalStorage('stackNodes') as StackNode[])     ?? DEFAULT_DATA.stackNodes,
      timeline:   (loadFromLocalStorage('timeline')   as TimelinePhase[]) ?? DEFAULT_DATA.timeline,
      academic:   (loadFromLocalStorage('academic')   as AcademicEntry[]) ?? DEFAULT_DATA.academic,
      scorecard:  (loadFromLocalStorage('scorecard')  as StatModule[])    ?? DEFAULT_DATA.scorecard,
      status:     (loadFromLocalStorage('status')     as StatusData)      ?? DEFAULT_DATA.status,
      contact:    (loadFromLocalStorage('contact')    as ContactData)     ?? DEFAULT_DATA.contact,
    }
  }
  return cache
}

export async function initDataStore(): Promise<void> {
  ensureCache()
  const serverData = await fetchServerData()
  if (serverData) {
    cache = { ...DEFAULT_DATA, ...serverData }
  }
}

// ── Synchronous getters ───────────────────────────────────────────────────────

export function getProjectsRaw(): Project[]       { return ensureCache().projects }
export function getStackNodesRaw(): StackNode[]   { return ensureCache().stackNodes }
export function getTimelineRaw(): TimelinePhase[] { return ensureCache().timeline }
export function getAcademicRaw(): AcademicEntry[] { return ensureCache().academic }
export function getScorecardRaw(): StatModule[]   { return ensureCache().scorecard }
export function getStatusRaw(): StatusData        { return ensureCache().status }
export function getContactRaw(): ContactData       { return ensureCache().contact }

// ── Async savers (localStorage + server) ───────────────────────────────────────

async function saveKey(key: PortfolioKey, value: unknown) {
  saveToLocalStorage(key, value)
  if (_serverAvailable) await postToServer(key, value)
}

export async function saveProjects(data: Project[]) {
  ensureCache().projects = data; await saveKey('projects', data)
}
export async function saveStackNodes(data: StackNode[]) {
  ensureCache().stackNodes = data; await saveKey('stackNodes', data)
}
export async function saveTimeline(data: TimelinePhase[]) {
  ensureCache().timeline = data; await saveKey('timeline', data)
}
export async function saveAcademic(data: AcademicEntry[]) {
  ensureCache().academic = data; await saveKey('academic', data)
}
export async function saveScorecard(data: StatModule[]) {
  ensureCache().scorecard = data; await saveKey('scorecard', data)
}
export async function saveStatus(data: StatusData) {
  ensureCache().status = data; await saveKey('status', data)
}
export async function saveContact(data: ContactData) {
  ensureCache().contact = data; await saveKey('contact', data)
}

// ── Reset (clear localStorage, keep cache as-is) ─────────────────────────────

export async function resetKey(key: PortfolioKey) {
  removeFromLocalStorage(key)
  if (cache) (cache as any)[key] = DEFAULT_DATA[key]
  // Also update server
  if (_serverAvailable && ADMIN_SECRET) {
    await postToServer(key, DEFAULT_DATA[key])
  }
}

// ── Check if any localStorage override exists (for migration banner) ─────────

export function hasLocalOverrides(): boolean {
  return STORAGE_KEYS.projects in localStorage
    || STORAGE_KEYS.stackNodes in localStorage
    || STORAGE_KEYS.timeline in localStorage
    || STORAGE_KEYS.academic in localStorage
    || STORAGE_KEYS.scorecard in localStorage
    || STORAGE_KEYS.status in localStorage
    || STORAGE_KEYS.contact in localStorage
}

export function getLocalDataForMigration(): PortfolioData {
  return {
    projects:   loadFromLocalStorage('projects')   as Project[]       ?? DEFAULT_DATA.projects,
    stackNodes: loadFromLocalStorage('stackNodes') as StackNode[]     ?? DEFAULT_DATA.stackNodes,
    timeline:   loadFromLocalStorage('timeline')   as TimelinePhase[] ?? DEFAULT_DATA.timeline,
    academic:   loadFromLocalStorage('academic')   as AcademicEntry[] ?? DEFAULT_DATA.academic,
    scorecard:  loadFromLocalStorage('scorecard')  as StatModule[]    ?? DEFAULT_DATA.scorecard,
    status:     loadFromLocalStorage('status')     as StatusData      ?? DEFAULT_DATA.status,
    contact:    loadFromLocalStorage('contact')    as ContactData     ?? DEFAULT_DATA.contact,
  }
}
