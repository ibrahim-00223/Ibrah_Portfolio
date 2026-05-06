import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getProjects } from '../../../data/projectsStore'
import type { Project } from '../../../data/projects'

const statusConfig = {
  'Complété': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  'En cours': { color: 'text-brand-pink',  bg: 'bg-brand-pink/10',  border: 'border-brand-pink/20'  },
  'Concept':  { color: 'text-text-secondary', bg: 'bg-white/5',     border: 'border-border'          },
}

function ProjectThumbnail({ project }: { project: Project }) {
  const src = project.thumbnail
    ?? (project.youtubeId ? `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg` : null)

  if (src) {
    return (
      <img
        src={src}
        alt={project.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    )
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-bg-raised to-[#1a0a12]">
      <span className="font-mono text-brand-pink/40 text-xs tracking-widest uppercase">Projet</span>
      <span className="font-display font-bold text-white/20 text-4xl">{project.number}</span>
      <span className="font-display font-bold text-white/60 text-sm text-center px-4 leading-tight">{project.name}</span>
    </div>
  )
}

function ProjectGalleryCard({ project, index }: { project: Project; index: number }) {
  const s = statusConfig[project.status]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/projets/${project.id}`} className="group block">
        {/* Thumbnail */}
        <div
          className="relative w-full rounded-xl overflow-hidden border border-border group-hover:border-border-accent transition-all duration-300"
          style={{ aspectRatio: '16/9' }}
        >
          <ProjectThumbnail project={project} />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          {/* Number badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5">
            <span className="font-mono text-brand-pink text-xs">{project.number}</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-brand-pink transition-colors truncate">
              {project.name}
            </h3>
            <p className="text-text-tertiary text-xs mt-1 leading-snug line-clamp-2">
              {project.shortDesc}
            </p>
          </div>
          <span className={`shrink-0 text-xs font-mono px-2 py-0.5 rounded border whitespace-nowrap ${s.color} ${s.bg} ${s.border}`}>
            {project.status}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export function Projects() {
  const projects = getProjects()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="projects" className="py-24 bg-bg-surface">
      <div className="section-inner">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow">01 — Projets</p>
          <div className="flex items-end gap-6 mb-4">
            <h2 className="font-display text-display-lg text-white">Projets</h2>
            <div className="accent-line mb-3" />
          </div>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl mb-10">
            Systèmes construits à l'intersection de l'IA, de l'automatisation et du business.
            Cliquez sur un projet pour voir les détails.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectGalleryCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
