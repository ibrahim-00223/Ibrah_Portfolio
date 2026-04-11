import { useState } from 'react'

interface VideoBlockProps {
  youtubeId?: string
}

export function VideoBlock({ youtubeId }: VideoBlockProps) {
  const [playing, setPlaying] = useState(false)

  // ── Placeholder : vidéo pas encore enregistrée ───────────────────────────
  if (!youtubeId) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-bg-raised flex flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-border text-text-tertiary">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5" aria-hidden="true">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </div>
        <p className="text-text-secondary text-sm font-medium">Démo bientôt disponible</p>
        <p className="text-text-tertiary text-xs">Screen record en cours d'enregistrement</p>
      </div>
    )
  }

  // ── Facade : thumbnail + bouton play (avant clic) ────────────────────────
  if (!playing) {
    const thumbnail = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
    const fallback  = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`

    return (
      <button
        onClick={() => setPlaying(true)}
        className="group w-full aspect-video rounded-lg overflow-hidden border border-border relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
        aria-label="Voir la démo"
      >
        {/* Thumbnail */}
        <img
          src={thumbnail}
          alt="Aperçu de la démo"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback }}
        />

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-200" />

        {/* Bouton play + label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-pink shadow-pink-glow group-hover:scale-110 transition-transform duration-200">
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1" aria-hidden="true">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </div>
          <span className="text-white text-sm font-medium tracking-wide drop-shadow">
            Voir la démo
          </span>
        </div>
      </button>
    )
  }

  // ── Iframe : après clic, lecture automatique ─────────────────────────────
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title="Démo du projet"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="block"
      />
    </div>
  )
}
