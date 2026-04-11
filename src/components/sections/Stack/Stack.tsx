import { useRef, lazy, Suspense, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { groupLabels, groupColors } from '../../../data/stack'
import clsx from 'clsx'

const KnowledgeGraph = lazy(() =>
  import('./KnowledgeGraph').then((m) => ({ default: m.KnowledgeGraph }))
)

function GraphLoader() {
  return (
    <div className="border border-border rounded-lg bg-bg flex items-center justify-center h-64">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <div className="w-4 h-4 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
        Chargement du graphe...
      </div>
    </div>
  )
}

export function Stack() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  return (
    <section id="stack" className="py-24">
      <div className="section-inner">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow">03 — Stack</p>
          <div className="flex items-end gap-6 mb-4">
            <h2 className="font-display text-display-lg text-white">Stack</h2>
            <div className="accent-line mb-3" />
          </div>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl mb-8">
            Cartographie interactive de mes outils et technologies.
            Survolez un nœud pour voir ses connexions. Filtrez par catégorie.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter(null)}
              className={clsx(
                'px-4 py-1.5 text-sm rounded-full border transition-all duration-150',
                activeFilter === null
                  ? 'bg-brand-pink border-brand-pink text-white'
                  : 'border-border text-text-secondary hover:border-border-strong hover:text-white'
              )}
            >
              Tous
            </button>
            {Object.entries(groupLabels).map(([group, label]) => {
              const isActive = activeFilter === group
              return (
                <button
                  key={group}
                  onClick={() => setActiveFilter(isActive ? null : group)}
                  className={clsx(
                    'px-4 py-1.5 text-sm rounded-full border transition-all duration-150 flex items-center gap-2'
                  )}
                  style={{
                    backgroundColor: isActive ? `${groupColors[group]}18` : 'transparent',
                    borderColor:     isActive ? groupColors[group] : 'rgba(255,255,255,0.08)',
                    color:           isActive ? groupColors[group] : 'rgba(255,255,255,0.55)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: groupColors[group] }}
                  />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Graph */}
          <Suspense fallback={<GraphLoader />}>
            <KnowledgeGraph activeFilter={activeFilter} />
          </Suspense>
        </motion.div>
      </div>
    </section>
  )
}
