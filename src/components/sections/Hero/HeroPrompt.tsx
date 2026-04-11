import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../../../hooks/useTypewriter'
import { Prompt } from '../../ui/Prompt'
import { Cursor } from '../../ui/Cursor'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 1.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function HeroPrompt() {
  const [phase, setPhase] = useState<'cmd' | 'response' | 'done'>('cmd')

  const { displayed: cmdText, isDone: cmdDone } = useTypewriter({
    text: 'whoami',
    speed: 'normal',
    startDelay: 300,
  })

  useEffect(() => {
    if (cmdDone) {
      setTimeout(() => setPhase('response'), 400)
    }
  }, [cmdDone])

  const { displayed: nameText, isDone: nameDone } = useTypewriter({
    text: 'Ibrahim CISSE',
    speed: 'normal',
    startDelay: 0,
    enabled: phase === 'response' || phase === 'done',
  })

  useEffect(() => {
    if (nameDone && phase === 'response') {
      setTimeout(() => setPhase('done'), 300)
    }
  }, [nameDone, phase])

  return (
    <div className="space-y-6">
      {/* whoami command */}
      <div className="flex items-center gap-2 text-sm md:text-base">
        <Prompt />
        <span className="text-terminal-amber">{cmdText}</span>
        {!cmdDone && <Cursor />}
      </div>

      {/* Response */}
      {phase !== 'cmd' && (
        <div className="space-y-1 pl-0">
          <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-terminal-green glow-strong leading-none tracking-tight">
            {nameText}
            {phase === 'response' && !nameDone && <Cursor className="w-4 h-10 md:h-14 lg:h-16 ml-1" />}
          </div>

          {phase === 'done' && (
            <motion.div
              className="mt-4 space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.p
                variants={item}
                className="text-lg md:text-xl text-terminal-green-dim leading-relaxed max-w-2xl"
              >
                Builder. RevOps Engineer. Je construis des systèmes à l'intersection
                <br className="hidden md:block" />
                <span className="text-terminal-amber"> de l'IA</span>,
                <span className="text-terminal-cyan"> de la data</span> et
                <span className="text-terminal-green"> du business</span>.
              </motion.p>

              <motion.div variants={item} className="flex items-center gap-4 text-xs text-terminal-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse inline-block" />
                  Disponible — Paris, France
                </span>
                <span className="text-terminal-border">|</span>
                <span>Open to opportunities</span>
              </motion.div>

              <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
                {[
                  { href: '#about', label: '[01] parcours' },
                  { href: '#projects', label: '[02] projets' },
                  { href: '#stack', label: '[03] stack' },
                  { href: '#contact', label: '[04] contact' },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-sm text-terminal-muted hover:text-terminal-green hover:glow transition-all duration-150 border border-terminal-border hover:border-terminal-green-muted px-3 py-1.5"
                  >
                    {label}
                  </a>
                ))}
              </motion.div>

              <motion.div variants={item} className="flex items-center gap-2 text-sm pt-2">
                <Prompt dim />
                <Cursor />
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
