import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { getProjects, saveProjects, resetProjects, isUsingCustomProjects } from '../../data/projectsStore'
import { getTimeline, saveTimeline, resetTimeline, isUsingCustomTimeline } from '../../data/timelineStore'
import { getStackNodes, saveStack, resetStack, isUsingCustomStack } from '../../data/stackStore'
import { getStatus, saveStatus, resetStatus } from '../../data/statusStore'
import type { StatusData } from '../../data/statusStore'

import type { Project } from '../../data/projects'
import type { TimelinePhase } from '../../data/timeline'
import type { StackNode } from '../../data/stack'
import { groupLabels } from '../../data/stack'

// ── Mot de passe — modifier ici ──────────────────────────────────────────────
const ADMIN_PASSWORD = 'Ibrahim2025'
const SESSION_KEY    = 'portfolio_admin_auth'

type Tab = 'projets' | 'experiences' | 'stack' | 'statut'

// ═══════════════════════════════════════════════════════════════════════════════
// PROJETS
// ═══════════════════════════════════════════════════════════════════════════════
const STATUS_OPTIONS: Project['status'][] = ['En cours', 'Complété', 'Concept']

type ProjectFormData = {
  id: string; name: string; shortDesc: string; fullDesc: string
  status: Project['status']; tagsStr: string; highlightsStr: string
  links: { label: string; url: string }[]; youtubeId: string; thumbnail: string
}

const emptyProjectForm = (): ProjectFormData => ({
  id: '', name: '', shortDesc: '', fullDesc: '', status: 'En cours',
  tagsStr: '', highlightsStr: '', links: [], youtubeId: '', thumbnail: '',
})

const projectToForm = (p: Project): ProjectFormData => ({
  id: p.id, name: p.name, shortDesc: p.shortDesc, fullDesc: p.fullDesc,
  status: p.status, tagsStr: p.tags.join(', '),
  highlightsStr: p.highlights.join('\n'), links: p.links ? [...p.links] : [],
  youtubeId: p.youtubeId ?? '',
  thumbnail: p.thumbnail ?? '',
})

// Accepte un lien complet ou un ID brut
// https://youtu.be/dQw4w9WgXcQ → dQw4w9WgXcQ
// https://youtube.com/watch?v=dQw4w9WgXcQ → dQw4w9WgXcQ
// dQw4w9WgXcQ → dQw4w9WgXcQ
function extractYouTubeId(input: string): string {
  const s = input.trim()
  const match = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (match) return match[1]
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s
  return s
}

