import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PlayerCard } from './PlayerCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export function About() {
  const headerRef = useRef<HTMLDivElement>(null)
  const block1Ref = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })
  const block1InView = useInView(block1Ref, { once: true, margin: '-60px' })

  return (
    <section id="about" className="py-24">
      <div className="section-inner">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={fadeUp(0).initial}
          animate={headerInView ? fadeUp(0).animate : {}}
          transition={fadeUp(0).transition}
          className="mb-12"
        >
          <p className="section-eyebrow">03 — Parcours</p>
          <div className="flex items-end gap-6 mb-4">
            <h2 className="font-display text-display-lg text-white">À propos de moi</h2>
            <div className="accent-line mb-3" />
          </div>
        </motion.div>

        {/* ── Player Card ── */}
        <motion.div
          ref={block1Ref}
          initial={fadeUp(0.1).initial}
          animate={block1InView ? fadeUp(0.1).animate : {}}
          transition={fadeUp(0.1).transition}
        >
          <PlayerCard />
        </motion.div>

      </div>
    </section>
  )
}
