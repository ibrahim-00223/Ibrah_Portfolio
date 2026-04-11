import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { getProjects, saveProjects, resetProjects, isUsingCustomProjects } from '../../data/projectsStore'
import type { Project } from '../../data/projects'

// ── Changer le mot de passe ici ──────────────────────────────────────────────
const ADMIN_PASSWORD = 'Ibrahim2025'
const SESSION_KEY = 'portfolio_admin_auth'

const STATUS_OPTIONS: Project['status'][] = ['En cours', 'Complété', 'Concept']

// ── Types formulaire ─────────────────────────────────────────────────────────
type FormData = Omit<Project, 'number' | 'tags' | 'highlights'> & {
  tagsStr: string
  highlightsStr: string
}

function emptyForm(): FormData {
  return {
    id: '', name: '', shortDesc: '', fullDesc: '',
    status: 'En cours',
    tagsStr: '', highlightsStr: '',
    links: [], youtubeId: '',
  }
}

function projectToForm(p: Project): FormData {
  return {
    id: p.id, name: p.name, shortDesc: p.shortDesc, fullDesc: p.fullDesc,
    status: p.status,
    tagsStr: p.tags.join(', '),
    highlightsStr: p.highlights.join('\n'),
    links: p.links ? [...p.links] : [],
    youtubeId: p.youtubeId ?? '',
  }
}

function formToProject(f: FormData, index: number): Project {
  const slug = (f.id.trim() || f.name)
    .toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const obj: Project = {
    id: slug,
    number: String(index + 1).padStart(2, '0'),
    name: f.name.trim(),
    shortDesc: f.shortDesc.trim(),
    fullDesc: f.fullDesc.trim(),
    status: f.status,
    tags: f.tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    highlights: f.highlightsStr.split('\n').map(s => s.trim()).filter(Boolean),
  }
  if (f.youtubeId?.trim()) obj.youtubeId = f.youtubeId.trim()
  if (f.links && f.links.length > 0) obj.links = f.links.filter(l => l.label || l.url)
  return obj
}

