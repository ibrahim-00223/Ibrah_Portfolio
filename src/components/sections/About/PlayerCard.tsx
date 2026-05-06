import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ParcourModal } from './ParcourModal'
import { getScorecard, moduleValue } from '../../../data/scorecardStore'

const RAW = getScorecard()
const STATS = RAW.map(m => ({ ...m, value: moduleValue(m) }))
const OVERALL = Math.round(STATS.reduce((s, x) => s + x.value, 0) / STATS.length)

function skillColor(v: number) {
  if (v >= 85) return '#4ade80'
  if (v >= 75) return '#E6004C'
  if (v >= 65) return '#f59e0b'
  return '#94a3b8'
}

// ── Pentagon radar ─────────────────────────────────────────────────────────────
function RadarChart({ animated }: { animated: boolean }) {
  const S = 160, C = S / 2, R = 58
  const angles = STATS.map((_, i) => (Math.PI * 2 * i) / STATS.length - Math.PI / 2)
  const outer  = angles.map(a => ({ x: C + R * Math.cos(a), y: C + R * Math.sin(a) }))
  const data   = STATS.map((s, i) => ({
    x: C + R * (s.value / 100) * Math.cos(angles[i]),
    y: C + R * (s.value / 100) * Math.sin(angles[i]),
  }))
  const path = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-full">
      {[0.25, 0.5, 0.75, 1].map(r => (
        <polygon key={r}
          points={angles.map(a => `${(C + R * r * Math.cos(a)).toFixed(1)},${(C + R * r * Math.sin(a)).toFixed(1)}`).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {outer.map((p, i) => (
        <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      <motion.path
        d={path(data)} fill="rgba(230,0,76,0.15)" stroke="#E6004C" strokeWidth="1.5" strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.3 }} animate={animated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: `${C}px ${C}px` }}
      />
      {data.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#E6004C"
          initial={{ opacity: 0 }} animate={animated ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 + i * 0.07 }} />
      ))}
      {STATS.map((s, i) => {
        const lx = C + (R + 13) * Math.cos(angles[i])
        const ly = C + (R + 13) * Math.sin(angles[i])
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.35)" style={{ fontSize: 7, fontFamily: 'ui-monospace,monospace', letterSpacing: '0.08em' }}>
            {s.short}
          </text>
        )
      })}
    </svg>
  )
}

// ── Large module circle (bottom grid) ─────────────────────────────────────────
function ModuleCircle({ value, delay, animated }: { value: number; delay: number; animated: boolean }) {
  const R = 28, CIRC = 2 * Math.PI * R
  const color = skillColor(value)
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16">
      <circle cx="32" cy="32" r={R} fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <motion.circle
        cx="32" cy="32" r={R} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={CIRC}
        initial={{ strokeDashoffset: CIRC }}
        animate={animated ? { strokeDashoffset: CIRC * (1 - value / 100) } : { strokeDashoffset: CIRC }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px' }}
      />
      <text x="32" y="32" textAnchor="middle" dominantBaseline="middle"
        fill="white" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'ui-monospace,monospace' }}>
        {value}
      </text>
    </svg>
  )
}

// ── Small skill badge (inside module popup) ────────────────────────────────────
function SkillBadge({ name, value }: { name: string; value: number }) {
  const R = 22, CIRC = 2 * Math.PI * R
  const color = skillColor(value)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg viewBox="0 0 52 52" className="w-14 h-14">
        <circle cx="26" cy="26" r={R} fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
        <motion.circle
          cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC * (1 - value / 100) }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '26px 26px' }}
        />
        <text x="26" y="26" textAnchor="middle" dominantBaseline="middle"
          fill="white" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'ui-monospace,monospace' }}>
          {value}
        </text>
      </svg>
      <span className="text-white/50 text-[9px] font-mono text-center leading-tight w-14">{name}</span>
    </div>
  )
}

