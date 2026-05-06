import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTimeline } from '../../../data/timelineStore'

type Tab = 'experiences' | 'academic'

const colorMap = {
  amber: { dot: 'bg-[#ffb000]', text: 'text-[#ffb000]', border: 'border-[#ffb000]/30' },
  cyan:  { dot: 'bg-[#00d4ff]', text: 'text-[#00d4ff]', border: 'border-[#00d4ff]/30' },
  green: { dot: 'bg-brand-pink', text: 'text-brand-pink', border: 'border-brand-pink/30' },
}

const ACADEMIC = [
  {
    period: '2019 — 2021',
    title: 'BTS Management Commercial',
    school: 'Formation initiale',
    description: 'Bases en gestion commerciale, négociation et management. Développement des compétences en relation client, stratégie commerciale et pilotage d\'équipe.',
    tags: ['Commerce', 'Négociation', 'Management', 'Marketing'],
    color: 'amber' as const,
  },
  {
    period: '2021 — 2024',
    title: 'Growth & Stratégie Éditoriale',
    school: 'Auto-formation',
    description: 'Maîtrise du SEO YouTube, stratégie de contenu, growth hacking et analytics. +100 vidéos produites et une compréhension fine de l\'algorithme.',
    tags: ['SEO YouTube', 'Content Strategy', 'Analytics', 'Storytelling'],
    color: 'cyan' as const,
  },
  {
    period: '2024 — Présent',
    title: 'IA & Ingénierie Logicielle',
    school: 'DeepLearning.AI · Anthropic · OpenAI',
    description: 'LLMs, systèmes multi-agents, Python, FastAPI et automatisation. Application directe en production chez Scalefast avec des résultats mesurables.',
    tags: ['Python', 'LLM', 'Multi-agent', 'FastAPI', 'Prompt Engineering'],
    color: 'green' as const,
  },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ParcourModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('experiences')
  const phases = getTimeline()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border overflow-hidden"
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
                >
                  ✕
                </button>
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
              <div className="overflow-y-auto flex-1 px-6 py-5">
                <AnimatePresence mode="wait">
                  {tab === 'experiences' && (
                    <motion.div
                      key="experiences"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {phases.map((phase) => {
                        const c = colorMap[phase.color]
                        return (
                          <div
                            key={phase.id}
                            className={`rounded-xl border p-5 ${c.border}`}
                            style={{ background: 'rgba(255,255,255,0.025)' }}
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${c.dot}`} />
                                <div>
                                  <p className="font-semibold text-white text-sm leading-snug">{phase.title}</p>
                                  {phase.company && (
                                    <p className={`text-xs font-mono mt-0.5 ${c.text}`}>@ {phase.company}</p>
                                  )}
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-white/30 shrink-0 mt-0.5">{phase.period}</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed mb-3">{phase.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {phase.tags.map((tag) => (
                                <span key={tag} className="tag text-[11px]">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </motion.div>
                  )}

                  {tab === 'academic' && (
                    <motion.div
                      key="academic"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {ACADEMIC.map((item, i) => {
                        const c = colorMap[item.color]
                        return (
                          <div
                            key={i}
                            className={`rounded-xl border p-5 ${c.border}`}
                            style={{ background: 'rgba(255,255,255,0.025)' }}
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${c.dot}`} />
                                <div>
                                  <p className="font-semibold text-white text-sm leading-snug">{item.title}</p>
                                  <p className={`text-xs font-mono mt-0.5 ${c.text}`}>{item.school}</p>
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-white/30 shrink-0 mt-0.5">{item.period}</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed mb-3">{item.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.tags.map((tag) => (
                                <span key={tag} className="tag text-[11px]">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
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