// ── Composant champ formulaire ───────────────────────────────────────────────
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      <label className="block text-text-tertiary text-xs font-medium tracking-widest uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────────────────
export function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [pwdError, setPwdError] = useState(false)

  const [projects, setProjects] = useState<Project[]>(() => getProjects())
  const [customMode, setCustomMode] = useState(() => isUsingCustomProjects())
  const [editing, setEditing] = useState<string | null>(null)   // id projet ou 'new'
  const [form, setForm] = useState<FormData>(emptyForm())
  const [saveMsg, setSaveMsg] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true); setPwdError(false)
    } else {
      setPwdError(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false); setPassword('')
  }

  // ── Persistence ───────────────────────────────────────────────────────────
  const persist = (updated: Project[]) => {
    saveProjects(updated)
    const fresh = getProjects()
    setProjects(fresh)
    setCustomMode(true)
    setSaveMsg('Sauvegardé ✓')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const startNew = () => { setForm(emptyForm()); setEditing('new') }
  const startEdit = (p: Project) => { setForm(projectToForm(p)); setEditing(p.id) }
  const cancelEdit = () => setEditing(null)

  const handleSave = () => {
    const idx = editing === 'new'
      ? projects.length
      : projects.findIndex(p => p.id === editing)
    const project = formToProject(form, idx)
    const updated = editing === 'new'
      ? [...projects, project]
      : projects.map((p, i) => i === idx ? project : p)
    persist(updated)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm(`Supprimer le projet "${projects.find(p => p.id === id)?.name}" ?`)) return
    persist(projects.filter(p => p.id !== id))
  }

  const handleReorder = (id: string, dir: -1 | 1) => {
    const idx = projects.findIndex(p => p.id === id)
    const next = idx + dir
    if (next < 0 || next >= projects.length) return
    const arr = [...projects]
    ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
    persist(arr)
  }

  // ── Import / Export ───────────────────────────────────────────────────────
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projets-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        if (Array.isArray(parsed)) persist(parsed)
        else alert('Format invalide — attendu un tableau JSON')
      } catch { alert('Fichier JSON invalide') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (!confirm('Remettre tous les projets par défaut ? Vos modifications seront perdues.')) return
    resetProjects()
    setProjects(getProjects())
    setCustomMode(false)
    setSaveMsg('Réinitialisé ✓')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  // ── Liens dans le formulaire ──────────────────────────────────────────────
  const addLink = () => setForm(f => ({ ...f, links: [...(f.links ?? []), { label: '', url: '' }] }))
  const removeLink = (i: number) => setForm(f => ({ ...f, links: (f.links ?? []).filter((_, j) => j !== i) }))
  const updateLink = (i: number, field: 'label' | 'url', val: string) =>
    setForm(f => {
      const links = [...(f.links ?? [])]; links[i] = { ...links[i], [field]: val }
      return { ...f, links }
    })

  // ── Écran de connexion ────────────────────────────────────────────────────
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
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPwdError(false) }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Mot de passe"
                  autoFocus
                  className={clsx(
                    'w-full bg-bg-raised border rounded-lg px-4 py-3 pr-12',
                    'text-white placeholder:text-text-tertiary text-sm',
                    'focus:outline-none transition-colors',
                    pwdError ? 'border-red-500/60 focus:border-red-500' : 'border-border focus:border-brand-pink/50'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white transition-colors text-xs select-none"
                >
                  {showPwd ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              <AnimatePresence>
                {pwdError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-red-400 text-xs">
                    Mot de passe incorrect
                  </motion.p>
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

  // ── Dashboard admin ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-brand-pink font-mono text-xs tracking-widest uppercase mb-1">Portfolio / Admin</p>
            <h1 className="font-display text-2xl text-white">Gestion des projets</h1>
          </div>
          <div className="flex items-center gap-4">
            {saveMsg && (
              <motion.span key={saveMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-emerald-400 text-sm font-mono">
                {saveMsg}
              </motion.span>
            )}
            <Link to="/" className="btn-ghost text-sm">← Voir le site</Link>
            <button onClick={handleLogout} className="text-text-tertiary text-sm hover:text-white transition-colors">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Bandeau mode */}
        <div className={clsx(
          'flex flex-wrap items-center justify-between gap-3 border rounded-lg px-4 py-3 text-sm',
          customMode
            ? 'border-brand-pink/25 bg-brand-pink/5 text-brand-pink'
            : 'border-border bg-white/[0.03] text-text-secondary'
        )}>
          <span>
            {customMode
              ? `✎  Mode personnalisé — ${projects.length} projet(s) sauvegardé(s) dans ce navigateur`
              : `◈  Mode par défaut — ${projects.length} projet(s) codés en dur`}
          </span>
          {customMode && (
            <button onClick={handleReset}
              className="text-xs text-text-tertiary hover:text-white border border-border rounded px-2.5 py-1 transition-colors">
              Remettre par défaut
            </button>
          )}
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={startNew} className="btn-primary text-sm">+ Nouveau projet</button>
          <button onClick={handleExport} className="btn-ghost text-sm">↓ Exporter JSON</button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-ghost text-sm">↑ Importer JSON</button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>

        {/* Formulaire add/edit */}
        <AnimatePresence>
          {editing !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
            >
              <div className="card border-brand-pink/20 p-6 space-y-6">
                {/* Titre formulaire */}
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white">
                    {editing === 'new' ? 'Nouveau projet' : `Modifier — ${form.name || '…'}`}
                  </h2>
                  <button onClick={cancelEdit}
                    className="text-text-tertiary hover:text-white transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center">
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Nom *">
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="admin-input" placeholder="CoolBot" />
                  </Field>

                  <Field label="Slug (URL)">
                    <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                      className="admin-input" placeholder="coolbot  (auto depuis le nom)" />
                  </Field>

                  <Field label="Statut">
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Project['status'] }))}
                      className="admin-input">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>

                  <Field label="YouTube ID (optionnel)">
                    <input value={form.youtubeId ?? ''} onChange={e => setForm(f => ({ ...f, youtubeId: e.target.value }))}
                      className="admin-input" placeholder="dQw4w9WgXcQ" />
                  </Field>

                  <Field label="Description courte *" className="md:col-span-2">
                    <input value={form.shortDesc} onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))}
                      className="admin-input" placeholder="Une phrase qui résume le projet" />
                  </Field>

                  <Field label="Description complète *" className="md:col-span-2">
                    <textarea value={form.fullDesc} onChange={e => setForm(f => ({ ...f, fullDesc: e.target.value }))}
                      rows={4} className="admin-input resize-y"
                      placeholder="Contexte, problème résolu, approche technique..." />
                  </Field>

                  <Field label="Technologies (séparées par des virgules)" className="md:col-span-2">
                    <input value={form.tagsStr} onChange={e => setForm(f => ({ ...f, tagsStr: e.target.value }))}
                      className="admin-input" placeholder="Python, FastAPI, RAG, LangChain" />
                  </Field>

                  <Field label="Points clés (un par ligne)" className="md:col-span-2">
                    <textarea value={form.highlightsStr} onChange={e => setForm(f => ({ ...f, highlightsStr: e.target.value }))}
                      rows={4} className="admin-input resize-y"
                      placeholder={"Architecture RAG optimisée\nInterface terrain dédiée\nRéduction du temps de recherche de 2h à quelques secondes"} />
                  </Field>
                </div>

                {/* Liens */}
                <Field label="Liens (optionnel)">
                  <div className="space-y-2">
                    {(form.links ?? []).map((link, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input value={link.label} onChange={e => updateLink(i, 'label', e.target.value)}
                          className="admin-input w-36" placeholder="GitHub" />
                        <input value={link.url} onChange={e => updateLink(i, 'url', e.target.value)}
                          className="admin-input flex-1" placeholder="https://github.com/..." />
                        <button onClick={() => removeLink(i)}
                          className="text-text-tertiary hover:text-red-400 transition-colors w-7 h-7 flex items-center justify-center text-lg leading-none">
                          ×
                        </button>
                      </div>
                    ))}
                    <button onClick={addLink} className="text-brand-pink text-sm hover:underline">
                      + Ajouter un lien
                    </button>
                  </div>
                </Field>

                {/* Actions formulaire */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={!form.name.trim() || !form.shortDesc.trim() || !form.fullDesc.trim()}
                    className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Sauvegarder
                  </button>
                  <button onClick={cancelEdit} className="btn-ghost text-sm">Annuler</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des projets */}
        <div className="space-y-2">
          {projects.map((p, i) => (
            <motion.div key={p.id} layout className="card px-5 py-4 flex items-center gap-4">
              {/* Boutons réorganisation */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleReorder(p.id, -1)} disabled={i === 0}
                  className="text-text-tertiary hover:text-white disabled:opacity-20 transition-colors text-xs leading-none py-0.5">
                  ▲
                </button>
                <button onClick={() => handleReorder(p.id, 1)} disabled={i === projects.length - 1}
                  className="text-text-tertiary hover:text-white disabled:opacity-20 transition-colors text-xs leading-none py-0.5">
                  ▼
                </button>
              </div>

              <span className="text-brand-pink font-mono text-sm w-8 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm leading-snug">{p.name}</div>
                <div className="text-text-tertiary text-xs truncate mt-0.5">{p.shortDesc}</div>
              </div>

              <span className={clsx(
                'hidden sm:block text-xs font-mono px-2 py-0.5 rounded',
                p.status === 'Complété' && 'text-emerald-400 bg-emerald-400/10',
                p.status === 'En cours' && 'text-brand-pink bg-brand-pink/10',
                p.status === 'Concept'  && 'text-text-secondary bg-white/5',
              )}>
                {p.status}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(p)} className="btn-ghost text-xs py-1 px-3">
                  Modifier
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="text-xs text-text-tertiary hover:text-red-400 border border-border hover:border-red-500/30 rounded px-3 py-1 transition-colors">
                  Suppr.
                </button>
              </div>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-16 text-text-secondary text-sm">
              Aucun projet.{' '}
              <button onClick={startNew} className="text-brand-pink hover:underline">
                Ajouter le premier →
              </button>
            </div>
          )}
        </div>

        <p className="text-text-tertiary text-xs text-center pb-4">
          Projets sauvegardés dans ce navigateur (localStorage).
          Utilisez <strong className="text-text-secondary">Exporter</strong> pour créer une sauvegarde
          et <strong className="text-text-secondary">Importer</strong> pour la restaurer sur un autre appareil.
        </p>
      </div>
    </div>
  )
}
