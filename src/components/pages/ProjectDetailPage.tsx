import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../../data/projects'
import clsx from 'clsx'

const statusConfig = {
  'Complété': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  'En cours': { color: 'text-brand-pink',  bg: 'bg-brand-pink/10',  border: 'border-brand-pink/20'  },
  'Concept':  { color: 'text-text-secondary', bg: 'bg-white/5', border: 'border-border' },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center section-inner pt-16">
        <p className="text-text-secondary mb-4">Projet introuvable.</p>
        <Link to="/" className="btn-ghost w-fit">← Retour</Link>
      </div>
    )
  }

  const s = statusConfig[project.status]

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="section-inner max-w-3xl">

        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors">
            ← Retour aux projets
          </Link>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={item} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-brand-pink font-mono text-sm">{project.number}</span>
              <span className={clsx(
                'text-xs font-mono px-2.5 py-1 rounded border',
                s.color, s.bg, s.border
              )}>
                {project.status}
              </span>
            </div>
            <h1 className="font-display text-display-lg text-white">{project.name}</h1>
            <p className="text-text-secondary text-lg leading-relaxed">{project.shortDesc}</p>
          </motion.div>

          <motion.div variants={item} className="divider" />

          {/* Description */}
          <motion.div variants={item} className="space-y-3">
            <h2 className="text-sm font-semibold text-text-tertiary tracking-widest uppercase">Description</h2>
            <p className="text-text-secondary leading-relaxed">{project.fullDesc}</p>
          </motion.div>

          {/* Highlights */}
          <motion.div variants={item} className="space-y-3">
            <h2 className="text-sm font-semibold text-text-tertiary tracking-widest uppercase">Points clés</h2>
            <ul className="space-y-2.5">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Stack */}
          <motion.div variants={item} className="space-y-3">
            <h2 className="text-sm font-semibold text-text-tertiary tracking-widest uppercase">Stack technique</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-pink">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="divider" />

          {/* Other projects */}
          <motion.div variants={item} className="space-y-3">
            <h2 className="text-sm font-semibold text-text-tertiary tracking-widest uppercase">Autres projets</h2>
            <div className="flex flex-wrap gap-3">
              {projects.filter((p) => p.id !== project.id).map((p) => (
                <Link key={p.id} to={`/projets/${p.id}`} className="btn-ghost text-sm">
                  {p.name} →
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
