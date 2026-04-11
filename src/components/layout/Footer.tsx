export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="section-inner flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-text-tertiary">
        <span className="font-display font-bold text-white">IC.</span>
        <span>© 2026 Ibrahim CISSE — Conçu &amp; codé à la main</span>
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/ibrahim-cisse-b6a8231b3/" target="_blank" rel="noopener noreferrer"
             className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
             className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
