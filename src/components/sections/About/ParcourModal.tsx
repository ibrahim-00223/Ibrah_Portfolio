import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTimeline } from '../../../data/timelineStore'
import { getAcademic } from '../../../data/academicStore'

type Tab = 'experiences' | 'academic'

const colorMap = {
  amber: { dot: 'bg-[#ffb000]', line: 'bg-[#ffb000]/30', text: 'text-[#ffb000]', period: 'text-[#ffb000]/60' },
  cyan:  { dot: 'bg-[#00d4ff]', line: 'bg-[#00d4ff]/30', text: 'text-[#00d4ff]', period: 'text-[#00d4ff]/60' },
  green: { dot: 'bg-brand-pink', line: 'bg-brand-pink/30', text: 'text-brand-pink', period: 'text-brand-pink/60' },
}

function Timeline<T extends { color: 'amber' | 'cyan' | 'green' }>({
  items,
  renderContent,
}: {
  items: T[]
  renderContent: (item: T, c: typeof colorMap['amber']) => React.ReactNode
}) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/8" />

      <div className="space-y-0">
        {items.map((item, i) => {
          const c = colorMap[item.color]
          const isLast = i === items.length - 1
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="flex gap-5"
            >
              {/* Timeline dot + connector */}
              <div className="flex flex-col items-center shrink-0" style={{ width: 16 }}>
                <div className={`w-3.5 h-3.5 rounded-full border-2 border-current mt-1 shrink-0 ${c.dot}`}
                  style={{ boxShadow: `0 0 8px currentColor` }} />
                {!isLast && <div className={`w-px flex-1 mt-1 ${c.line}`} style={{ minHeight: 24 }} />}
              </div>

              {/* Content */}
              <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-6'}`}>
                {renderContent(item, c)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ParcourModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('experiences')
  const phases  = getTimeline()
  const academic = getAcademic()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-border overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0d0d1a 0%, #12080f 60%, #0d0d1a 100%)',
                boxShadow: '0 0 0 1px rgba(230,0,76,0.15), 0 32px 80px rgba(0,0,0,0.8)',
              }}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                <div>
                  <p className="text-[10px] font-mono text-brand-pink/60 tracking-widest uppercase mb-0.5">Ibrahim CISSE</p>
                  <h2 className="font-display font-bold text-white text-lg">Mon Parcours</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-white/40 hover:text-white hover:border-border-accent transition-colors text-sm"
                >✕</button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 px-6 pb-4 shrink-0">
                {([
                  { id: 'experiences' as Tab, label: 'Expériences Pro' },
                  { id: 'academic' as Tab, label: 'Parcours Académique' },
                ]).map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wide transition-all duration-150 ${
                      tab === id
                        ? 'bg-brand-pink/15 border border-brand-pink/40 text-brand-pink'
                        : 'border border-border text-white/40 hover:text-white/70 hover:border-border-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="h-px bg-white/5 shrink-0" />

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                <AnimatePresence mode="wait">

                  {tab === 'experiences' && (
                    <motion.div key="exp"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Timeline
                        items={phases}
                        renderContent={(phase, c) => (
                          <>
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <div>
                                <p className="font-semibold text-white text-sm leading-snug">{phase.title}</p>
                                {phase.company && (
                                  <p className={`text-xs font-mono mt-0.5 ${c.text}`}>@ {phase.company}</p>
                                )}
                              </div>
                              <span className={`text-[11px] font-mono shrink-0 mt-0.5 ${c.period}`}>{phase.period}</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed mb-3">{phase.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {phase.tags.map((tag) => (
                                <span key={tag} className="tag text-[11px]">{tag}</span>
                              ))}
                            </div>
                          </>
                        )}
                      />
                    </motion.div>
                  )}

                  {tab === 'academic' && (
                    <motion.div key="acad"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Timeline
                        items={academic}
                        renderContent={(item, c) => (
                          <>
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <div>
                                <p className="font-semibold text-white text-sm leading-snug">{item.title}</p>
                                <p className={`text-xs font-mono mt-0.5 ${c.text}`}>{item.school}</p>
                              </div>
                              <span className={`text-[11px] font-mono shrink-0 mt-0.5 ${c.period}`}>{item.period}</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed mb-3">{item.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.tags.map((tag) => (
                                <span key={tag} className="tag text-[11px]">{tag}</span>
                              ))}
                            </div>
                          </>
                        )}
                      />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
