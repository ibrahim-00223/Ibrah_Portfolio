import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ProjectMenu } from './ProjectMenu'
import { ProjectCard } from './ProjectCard'
import { projects } from '../../../data/projects'

export function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const selectedProject = projects.find((p) => p.id === selectedId) ?? null

  return (
    <section id="projects" className="py-24 bg-bg-surface">
      <div className="section-inner">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow">02 — Projets</p>
          <div className="flex items-end gap-6 mb-4">
            <h2 className="font-display text-display-lg text-white">Projets</h2>
            <div className="accent-line mb-3" />
          </div>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl mb-10">
            Systèmes construits à l'intersection de l'IA, de l'automatisation et du business.
            Cliquez sur un projet pour voir les détails.
          </p>

          <ProjectMenu selectedId={selectedId} onSelect={setSelectedId} />

          <AnimatePresence>
            {selectedProject && (
              <ProjectCard key={selectedProject.id} project={selectedProject} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
