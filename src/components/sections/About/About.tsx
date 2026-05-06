import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CareerTimeline } from './CareerTimeline'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export function About() {
  const headerRef = useRef<HTMLDivElement>(null)
  const block1Ref = useRef<HTMLDivElement>(null)
  const block3Ref = useRef<HTMLDivElement>(null)

  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })
  const block1InView = useInView(block1Ref, { once: true, margin: '-60px' })
  const block3InView = useInView(block3Ref, { once: true, margin: '-60px' })

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

        {/* ── Bloc 1 : Qui je suis ── */}
        <motion.div
          ref={block1Ref}
          initial={fadeUp(0.1).initial}
          animate={block1InView ? fadeUp(0.1).animate : {}}
          transition={fadeUp(0.1).transition}
          className="mb-16"
        >
          <div className="border-l-2 border-brand-pink pl-6 max-w-2xl">
            <p className="font-display text-display-sm text-white leading-snug mb-4">
              "Je construis ce que je rêve d'utiliser."
            </p>
            <p className="text-base text-text-secondary leading-relaxed mb-3">
              Chaque projet part d'un besoin vécu. CoolBot est né d'années sur le terrain
              comme technicien frigoriste. AWA vient directement de ma communauté.
              Pas de produit fabriqué — des solutions à des problèmes réels.
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
              Ni purement dev, ni purement commercial. L'interface entre les deux —
              là où la vraie valeur se crée.
            </p>
          </div>
        </motion.div>

        {/* ── Bloc 2 : Timeline (gère ses propres animations) ── */}
        <div className="mb-16">
          <p className="text-sm font-semibold text-text-tertiary tracking-widest uppercase mb-6">
            Mon Parcours
          </p>
          <CareerTimeline />
        </div>

        {/* ── Bloc 3 : En ce moment ── */}
        <motion.div
          ref={block3Ref}
          initial={fadeUp(0.15).initial}
          animate={block3InView ? fadeUp(0.15).animate : {}}
          transition={fadeUp(0.15).transition}
        >
          <div className="card p-6 border-border-accent bg-[rgba(230,0,76,0.03)]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse-pink" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-pink">
                En ce moment
              </span>
            </div>

            {/* Two columns */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Mission principale */}
              <div>
                <div className="text-sm font-semibold text-white mb-0.5">
                  GTM &amp; AI Engineer
                </div>
                <div className="text-xs font-mono text-brand-pink mb-3">@ Scalefast</div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Construction de l'infrastructure Sales &amp; Growth — automatisation des
                  processus, IA multi-agents et prospection scalable pour une agence
                  outbound SaaS B2B.
                </p>
              </div>

              {/* Projets perso */}
              <div>
                <div className="text-sm font-semibold text-white mb-3">Projets personnels</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="tag-pink shrink-0">AWA</span>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Plateforme d'agents IA pour faciliter l'intégration administrative
                      des ressortissants étrangers en France.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="tag-pink shrink-0">CoolBot</span>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Assistant IA RAG pour techniciens frigoristes — accès instantané
                      à la documentation technique sur le terrain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
