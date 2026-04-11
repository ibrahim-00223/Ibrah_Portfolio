import { motion } from 'framer-motion'
import { getProjects } from '../../../data/projectsStore'

const projects = getProjects()
import clsx from 'clsx'

const statusColors = {
  'Complété': 'text-emerald-400',
  'En cours': 'text-brand-pink',
  'Concept':  'text-text-secondary',
}

interface ProjectMenuProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ProjectMenu({ selectedId, onSelect }: ProjectMenuProps) {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((project, i) => {
        const isSelected = selectedId === project.id
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <button
              onClick={() => onSelect(isSelected ? '' : project.id)}
              className={clsx(
                'w-full text-left card px-6 py-5 group transition-all duration-200',
                isSelected && 'border-border-accent shadow-pink-glow bg-[rgba(230,0,76,0.04)]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: number + name + desc */}
                <div className="flex items-start gap-4 min-w-0">
                  <span className="text-brand-pink font-mono text-sm font-medium shrink-0 mt-0.5">
                    {project.number}
                  </span>
                  <div className="min-w-0">
                    <div className={clsx(
                      'font-semibold text-base transition-colors duration-150',
                      isSelected ? 'text-white' : 'text-text-primary group-hover:text-white'
                    )}>
                      {project.name}
                    </div>
                    <div className="text-sm text-text-secondary mt-0.5 leading-snug">
                      {project.shortDesc}
                    </div>
                  </div>
                </div>

                {/* Right: status + arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={clsx('text-xs font-mono hidden md:block', statusColors[project.status])}>
                    {project.status}
                  </span>
                  <span className={clsx(
                    'text-text-tertiary transition-all duration-200',
                    isSelected ? 'rotate-180 text-brand-pink' : 'group-hover:translate-y-0.5'
                  )}>
                    {isSelected ? '▲' : '▼'}
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
