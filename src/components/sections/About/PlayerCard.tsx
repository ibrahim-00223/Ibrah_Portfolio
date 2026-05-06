import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { label: 'Business',    short: 'BUS', value: 88 },
  { label: 'IA',          short: 'AI',  value: 82 },
  { label: 'Data',        short: 'DAT', value: 74 },
  { label: 'Engineering', short: 'ENG', value: 70 },
  { label: 'Proj. Mgmt',  short: 'PM',  value: 78 },
]

const OVERALL = Math.round(STATS.reduce((s, x) => s + x.value, 0) / STATS.length)

// ── Radar SVG ──────────────────────────────────────────────────────────────────
function RadarChart({ animated }: { animated: boolean }) {
  const SIZE = 200
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R = 80

  const angles = STATS.map((_, i) => (Math.PI * 2 * i) / STATS.length - Math.PI / 2)

  const outerPts = angles.map(a => ({
    x: CX + R * Math.cos(a),
    y: CY + R * Math.sin(a),
  }))

  const dataPts = STATS.map((s, i) => ({
    x: CX + R * (s.value / 100) * Math.cos(angles[i]),
    y: CY + R * (s.value / 100) * Math.sin(angles[i]),
  }))

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full">
      {/* Grid rings */}
      {rings.map((r) => (
        <polygon
          key={r}
          points={angles.map(a =>
            `${(CX + R * r * Math.cos(a)).toFixed(1)},${(CY + R * r * Math.sin(a)).toFixed(1)}`
          ).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {outerPts.map((p, i) => (
        <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}

      {/* Data polygon */}
      <motion.path
        d={toPath(dataPts)}
        fill="rgba(230,0,76,0.15)"
        stroke="#E6004C"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={animated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      {/* Data points */}
      {dataPts.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="3"
          fill="#E6004C"
          initial={{ opacity: 0 }}
          animate={animated ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 + i * 0.07 }}
        />
      ))}

      {/* Labels */}
      {STATS.map((s, i) => {
        const lx = CX + (R + 18) * Math.cos(angles[i])
        const ly = CY + (R + 18) * Math.sin(angles[i])
        return (
          <text key={i} x={lx} y={ly}
            textAnchor="middle" dominantBaseline="middle"
            className="fill-white/40 font-mono"
            style={{ fontSize: 8, letterSpacing: '0.08em' }}
          >
            {s.short}
          </text>
        )
      })}
    </svg>
  )
}

// ── Circular stat ──────────────────────────────────────────────────────────────
function StatCircle({ value, delay, animated }: { value: number; delay: number; animated: boolean }) {
  const R = 18
  const CIRC = 2 * Math.PI * R
  const dash = (value / 100) * CIRC

  return (
    <svg viewBox="0 0 44 44" className="w-11 h-11 shrink-0">
      {/* Background ring */}
      <circle cx="22" cy="22" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      {/* Progress ring */}
      <motion.circle
        cx="22" cy="22" r={R}
        fill="none"
        stroke="#E6004C"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        initial={{ strokeDashoffset: CIRC }}
        animate={animated ? { strokeDashoffset: CIRC - dash } : { strokeDashoffset: CIRC }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '22px 22px' }}
      />
      {/* Value */}
      <text x="22" y="22" textAnchor="middle" dominantBaseline="middle"
        className="fill-white font-mono font-bold" style={{ fontSize: 10 }}>
        {value}
      </text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function PlayerCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
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
      <div className="grid md:grid-cols-[200px_1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-white/5">

        {/* ── LEFT : Identity ── */}
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          {/* Overall badge */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-brand-pink/60 tracking-widest uppercase mb-1">Overall</span>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(230,0,76,0.15)" strokeWidth="3" />
                <motion.circle
                  cx="32" cy="32" r="28"
                  fill="none" stroke="#E6004C" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 28}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={inView ? { strokeDashoffset: 2 * Math.PI * 28 * (1 - OVERALL / 100) } : {}}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px' }}
                />
              </svg>
              <span className="font-display font-bold text-white text-xl z-10">{OVERALL}</span>
            </div>
          </div>

          {/* Photo */}
          <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-brand-pink/40">
            <img src="./ibrahim.png" alt="Ibrahim CISSE"
              className="w-full h-full object-cover object-top" />
          </div>

          {/* Identity */}
          <div className="text-center">
            <p className="font-display font-bold text-white text-base leading-tight">Ibrahim CISSE</p>
            <p className="text-brand-pink text-[10px] font-mono mt-1 tracking-wider">GTM · AI · Creator</p>
            <p className="text-white/30 text-[9px] font-mono mt-0.5">Paris, France</p>
          </div>

          {/* Position badge */}
          <div className="border border-brand-pink/30 rounded px-3 py-1">
            <span className="text-brand-pink text-xs font-mono tracking-widest">BUILDER</span>
          </div>
        </div>

        {/* ── CENTER : Radar ── */}
        <div className="flex flex-col items-center justify-center p-6 gap-3">
          <span className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase">Radar</span>
          <div className="w-full max-w-[200px] aspect-square">
            <RadarChart animated={inView} />
          </div>
        </div>

        {/* ── RIGHT : Stats ── */}
        <div className="flex flex-col justify-center p-6 gap-3">
          <span className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">Stats</span>
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <StatCircle value={s.value} delay={0.3 + i * 0.1} animated={inView} />
              <div>
                <p className="text-white text-xs font-medium leading-tight">{s.label}</p>
                <div className="mt-1 h-1 w-24 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-pink to-[#ff4d7d]"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${s.value}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  )
}
