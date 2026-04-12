import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="section-inner flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-text-tertiary">
        <Link to="/admin" className="font-display font-bold text-white hover:text-brand-pink transition-colors">IC.</Link>
        <span>© 2026 Ibrahim CISSE — Conçu &amp; codé à la main</span>
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/ibrahim-ciss%C3%A9-6981b8240/" target="_blank" rel="noopener noreferrer"
             className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
             className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