const formToProject = (f: ProjectFormData, index: number): Project => {
  const slug = (f.id.trim() || f.name).toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const obj: Project = {
    id: slug, number: String(index + 1).padStart(2, '0'),
    name: f.name.trim(), shortDesc: f.shortDesc.trim(), fullDesc: f.fullDesc.trim(),
    status: f.status,
    tags: f.tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    highlights: f.highlightsStr.split('\n').map(s => s.trim()).filter(Boolean),
  }
  const ytId = extractYouTubeId(f.youtubeId)
  if (ytId) obj.youtubeId = ytId
  if (f.thumbnail.trim()) obj.thumbnail = f.thumbnail.trim()
  if (f.links?.length) obj.links = f.links.filter(l => l.label || l.url)
  return obj
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPÉRIENCES
// ═══════════════════════════════════════════════════════════════════════════════
const COLOR_OPTIONS: TimelinePhase['color'][] = ['amber', 'cyan', 'green']
const COLOR_LABELS = { amber: 'Ambre (#ffb000)', cyan: 'Cyan (#00d4ff)', green: 'Rose (brand pink)' }

type ExpFormData = Omit<TimelinePhase, 'tags'> & { tagsStr: string }

const emptyExpForm = (): ExpFormData => ({
  id: '', period: '', title: '', company: '', shortTitle: '',
  description: '', tagsStr: '', color: 'amber', icon: '▶',
})

const expToForm = (e: TimelinePhase): ExpFormData => ({
  ...e, tagsStr: e.tags.join(', '), company: e.company ?? '',
})

const formToExp = (f: ExpFormData): TimelinePhase => {
  const id = (f.id.trim() || f.title).toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const obj: TimelinePhase = {
    id, period: f.period.trim(), title: f.title.trim(),
    shortTitle: f.shortTitle.trim() || f.title.trim(),
    description: f.description.trim(), color: f.color, icon: f.icon.trim() || '▶',
    tags: f.tagsStr.split(',').map(t => t.trim()).filter(Boolean),
  }
  if (f.company?.trim()) obj.company = f.company.trim()
  return obj
}

// ═══════════════════════════════════════════════════════════════════════════════
// STACK
// ═══════════════════════════════════════════════════════════════════════════════
const GROUP_OPTIONS = Object.keys(groupLabels) as StackNode['group'][]

type StackFormData = StackNode

const emptyStackForm = (): StackFormData => ({
  id: '', label: '', group: 'lang', size: 9,
})

const nodeToForm = (n: StackNode): StackFormData => ({ ...n })

// ── Les composants UI partagés (Field, StatusBanner, etc.) sont déclarés après AdminPage ──
export function AdminPage() {
  const [authed, setAuthed]   = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [pwdError, setPwdError] = useState(false)
  const [tab, setTab]         = useState<Tab>('projets')
  const [saveMsg, setSaveMsg] = useState('')

  // ── PROJETS state ──────────────────────────────────────────────────────────
  const [projects, setProjects]       = useState<Project[]>(() => getProjects())
  const [customProj, setCustomProj]   = useState(() => isUsingCustomProjects())
  const [editingProj, setEditingProj] = useState<string | null>(null)
  const [projForm, setProjForm]       = useState<ProjectFormData>(emptyProjectForm())
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── EXPÉRIENCES state ──────────────────────────────────────────────────────
  const [phases, setPhases]           = useState<TimelinePhase[]>(() => getTimeline())
  const [customExp, setCustomExp]     = useState(() => isUsingCustomTimeline())
  const [editingExp, setEditingExp]   = useState<string | null>(null)
  const [expForm, setExpForm]         = useState<ExpFormData>(emptyExpForm())

  // ── STACK state ────────────────────────────────────────────────────────────
  const [nodes, setNodes]             = useState<StackNode[]>(() => getStackNodes())
  const [customStack, setCustomStack] = useState(() => isUsingCustomStack())
  const [editingStack, setEditingStack] = useState<string | null>(null)
  const [stackForm, setStackForm]     = useState<StackFormData>(emptyStackForm())

  // ── STATUT state ───────────────────────────────────────────────────────────
  const [statusForm, setStatusForm] = useState<StatusData>(() => getStatus())

  // ── Auth ───────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1'); setAuthed(true); setPwdError(false)
    } else { setPwdError(true) }
  }
  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY); setAuthed(false); setPassword('')
  }

  const flash = (msg = 'Sauvegardé ✓') => {
    setSaveMsg(msg); setTimeout(() => setSaveMsg(''), 2500)
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PROJETS handlers
  // ════════════════════════════════════════════════════════════════════════════
  const persistProj = (updated: Project[]) => {
    saveProjects(updated); setProjects(getProjects()); setCustomProj(true); flash()
  }
  const handleProjSave = () => {
    const idx = editingProj === 'new' ? projects.length : projects.findIndex(p => p.id === editingProj)
    const updated = editingProj === 'new'
      ? [...projects, formToProject(projForm, idx)]
      : projects.map((p, i) => i === idx ? formToProject(projForm, idx) : p)
    persistProj(updated); setEditingProj(null)
  }
  const handleProjDelete = (id: string) => {
    if (!confirm(`Supprimer "${projects.find(p => p.id === id)?.name}" ?`)) return
    persistProj(projects.filter(p => p.id !== id))
  }
  const handleProjReorder = (id: string, dir: -1 | 1) => {
    const idx = projects.findIndex(p => p.id === id)
    const next = idx + dir; if (next < 0 || next >= projects.length) return
    const arr = [...projects]; [arr[idx], arr[next]] = [arr[next], arr[idx]]; persistProj(arr)
  }
  const handleProjExport = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `projets-${new Date().toISOString().slice(0,10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }
  const handleProjImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try { const p = JSON.parse(ev.target?.result as string); if (Array.isArray(p)) persistProj(p) }
      catch { alert('JSON invalide') }
    }
    reader.readAsText(file); e.target.value = ''
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EXPÉRIENCES handlers
  // ════════════════════════════════════════════════════════════════════════════
  const persistExp = (updated: TimelinePhase[]) => {
    saveTimeline(updated); setPhases(getTimeline()); setCustomExp(true); flash()
  }
  const handleExpSave = () => {
    const exp = formToExp(expForm)
    const updated = editingExp === 'new'
      ? [...phases, exp]
      : phases.map(p => p.id === editingExp ? exp : p)
    persistExp(updated); setEditingExp(null)
  }
  const handleExpDelete = (id: string) => {
    if (!confirm(`Supprimer "${phases.find(p => p.id === id)?.title}" ?`)) return
    persistExp(phases.filter(p => p.id !== id))
  }
  const handleExpReorder = (id: string, dir: -1 | 1) => {
    const idx = phases.findIndex(p => p.id === id)
    const next = idx + dir; if (next < 0 || next >= phases.length) return
    const arr = [...phases]; [arr[idx], arr[next]] = [arr[next], arr[idx]]; persistExp(arr)
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STACK handlers
  // ════════════════════════════════════════════════════════════════════════════
  const persistStack = (updatedNodes: StackNode[]) => {
    saveStack(updatedNodes)
    setNodes(getStackNodes()); setCustomStack(true); flash()
  }
  const handleStackSave = () => {
    const slug = (stackForm.id.trim() || stackForm.label).toLowerCase().trim()
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const node: StackNode = {
      id: slug,
      label: stackForm.label.trim(),
      group: stackForm.group,
      size: stackForm.size,
      ...(stackForm.parent ? { parent: stackForm.parent } : {}),
    }
    const isNew = editingStack === 'new'
    const updatedNodes = isNew
      ? [...nodes, node]
      : nodes.map(n => n.id === editingStack ? node : n)
    persistStack(updatedNodes)
    setEditingStack(null)
  }
  const handleStackDelete = (id: string) => {
    if (!confirm(`Supprimer "${nodes.find(n => n.id === id)?.label}" ?`)) return
    // Also clear parent references pointing to this node
    persistStack(
      nodes.filter(n => n.id !== id).map(n => n.parent === id ? { ...n, parent: undefined } : n)
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ÉCRAN DE CONNEXION
  // ════════════════════════════════════════════════════════════════════════════
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="card p-8 space-y-6">
            <div className="text-center space-y-1">
              <p className="text-brand-pink font-mono text-xs tracking-widest uppercase">Portfolio / Admin</p>
              <h1 className="font-display text-2xl text-white">Zone Admin</h1>
              <p className="text-text-secondary text-sm">Accès restreint</p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} value={password} autoFocus
                  onChange={e => { setPassword(e.target.value); setPwdError(false) }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Mot de passe"
                  className={clsx(
                    'w-full bg-bg-raised border rounded-lg px-4 py-3 pr-12 text-white',
                    'placeholder:text-text-tertiary text-sm focus:outline-none transition-colors',
                    pwdError ? 'border-red-500/60' : 'border-border focus:border-brand-pink/50'
                  )}
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white transition-colors text-xs">
                  {showPwd ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <AnimatePresence>
                {pwdError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-red-400 text-xs">Mot de passe incorrect</motion.p>
                )}
              </AnimatePresence>
              <button onClick={handleLogin} className="btn-primary w-full justify-center">
                Accéder à l'admin
              </button>
            </div>
            <div className="text-center">
              <Link to="/" className="text-text-tertiary text-xs hover:text-white transition-colors">
                ← Retour au portfolio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-brand-pink font-mono text-xs tracking-widest uppercase mb-1">Portfolio / Admin</p>
            <h1 className="font-display text-2xl text-white">Administration</h1>
          </div>
          <div className="flex items-center gap-4">
            {saveMsg && (
              <motion.span key={saveMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-emerald-400 text-sm font-mono">{saveMsg}</motion.span>
            )}
            <Link to="/" className="btn-ghost text-sm">← Voir le site</Link>
            <button onClick={handleLogout} className="text-text-tertiary text-sm hover:text-white transition-colors">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 border-b border-border">
          {([
            { key: 'projets',     label: 'Projets',      count: projects.length },
            { key: 'experiences', label: 'Expériences',  count: phases.length   },
            { key: 'stack',       label: 'Stack',        count: nodes.length    },
            { key: 'statut',      label: 'Statut',       count: null            },
          ] as { key: Tab; label: string; count: number | null }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={clsx(
                'px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                tab === t.key
                  ? 'text-white border-brand-pink'
                  : 'text-text-secondary border-transparent hover:text-white'
              )}>
              {t.label}
              {t.count !== null && (
                <span className={clsx(
                  'ml-2 text-xs font-mono px-1.5 py-0.5 rounded',
                  tab === t.key ? 'bg-brand-pink/20 text-brand-pink' : 'bg-white/5 text-text-tertiary'
                )}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══ ONGLET PROJETS ════════════════════════════════════════════════ */}
        {tab === 'projets' && (
          <div className="space-y-6">
            <StatusBanner custom={customProj} count={projects.length} label="projet"
              onReset={() => { resetProjects(); setProjects(getProjects()); setCustomProj(false); flash('Réinitialisé ✓') }} />

            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setProjForm(emptyProjectForm()); setEditingProj('new') }} className="btn-primary text-sm">
                + Nouveau projet
              </button>
              <button onClick={handleProjExport} className="btn-ghost text-sm">↓ Exporter JSON</button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-ghost text-sm">↑ Importer JSON</button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleProjImport} className="hidden" />
            </div>

            <AnimatePresence>
              {editingProj !== null && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="card border-brand-pink/20 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-white">
                        {editingProj === 'new' ? 'Nouveau projet' : `Modifier — ${projForm.name || '…'}`}
                      </h2>
                      <CloseBtn onClick={() => setEditingProj(null)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Nom *"><input value={projForm.name} onChange={e => setProjForm(f => ({...f, name: e.target.value}))} className="admin-input" placeholder="CoolBot" /></Field>
                      <Field label="Slug (URL)"><input value={projForm.id} onChange={e => setProjForm(f => ({...f, id: e.target.value}))} className="admin-input" placeholder="coolbot" /></Field>
                      <Field label="Statut">
                        <select value={projForm.status} onChange={e => setProjForm(f => ({...f, status: e.target.value as Project['status']}))} className="admin-input">
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="Vidéo (YouTube ou fichier direct)"><input value={projForm.youtubeId} onChange={e => setProjForm(f => ({...f, youtubeId: e.target.value}))} className="admin-input" placeholder="https://youtu.be/...  ·  /videos/demo.mp4  ·  https://cdn.../demo.webm" /></Field>
                      <Field label="Miniature (image ou URL)" className="md:col-span-2">
                        <div className="flex gap-2">
                          <input value={projForm.thumbnail} onChange={e => setProjForm(f => ({...f, thumbnail: e.target.value}))} className="admin-input flex-1" placeholder="https://... (ou upload ci-contre)" />
                          <label className="btn-ghost text-sm cursor-pointer shrink-0 flex items-center gap-1.5">
                            ↑ Upload
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const reader = new FileReader()
                              reader.onload = ev => setProjForm(f => ({...f, thumbnail: ev.target?.result as string}))
                              reader.readAsDataURL(file)
                              e.target.value = ''
                            }} />
                          </label>
                        </div>
                        {projForm.thumbnail && (
                          <div className="mt-2 w-40 rounded-lg overflow-hidden border border-border" style={{ aspectRatio: '16/9' }}>
                            <img src={projForm.thumbnail} alt="Aperçu" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          </div>
                        )}
                      </Field>
                      <Field label="Description courte *" className="md:col-span-2"><input value={projForm.shortDesc} onChange={e => setProjForm(f => ({...f, shortDesc: e.target.value}))} className="admin-input" placeholder="Une phrase résumant le projet" /></Field>
                      <Field label="Description complète *" className="md:col-span-2"><textarea value={projForm.fullDesc} onChange={e => setProjForm(f => ({...f, fullDesc: e.target.value}))} rows={4} className="admin-input resize-y" /></Field>
                      <Field label="Technologies (virgules)" className="md:col-span-2"><input value={projForm.tagsStr} onChange={e => setProjForm(f => ({...f, tagsStr: e.target.value}))} className="admin-input" placeholder="Python, FastAPI, RAG" /></Field>
                      <Field label="Points clés (1 par ligne)" className="md:col-span-2"><textarea value={projForm.highlightsStr} onChange={e => setProjForm(f => ({...f, highlightsStr: e.target.value}))} rows={4} className="admin-input resize-y" /></Field>
                    </div>
                    <Field label="Liens">
                      <div className="space-y-2">
                        {projForm.links.map((lk, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input value={lk.label} onChange={e => { const ls=[...projForm.links]; ls[i]={...ls[i],label:e.target.value}; setProjForm(f=>({...f,links:ls})) }} className="admin-input w-32" placeholder="GitHub" />
                            <input value={lk.url} onChange={e => { const ls=[...projForm.links]; ls[i]={...ls[i],url:e.target.value}; setProjForm(f=>({...f,links:ls})) }} className="admin-input flex-1" placeholder="https://..." />
                            <RemoveBtn onClick={() => setProjForm(f => ({...f, links: f.links.filter((_,j)=>j!==i)}))} />
                          </div>
                        ))}
                        <button onClick={() => setProjForm(f=>({...f,links:[...f.links,{label:'',url:''}]}))} className="text-brand-pink text-sm hover:underline">+ Lien</button>
                      </div>
                    </Field>
                    <FormActions onSave={handleProjSave} onCancel={() => setEditingProj(null)}
                      disabled={!projForm.name.trim() || !projForm.shortDesc.trim() || !projForm.fullDesc.trim()} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {projects.map((p, i) => (
                <motion.div key={p.id} layout className="card px-5 py-4 flex items-center gap-4">
                  <ReorderBtns onUp={() => handleProjReorder(p.id,-1)} onDown={() => handleProjReorder(p.id,1)} disabledUp={i===0} disabledDown={i===projects.length-1} />
                  <span className="text-brand-pink font-mono text-sm w-8 shrink-0">{String(i+1).padStart(2,'0')}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm">{p.name}</div>
                    <div className="text-text-tertiary text-xs truncate mt-0.5">{p.shortDesc}</div>
                  </div>
                  <span className={clsx('hidden sm:block text-xs font-mono px-2 py-0.5 rounded',
                    p.status==='Complété' && 'text-emerald-400 bg-emerald-400/10',
                    p.status==='En cours' && 'text-brand-pink bg-brand-pink/10',
                    p.status==='Concept'  && 'text-text-secondary bg-white/5'
                  )}>{p.status}</span>
                  <RowActions onEdit={() => { setProjForm(projectToForm(p)); setEditingProj(p.id) }} onDelete={() => handleProjDelete(p.id)} />
                </motion.div>
              ))}
              {projects.length === 0 && <EmptyState label="projet" onAdd={() => { setProjForm(emptyProjectForm()); setEditingProj('new') }} />}
            </div>
          </div>
        )}

        {/* ═══ ONGLET EXPÉRIENCES ════════════════════════════════════════════ */}
        {tab === 'experiences' && (
          <div className="space-y-6">
            <StatusBanner custom={customExp} count={phases.length} label="expérience"
              onReset={() => { resetTimeline(); setPhases(getTimeline()); setCustomExp(false); flash('Réinitialisé ✓') }} />

            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setExpForm(emptyExpForm()); setEditingExp('new') }} className="btn-primary text-sm">
                + Nouvelle expérience
              </button>
            </div>

            <AnimatePresence>
              {editingExp !== null && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="card border-brand-pink/20 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-white">
                        {editingExp === 'new' ? 'Nouvelle expérience' : `Modifier — ${expForm.title || '…'}`}
                      </h2>
                      <CloseBtn onClick={() => setEditingExp(null)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Intitulé du poste *"><input value={expForm.title} onChange={e => setExpForm(f=>({...f,title:e.target.value}))} className="admin-input" placeholder="GTM & AI Engineer" /></Field>
                      <Field label="Entreprise"><input value={expForm.company ?? ''} onChange={e => setExpForm(f=>({...f,company:e.target.value}))} className="admin-input" placeholder="Scalefast (optionnel)" /></Field>
                      <Field label="Période *"><input value={expForm.period} onChange={e => setExpForm(f=>({...f,period:e.target.value}))} className="admin-input" placeholder="2025 — Aujourd'hui" /></Field>
                      <Field label="Titre court (mobile)"><input value={expForm.shortTitle} onChange={e => setExpForm(f=>({...f,shortTitle:e.target.value}))} className="admin-input" placeholder="RevOps / AI" /></Field>
                      <Field label="Couleur">
                        <select value={expForm.color} onChange={e => setExpForm(f=>({...f,color:e.target.value as TimelinePhase['color']}))} className="admin-input">
                          {COLOR_OPTIONS.map(c => <option key={c} value={c}>{COLOR_LABELS[c]}</option>)}
                        </select>
                      </Field>
                      <Field label="Icône (unicode)"><input value={expForm.icon} onChange={e => setExpForm(f=>({...f,icon:e.target.value}))} className="admin-input" placeholder="▶  ◈  ⬡  ★  ◆" /></Field>
                      <Field label="Description *" className="md:col-span-2"><textarea value={expForm.description} onChange={e => setExpForm(f=>({...f,description:e.target.value}))} rows={3} className="admin-input resize-y" /></Field>
                      <Field label="Compétences (virgules)" className="md:col-span-2"><input value={expForm.tagsStr} onChange={e => setExpForm(f=>({...f,tagsStr:e.target.value}))} className="admin-input" placeholder="Python, LLM, Automatisation" /></Field>
                      <Field label="Slug (ID)"><input value={expForm.id} onChange={e => setExpForm(f=>({...f,id:e.target.value}))} className="admin-input" placeholder="revops (auto depuis le titre)" /></Field>
                    </div>
                    <FormActions onSave={handleExpSave} onCancel={() => setEditingExp(null)}
                      disabled={!expForm.title.trim() || !expForm.period.trim() || !expForm.description.trim()} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {phases.map((p, i) => {
                const dotColor = p.color === 'amber' ? '#ffb000' : p.color === 'cyan' ? '#00d4ff' : '#E6004C'
                return (
                  <motion.div key={p.id} layout className="card px-5 py-4 flex items-center gap-4">
                    <ReorderBtns onUp={() => handleExpReorder(p.id,-1)} onDown={() => handleExpReorder(p.id,1)} disabledUp={i===0} disabledDown={i===phases.length-1} />
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: dotColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">{p.title}{p.company && <span className="text-text-tertiary ml-2 text-xs font-mono">@ {p.company}</span>}</div>
                      <div className="text-text-tertiary text-xs mt-0.5">{p.period}</div>
                    </div>
                    <RowActions onEdit={() => { setExpForm(expToForm(p)); setEditingExp(p.id) }} onDelete={() => handleExpDelete(p.id)} />
                  </motion.div>
                )
              })}
              {phases.length === 0 && <EmptyState label="expérience" onAdd={() => { setExpForm(emptyExpForm()); setEditingExp('new') }} />}
            </div>
          </div>
        )}

        {/* ═══ ONGLET STACK ══════════════════════════════════════════════════ */}
        {tab === 'stack' && (
          <div className="space-y-6">
            <StatusBanner custom={customStack} count={nodes.length} label="technologie"
              onReset={() => { resetStack(); setNodes(getStackNodes()); setCustomStack(false); flash('Réinitialisé ✓') }} />

            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setStackForm(emptyStackForm()); setEditingStack('new') }} className="btn-primary text-sm">
                + Nouvelle techno
              </button>
            </div>

            <AnimatePresence>
              {editingStack !== null && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="card border-brand-pink/20 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-white">
                        {editingStack === 'new' ? 'Nouvelle technologie' : `Modifier — ${stackForm.label || '…'}`}
                      </h2>
                      <CloseBtn onClick={() => setEditingStack(null)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Nom *"><input value={stackForm.label} onChange={e => setStackForm(f=>({...f,label:e.target.value}))} className="admin-input" placeholder="LangChain" /></Field>
                      <Field label="Catégorie">
                        <select value={stackForm.group} onChange={e => setStackForm(f=>({...f,group:e.target.value as StackNode['group']}))} className="admin-input">
                          {GROUP_OPTIONS.map(g => <option key={g} value={g}>{groupLabels[g]}</option>)}
                        </select>
                      </Field>
                      <Field label={`Taille du nœud (${stackForm.size})`}>
                        <input type="range" min={6} max={14} value={stackForm.size} onChange={e => setStackForm(f=>({...f,size:+e.target.value}))} className="w-full accent-brand-pink" />
                      </Field>
                      <Field label="Slug (ID)"><input value={stackForm.id} onChange={e => setStackForm(f=>({...f,id:e.target.value}))} className="admin-input" placeholder="langchain (auto depuis le nom)" /></Field>
                      <Field label="Nœud parent (optionnel)">
                        <select
                          value={stackForm.parent ?? ''}
                          onChange={e => setStackForm(f => ({ ...f, parent: e.target.value || undefined }))}
                          className="admin-input"
                        >
                          <option value="">— Aucun parent (nœud racine) —</option>
                          {nodes
                            .filter(n => n.id !== (editingStack === 'new' ? '' : editingStack))
                            .map(n => (
                              <option key={n.id} value={n.id}>
                                [{groupLabels[n.group]}] {n.label}
                              </option>
                            ))
                          }
                        </select>
                        <p className="text-text-tertiary text-xs mt-1">Choisir un parent crée automatiquement le lien dans l'arbre.</p>
                      </Field>
                    </div>
                    <FormActions onSave={handleStackSave} onCancel={() => setEditingStack(null)} disabled={!stackForm.label.trim()} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nodes groupés par catégorie */}
            {GROUP_OPTIONS.map(group => {
              const groupNodes = nodes.filter(n => n.group === group)
              if (groupNodes.length === 0) return null
              return (
                <div key={group} className="space-y-2">
                  <p className="text-text-tertiary text-xs font-mono tracking-widest uppercase">{groupLabels[group]}</p>
                  {groupNodes.map(n => (
                    <motion.div key={n.id} layout className="card px-5 py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm">{n.label}</div>
                        <div className="text-text-tertiary text-xs mt-0.5 font-mono">
                          id: {n.id} · size: {n.size}{n.parent ? ` · parent: ${n.parent}` : ''}
                        </div>
                      </div>
                      <RowActions onEdit={() => { setStackForm(nodeToForm(n)); setEditingStack(n.id) }} onDelete={() => handleStackDelete(n.id)} />
                    </motion.div>
                  ))}
                </div>
              )
            })}
            {nodes.length === 0 && <EmptyState label="technologie" onAdd={() => { setStackForm(emptyStackForm()); setEditingStack('new') }} />}
          </div>
        )}

        {/* ═══ ONGLET STATUT ════════════════════════════════════════════════ */}
        {tab === 'statut' && (
          <div className="space-y-6 max-w-md">
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-white">Badge de disponibilité</h2>

              <Field label="Texte du badge">
                <input
                  value={statusForm.label}
                  onChange={e => setStatusForm(f => ({ ...f, label: e.target.value }))}
                  className="admin-input"
                  placeholder="Disponible · Paris"
                />
              </Field>

              <Field label="Statut">
                <div className="flex gap-3">
                  {[
                    { value: true,  label: '🟢 Disponible' },
                    { value: false, label: '⚫ Non disponible' },
                  ].map(opt => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setStatusForm(f => ({ ...f, available: opt.value }))}
                      className={clsx(
                        'flex-1 py-2 px-3 rounded-lg border text-sm transition-all',
                        statusForm.available === opt.value
                          ? 'border-brand-pink bg-brand-pink/10 text-white'
                          : 'border-border text-text-secondary hover:text-white'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Aperçu */}
              <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-full px-3 py-1.5 w-fit">
                <span className={`w-2 h-2 rounded-full ${statusForm.available ? 'bg-brand-pink' : 'bg-white/30'}`} />
                <span className="text-xs text-text-secondary whitespace-nowrap">{statusForm.label || 'Aperçu…'}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { saveStatus(statusForm); flash('Statut sauvegardé ✓') }}
                  className="btn-primary text-sm"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => { resetStatus(); setStatusForm(getStatus()); flash('Réinitialisé ✓') }}
                  className="btn-ghost text-sm"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-text-tertiary text-xs text-center pb-4">
          Données sauvegardées dans ce navigateur (localStorage).
        </p>
      </div>
    </div>
  )
}

// ── Petits composants UI réutilisables ───────────────────────────────────────
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      <label className="block text-text-tertiary text-xs font-medium tracking-widest uppercase">{label}</label>
      {children}
    </div>
  )
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-text-tertiary hover:text-white transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
  )
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-text-tertiary hover:text-red-400 transition-colors w-7 h-7 flex items-center justify-center text-lg">×</button>
  )
}

function ReorderBtns({ onUp, onDown, disabledUp, disabledDown }: { onUp: () => void; onDown: () => void; disabledUp: boolean; disabledDown: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <button onClick={onUp} disabled={disabledUp} className="text-text-tertiary hover:text-white disabled:opacity-20 transition-colors text-xs leading-none py-0.5">▲</button>
      <button onClick={onDown} disabled={disabledDown} className="text-text-tertiary hover:text-white disabled:opacity-20 transition-colors text-xs leading-none py-0.5">▼</button>
    </div>
  )
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button onClick={onEdit} className="btn-ghost text-xs py-1 px-3">Modifier</button>
      <button onClick={onDelete} className="text-xs text-text-tertiary hover:text-red-400 border border-border hover:border-red-500/30 rounded px-3 py-1 transition-colors">Suppr.</button>
    </div>
  )
}

function FormActions({ onSave, onCancel, disabled }: { onSave: () => void; onCancel: () => void; disabled: boolean }) {
  return (
    <div className="flex gap-3 pt-1">
      <button onClick={onSave} disabled={disabled} className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed">Sauvegarder</button>
      <button onClick={onCancel} className="btn-ghost text-sm">Annuler</button>
    </div>
  )
}

function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="text-center py-16 text-text-secondary text-sm">
      Aucun(e) {label}.{' '}
      <button onClick={onAdd} className="text-brand-pink hover:underline">Ajouter →</button>
    </div>
  )
}

function StatusBanner({ custom, count, label, onReset }: { custom: boolean; count: number; label: string; onReset: () => void }) {
  return (
    <div className={clsx(
      'flex flex-wrap items-center justify-between gap-3 border rounded-lg px-4 py-3 text-sm',
      custom ? 'border-brand-pink/25 bg-brand-pink/5 text-brand-pink'
             : 'border-border bg-white/[0.03] text-text-secondary'
    )}>
      <span>
        {custom
          ? `✎  Mode personnalisé — ${count} ${label}(s) dans ce navigateur`
          : `◈  Mode par défaut — ${count} ${label}(s) codés en dur`}
      </span>
      {custom && (
        <button onClick={onReset} className="text-xs text-text-tertiary hover:text-white border border-border rounded px-2.5 py-1 transition-colors">
          Remettre par défaut
        </button>
      )}
    </div>
  )
}
