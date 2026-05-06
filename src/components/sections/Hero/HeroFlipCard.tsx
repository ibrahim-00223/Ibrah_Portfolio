import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { getStatus } from '../../../data/statusStore'

const SKILLS = [
  { label: 'Business',           value: 88 },
  { label: 'IA',                 value: 82 },
  { label: 'Data',               value: 74 },
  { label: 'Engineering',        value: 70 },
  { label: 'Project Management', value: 78 },
]

function SkillBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">{label}</span>
        <span className="text-[10px] font-mono text-brand-pink">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-pink to-[#ff4d7d]"
          style={{ boxShadow: '0 0 8px rgba(230,0,76,0.6)' }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export function HeroFlipCard() {
  const [flipped, setFlipped] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const status = getStatus()

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setFlipped(f => !f), 5000)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const handleHover = (entering: boolean) => {
    if (entering) {
      if (timerRef.current) clearInterval(timerRef.current)
      setFlipped(true)
    } else {
      setFlipped(false)
      resetTimer()
    }
  }

  return (
    <motion.div
      className="flex justify-center md:justify-start order-2 md:order-1"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer wrapper — badge lives here, outside the 3D flip */}
      <div className="relative pb-8">

        {/* Flip container */}
        <div
          className="relative w-64 md:w-72 lg:w-80 cursor-pointer"
          style={{ perspective: '1000px', aspectRatio: '3/4' }}
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          onClick={() => { setFlipped(f => !f); resetTimer() }}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* ── FRONT ── */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              {/* Pink accent borders */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-brand-pink opacity-20 pointer-events-none" />
              <div className="absolute -bottom-1.5 -right-1.5 w-full h-full rounded-2xl border border-brand-pink opacity-10 pointer-events-none" />

              <img
                src="./ibrahim.png"
                alt="Ibrahim CISSE"
                className="w-full h-full object-cover object-top rounded-2xl"
                style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' }}
              />

              {/* Flip hint */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 pointer-events-none">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-white/50">
                  <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider">flip</span>
              </div>
            </div>

            {/* ── BACK ── */}
            <div
              className="absolute inset-0 rounded-2xl flex flex-col p-5 gap-4"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(145deg, #0f0f0f 0%, #1a0a12 100%)',
                boxShadow: '0 0 0 1px rgba(230,0,76,0.25), 0 24px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(230,0,76,0.04)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-[0.2em] text-brand-pink uppercase">Player Card</span>
                <span className="text-[9px] font-mono text-white/30">v2.0</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-2 ring-brand-pink/60">
                  <img src="./ibrahim.png" alt="Ibrahim CISSE" className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-white text-sm leading-tight">Ibrahim CISSE</p>
                  <p className="text-[10px] text-brand-pink font-mono mt-0.5">GTM Engineer</p>
                  <p className="text-[9px] text-white/30 font-mono">Paris, France</p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-brand-pink/30 to-transparent" />

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-[0.2em] text-white/40 uppercase">Stats</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="flex flex-col gap-3 flex-1 justify-center">
                {SKILLS.map(({ label, value }, i) => (
                  <SkillBar key={label} label={label} value={value} delay={0.1 + i * 0.08} />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">ibrahim-cisse.fr</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-pink opacity-80" />
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Badge — outside the 3D container so il ne flip pas */}
        <motion.div
          className="absolute bottom-0 left-4 flex items-center gap-2 bg-bg-surface border border-border rounded-full px-3 py-1.5 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <span className={`w-2 h-2 rounded-full ${status.available ? 'bg-brand-pink animate-pulse-pink' : 'bg-white/30'}`} />
          <span className="text-xs text-text-secondary whitespace-nowrap">{status.label}</span>
        </motion.div>

      </div>
    </motion.div>
  )
}
