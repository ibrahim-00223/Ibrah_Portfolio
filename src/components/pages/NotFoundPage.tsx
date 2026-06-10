import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  useEffect(() => { document.title = '404 — Ibrahim CISSE' }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-6"
      >
        <p className="text-brand-pink font-mono text-xs tracking-widest uppercase">404</p>
        <h1 className="font-display text-display-lg text-white">Page introuvable</h1>
        <p className="text-text-secondary text-base max-w-md">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn-primary">
          ← Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  )
}
