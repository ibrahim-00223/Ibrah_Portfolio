import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import clsx from 'clsx'
import { getTimeline } from '../../../data/timelineStore'

const colorMap = {
  amber: { dot: 'bg-[#ffb000]', text: 'text-[#ffb000]', border: 'border-[#ffb000]' },
  cyan:  { dot: 'bg-[#00d4ff]', text: 'text-[#00d4ff]', border: 'border-[#00d4ff]' },
  green: { dot: 'bg-brand-pink', text: 'text-brand-pink', border: 'border-brand-pink' },
}

export function CareerTimeline() {
  const timelinePhases = getTimeline()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="relative">
      {/* Desktop: horizontal */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        {timelinePhases.map((phase, i) => {
          const c = colorMap[phase.color]
          return (
            <motion.div
              key={phase.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {i < timelinePhases.length - 1 && (
                <motion.div
                  className="absolute top-5 left-full w-full h-px bg-border-strong origin-left z-0"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.3 }}
                />
              )}
              <div className="card p-6 relative z-10 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className={clsx('w-3 h-3 rounded-full flex-shrink-0', c.dot)} />
                  <span className="text-xs font-mono text-text-tertiary">{phase.period}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white leading-snug">{phase.title}</div>
                  {phase.company && (
                    <div className={clsx('text-xs font-mono mt-0.5', c.text)}>@ {phase.company}</div>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">{phase.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {phase.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden flex flex-col gap-0">
        {timelinePhases.map((phase, i) => {
          const c = colorMap[phase.color]
          const isLast = i === timelinePhases.length - 1
          return (
            <motion.div
              key={phase.id}
              className="flex gap-4"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="flex flex-col items-center pt-1.5">
                <div className={clsx('w-3 h-3 rounded-full flex-shrink-0', c.dot)} />
                {!isLast && <div className="w-px flex-1 bg-border my-1" />}
              </div>
              <div className={clsx('pb-6 flex-1', isLast && 'pb-0')}>
                <span className="text-xs font-mono text-text-tertiary">{phase.period}</span>
                <div className="text-sm font-semibold text-white mt-1">{phase.title}</div>
                {phase.company && (
                  <div className={clsx('text-xs font-mono', c.text)}>@ {phase.company}</div>
                )}
                <p className="text-sm text-text-secondary leading-relaxed mt-2">{phase.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {phase.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
