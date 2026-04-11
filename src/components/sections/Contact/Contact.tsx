import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import clsx from 'clsx'

const contactLinks = [
  {
    label: 'Email',
    value: 'ibrahim.cisse@proton.me',
    href:  'mailto:ibrahim.cisse@proton.me',
    icon:  '✉',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ibrahim-cisse',
    href:  'https://www.linkedin.com/in/ibrahim-cisse-b6a8231b3/',
    icon:  'in',
  },
  {
    label: 'GitHub',
    value: 'github.com/ibrah-builder',
    href:  'https://github.com/',
    icon:  'gh',
  },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="contact" className="py-24 bg-bg-surface">
      <div className="section-inner">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow">04 — Contact</p>
          <div className="flex items-end gap-6 mb-4">
            <h2 className="font-display text-display-lg text-white">On se connecte ?</h2>
            <div className="accent-line mb-3" />
          </div>
          <p className="text-text-secondary text-base leading-relaxed max-w-xl mb-12">
            Recruteur, founder, investisseur ou dev curieux ?<br />
            Je suis disponible pour échanger.
          </p>

          <motion.div
            className="grid sm:grid-cols-3 gap-4 max-w-2xl"
            variants={stagger}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            {contactLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                variants={item}
                className={clsx(
                  'card p-5 flex flex-col gap-3 group',
                  'hover:border-border-accent hover:shadow-pink-glow hover:bg-[rgba(230,0,76,0.04)]'
                )}
              >
                <span className="text-xl font-mono text-brand-pink">{link.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-brand-pink transition-colors">
                    {link.label}
                  </div>
                  <div className="text-xs text-text-tertiary mt-0.5 break-all">{link.value}</div>
                </div>
                <span className="text-text-tertiary text-xs mt-auto group-hover:text-brand-pink transition-colors">
                  Ouvrir ↗
                </span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