// ── Main card ──────────────────────────────────────────────────────────────────
export function PlayerCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [parcourOpen, setParcourOpen] = useState(false)
  const [openModule, setOpenModule]   = useState<number | null>(null)

  const BIG_R = 44, BIG_C = 2 * Math.PI * BIG_R

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden border border-border"
        style={{
          background: 'linear-gradient(135deg, #0d0d1a 0%, #12080f 60%, #0d0d1a 100%)',
          boxShadow: '0 0 0 1px rgba(230,0,76,0.15), 0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* ══ TOP SECTION ══ */}
        <div className="grid md:grid-cols-[180px_140px_1fr_160px] divide-y md:divide-y-0 md:divide-x divide-white/5">

          {/* 1 — Identity */}
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-[88px] h-[88px] rounded-xl overflow-hidden ring-2 ring-brand-pink/40">
              <img src="./ibrahim.png" alt="Ibrahim CISSE" className="w-full h-full object-cover object-top" />
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-white text-sm leading-tight">Ibrahim CISSE</p>
              <p className="text-brand-pink text-[9px] font-mono mt-0.5 tracking-wider">GTM · AI · Creator</p>
            </div>
            <div className="border border-brand-pink/30 rounded px-3 py-1">
              <span className="text-brand-pink text-[10px] font-mono tracking-widest">BUILDER</span>
            </div>
          </div>

          {/* 2 — Big overall circle */}
          <div className="flex flex-col items-center justify-center gap-2 p-6">
            <span className="text-[9px] font-mono tracking-[0.18em] text-white/30 uppercase">Overall</span>
            <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <circle cx="50" cy="50" r={BIG_R} fill="none" stroke="rgba(230,0,76,0.12)" strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r={BIG_R} fill="none" stroke="#E6004C" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={BIG_C}
                  initial={{ strokeDashoffset: BIG_C }}
                  animate={inView ? { strokeDashoffset: BIG_C * (1 - OVERALL / 100) } : {}}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                />
              </svg>
              <div className="relative flex flex-col items-center z-10">
                <span className="text-white/40 text-[8px] font-mono tracking-widest leading-none">GTM</span>
                <span className="font-display font-bold text-white leading-none mt-0.5" style={{ fontSize: 32 }}>{OVERALL}</span>
              </div>
            </div>
          </div>

          {/* 3 — Radar */}
          <div className="flex flex-col items-center justify-center p-6 gap-2">
            <span className="text-[9px] font-mono tracking-[0.18em] text-white/30 uppercase">Radar</span>
            <div className="w-full max-w-[160px] aspect-square">
              <RadarChart animated={inView} />
            </div>
          </div>

          {/* 4 — Module averages */}
          <div className="flex flex-col justify-center p-6 gap-2.5">
            <span className="text-[9px] font-mono tracking-[0.18em] text-white/30 uppercase mb-0.5">Stats</span>
            {STATS.map((s, i) => (
              <div key={s.short} className="flex items-center gap-2">
                <span className="text-white/50 text-[10px] font-mono w-8 shrink-0">{s.short}</span>
                <div className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: skillColor(s.value) }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${s.value}%` } : { width: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="text-white text-[11px] font-mono font-bold w-6 text-right shrink-0">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ DIVIDER ══ */}
        <div className="h-px bg-white/5" />

        {/* ══ BOTTOM SECTION — one circle per module, click to reveal skills ══ */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 divide-x divide-white/5" style={{ minWidth: 480 }}>
            {STATS.map((s, si) => (
              <button
                key={s.label}
                onClick={() => setOpenModule(si)}
                className="flex flex-col items-center gap-3 p-5 hover:bg-white/[0.03] transition-colors group"
              >
                <span className="text-[11px] font-mono tracking-[0.12em] text-white/50 uppercase group-hover:text-white/70 transition-colors font-semibold">
                  {s.label}
                </span>
                <ModuleCircle value={s.value} delay={0.4 + si * 0.08} animated={inView} />
                <span className="text-[8px] font-mono text-white/20 group-hover:text-brand-pink/60 transition-colors">
                  {s.skills.length} skills ↗
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ══ MON PARCOURS BUTTON ══ */}
        <div className="border-t border-white/5 px-6 py-4 flex justify-center">
          <button
            onClick={() => setParcourOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-brand-pink/30 text-brand-pink text-xs font-mono tracking-widest hover:bg-brand-pink/10 hover:border-brand-pink/60 transition-all duration-200"
          >
            MON PARCOURS
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </motion.div>

      {/* ══ MODULE SKILLS POPUP ══ */}
      <AnimatePresence>
        {openModule !== null && (() => {
          const mod = STATS[openModule]
          return (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setOpenModule(null)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  className="pointer-events-auto w-full max-w-xs rounded-2xl border border-border overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #0d0d1a 0%, #12080f 60%, #0d0d1a 100%)',
                    boxShadow: '0 0 0 1px rgba(230,0,76,0.2), 0 24px 60px rgba(0,0,0,0.8)',
                  }}
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 12 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 pt-5 pb-4">
                    <div>
                      <p className="text-[9px] font-mono text-brand-pink/60 tracking-widest uppercase mb-0.5">{mod.short}</p>
                      <h3 className="font-display font-bold text-white text-base">{mod.label}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: skillColor(mod.value) }}>
                        <span className="text-white font-mono font-bold text-sm">{mod.value}</span>
                      </div>
                      <button
                        onClick={() => setOpenModule(null)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-white/30 hover:text-white transition-colors text-sm"
                      >✕</button>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* Skills grid */}
                  <div className="grid grid-cols-2 gap-4 p-5 justify-items-center">
                    {mod.skills.map((sk) => (
                      <SkillBadge key={sk.name} name={sk.name} value={sk.value} />
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )
        })()}
      </AnimatePresence>

      <ParcourModal isOpen={parcourOpen} onClose={() => setParcourOpen(false)} />
    </>
  )
}
