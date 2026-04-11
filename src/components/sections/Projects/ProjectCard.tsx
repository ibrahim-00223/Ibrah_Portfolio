import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../../../data/projects'

interface ProjectCardProps {
  project: Project
}

const statusConfig = {
  'Complété': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  'En cours': { color: 'text-brand-pink',  bg: 'bg-brand-pink/10',  border: 'border-brand-pink/20'  },
  'Concept':  { color: 'text-text-secondary', bg: 'bg-white/5', border: 'border-border' },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const lineItem = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const s = statusConfig[project.status]

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <motion.div
        className="mx-0 mt-1 bg-bg-raised border border-border rounded-b-lg rounded-t-none border-t-0 px-6 py-6 space-y-5"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={lineItem} className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
          <span className={`text-xs font-mono px-2.5 py-1 rounded border ${s.color} ${s.bg} ${s.border}`}>
            {project.status}
          </span>
        </motion.div>

        {/* Full description */}
        <motion.p variants={lineItem} className="text-sm text-text-secondary leading-relaxed">
          {project.fullDesc}
        </motion.p>

        {/* Highlights */}
        <motion.ul variants={lineItem} className="space-y-2">
          {project.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
              {h}
            </li>
          ))}
        </motion.ul>

        {/* Tags */}
        <motion.div variants={lineItem} className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="tag-pink">{tag}</span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={lineItem} className="pt-1">
          <Link
            to={`/projets/${project.id}`}
            className="btn-ghost text-sm"
          >
            Voir tous les détails
            <span>↗</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
