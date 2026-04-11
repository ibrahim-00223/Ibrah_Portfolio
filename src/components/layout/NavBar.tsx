import { useState, useEffect } from 'react'
import clsx from 'clsx'

const navLinks = [
  { label: 'Parcours',  id: 'about'    },
  { label: 'Projets',   id: 'projects' },
  { label: 'Stack',     id: 'stack'    },
  { label: 'Contact',   id: 'contact'  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function NavBar() {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.25 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-bg/95 backdrop-blur-md border-b border-border'
        : 'bg-transparent'
    )}>
      <div className="section-inner h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display font-bold text-lg text-white hover:text-brand-pink transition-colors"
        >
          IC.
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, id }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={clsx(
                  'px-4 py-2 text-sm rounded-md transition-all duration-150',
                  isActive
                    ? 'text-white font-medium'
                    : 'text-text-secondary hover:text-white'
                )}
              >
                {label}
                {isActive && (
                  <span className="block mx-auto mt-0.5 h-0.5 w-4 bg-brand-pink rounded-full" />
                )}
              </button>
            )
          })}
          <button
            onClick={() => scrollTo('contact')}
            className="ml-3 btn-primary text-xs py-2 px-4"
          >
            Me contacter
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span className={clsx('block w-5 h-0.5 bg-white transition-all duration-200', menuOpen && 'rotate-45 translate-y-2')} />
          <span className={clsx('block w-5 h-0.5 bg-white transition-all duration-200', menuOpen && 'opacity-0')} />
          <span className={clsx('block w-5 h-0.5 bg-white transition-all duration-200', menuOpen && '-rotate-45 -translate-y-2')} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-surface border-b border-border px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => { scrollTo(id); setMenuOpen(false) }}
              className="text-left py-2.5 px-3 text-sm text-text-secondary hover:text-white hover:bg-bg-raised rounded-md transition-all"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { scrollTo('contact'); setMenuOpen(false) }}
            className="mt-2 btn-primary justify-center"
          >
            Me contacter
          </button>
        </div>
      )}
    </nav>
  )
}
