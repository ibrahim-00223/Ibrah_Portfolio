import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-16">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #E6004C 0%, transparent 70%)' }}
        />
      </div>

      <div className="section-inner relative z-10 py-16">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* ── LEFT : Photo ── */}
          <motion.div
            className="flex justify-center md:justify-start order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Pink accent border bottom-right */}
              <div
                className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-brand-pink opacity-20 pointer-events-none"
              />
              {/* Second subtle border */}
              <div
                className="absolute -bottom-1.5 -right-1.5 w-full h-full rounded-2xl border border-brand-pink opacity-10 pointer-events-none"
              />

              <img
                src="./ibrahim.png"
                alt="Ibrahim CISSE"
                className="relative z-10 w-64 md:w-72 lg:w-80 rounded-2xl object-cover object-top"
                style={{
                  aspectRatio: '3/4',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
                }}
              />

              {/* Floating status badge */}
              <motion.div
                className="absolute -bottom-4 left-4 z-20 flex items-center gap-2 bg-bg-surface border border-border rounded-full px-3 py-1.5 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse-pink" />
                <span className="text-xs text-text-secondary whitespace-nowrap">
                  Disponible · Paris
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* ── RIGHT : Content ── */}
          <motion.div
            className="order-1 md:order-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Main headline */}
            <motion.h1
              variants={item}
              className="font-display text-display-xl text-white leading-none mb-6"
            >
              Ibrahim
              <br />
              <span className="text-brand-pink">CISSE.</span>
            </motion.h1>

            {/* Role */}
            <motion.p
              variants={item}
              className="text-lg font-light text-text-secondary mb-6 leading-snug"
            >
              GTM Engineer · AI Builder · Content Creator
            </motion.p>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-base text-text-secondary leading-relaxed mb-8 max-w-md"
            >
              Je construis des systèmes à l'intersection de l'IA, de la data
              et du business — des outils qui font vraiment la différence.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              <button onClick={() => scrollTo('projects')} className="btn-primary">
                Voir mes projets
                <span aria-hidden>→</span>
              </button>
              <button onClick={() => scrollTo('about')} className="btn-ghost">
                Mon parcours
              </button>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs text-text-tertiary tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-text-tertiary to-transparent" />
      </motion.div>
    </section>
  )
}
