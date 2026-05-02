import { AnimatePresence, motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const links = [
  {
    label: 'LinkedIn',
    sub: 'ibrahim-cissé',
    href: 'https://www.linkedin.com/in/ibrahim-ciss%C3%A9-6981b8240/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Réserver un call',
    sub: 'Notion Calendar',
    href: 'https://calendar.notion.so/meet/ibrahimcisse1/044on4pg6',
    icon: (
      <svg viewBox="0 0 100 100" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M6.6 7.8C10.4 10.9 11.8 10.6 19 10.1l67.2-4c1.4 0 .3-1.4-.3-1.7L74 .7C72 -.1 68.5-.1 65.2.2L.7 4.8C-1 5 -1.3 7 .7 7.8L6.6 7.8zM9.3 32.1V99c0 3.8 1.9 5.2 6.2 4.9L95.9 99.5c4.3-.3 4.8-2.9 4.8-6.1V29.2c0-3.2-1.3-4.9-4.1-4.6l-83.1 4.9c-3.1.3-4.2 1.7-4.2 4.6zM89.5 37.5c.5 2.2 0 4.4-2.2 4.7l-3.6.7v53c-3.1 1.7-6 2.6-8.4 2.6-3.9 0-4.9-1.2-7.8-4.9L44.2 64v29l8.2 1.8s0 4.4-6.1 4.4L29.7 100.4c-.5-1.1 0-3.8 1.7-4.3l4.4-1.2V45.2L29.7 44.8c-.5-2.2.6-5.4 3.8-5.7l17.3-1.1 24.2 37V40.1l-6.9-.8c-.5-2.7 1.4-4.6 3.8-4.9L89.5 37.5z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    sub: '@by_ibrah07',
    href: 'https://youtube.com/@by_ibrah07',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-sm bg-[#111111] border border-border rounded-2xl p-6 flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors p-1"
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Profile */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full ring-2 ring-brand-pink ring-offset-2 ring-offset-[#111111] overflow-hidden">
                <img
                  src="./ibrahim.png"
                  alt="Ibrahim CISSE"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-white text-lg leading-tight">Ibrahim CISSE</p>
                <p className="text-text-secondary text-sm mt-0.5">GTM Engineer · AI Builder · Content Creator</p>
              </div>
            </div>

            {/* Links */}
            <div className="w-full flex flex-col gap-2.5">
              {links.map(({ label, sub, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-border-accent hover:bg-[rgba(230,0,76,0.04)] transition-all duration-150 group"
                >
                  <span className="text-text-secondary group-hover:text-brand-pink transition-colors">
                    {icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-medium leading-tight">{label}</span>
                    <span className="text-text-tertiary text-xs leading-tight">{sub}</span>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-auto text-text-tertiary group-hover:text-text-secondary transition-colors shrink-0">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
