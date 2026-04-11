// scripts/sync-from-notion.mjs
// Synchronise les projets depuis Notion → src/data/projects.ts
// Exécuté automatiquement au moment du build Railway.
// Usage local : npm run sync

import { Client } from '@notionhq/client'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const NOTION_API_KEY = process.env.NOTION_API_KEY
const DB_ID = process.env.NOTION_PROJECTS_DB_ID

// ── Pas de clés → skip silencieux (dev local sans .env) ──────────────────────
if (!NOTION_API_KEY || !DB_ID) {
  console.warn('⚠  NOTION_API_KEY ou NOTION_PROJECTS_DB_ID non trouvée — sync ignoré, projects.ts inchangé')
  process.exit(0)
}

const notion = new Client({ auth: NOTION_API_KEY })

// Concatène tous les chunks rich_text (Notion limite à 2000 chars par chunk)
function getText(prop) {
  return (prop?.rich_text ?? []).map(r => r.plain_text).join('') || ''
}

// Parse le champ Liens (JSON string → tableau d'objets)
function parseLinks(raw) {
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    // JSON malformé → on ignore
  }
  return undefined
}

// ── Fetch paginé (supporte >100 projets) ─────────────────────────────────────
console.log('Connexion à Notion...')
let allPages = []
let cursor = undefined
do {
  const res = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: 'Publié', checkbox: { equals: true } },
    sorts: [{ property: 'Ordre', direction: 'ascending' }],
    start_cursor: cursor,
    page_size: 100,
  })
  allPages.push(...res.results)
  cursor = res.next_cursor ?? undefined
} while (cursor)

console.log(`${allPages.length} projet(s) publié(s) récupéré(s)`)

// ── Garde-fou : ne pas écraser si aucun projet publié ────────────────────────
if (allPages.length === 0) {
  console.warn('⚠  Aucun projet avec "Publié" coché trouvé — projects.ts inchangé')
  process.exit(0)
}

// ── Transformation Notion → objets Project ───────────────────────────────────
const projects = allPages.map((page, index) => {
  const p = page.properties

  const id = getText(p['Slug'])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const youtubeId = getText(p['YouTube ID']) || undefined
  const links     = parseLinks(getText(p['Liens']))

  const obj = {
    id,
    number:    String(index + 1).padStart(2, '0'),
    name:      p['Nom']?.title?.[0]?.plain_text ?? '',
    shortDesc: getText(p['Description courte']),
    fullDesc:  getText(p['Description complète']),
    status:    p['Statut']?.select?.name ?? 'Concept',
    tags:      (p['Technologies']?.multi_select ?? []).map(o => o.name),
    highlights: getText(p['Points clés'])
                  .split('\n')
                  .map(s => s.trim())
                  .filter(Boolean),
  }

  if (links)     obj.links     = links
  if (youtubeId) obj.youtubeId = youtubeId

  return obj
})

// ── Génération du fichier TypeScript ─────────────────────────────────────────
const output = `// AUTO-GENERATED par scripts/sync-from-notion.mjs — NE PAS ÉDITER MANUELLEMENT
// Dernière sync : ${new Date().toISOString()}
// Pour modifier les projets, rendez-vous sur Notion puis redéployez sur Railway.

export type Project = {
  id: string
  number: string
  name: string
  shortDesc: string
  fullDesc: string
  status: 'Complété' | 'En cours' | 'Concept'
  tags: string[]
  highlights: string[]
  links?: { label: string; url: string }[]
  youtubeId?: string
}

export const projects: Project[] = ${JSON.stringify(projects, null, 2)}
`

const outputPath = resolve(ROOT, 'src/data/projects.ts')
writeFileSync(outputPath, output, 'utf-8')
console.log(`✓ src/data/projects.ts mis à jour avec ${projects.length} projet(s)`)
