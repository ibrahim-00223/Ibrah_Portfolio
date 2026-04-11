import { useState } from 'react'

interface VideoBlockProps {
  /** Accepte :
   *  - un lien YouTube complet : https://youtu.be/xxx  ou  https://youtube.com/watch?v=xxx
   *  - un ID YouTube brut      : dQw4w9WgXcQ
   *  - un fichier vidéo direct : /videos/demo.mp4  ou  https://cdn.example.com/demo.webm
   */
  src?: string
}

// ── Détecte le type de source ────────────────────────────────────────────────
function detectType(src: string): 'youtube' | 'video' {
  if (/youtube\.com|youtu\.be/.test(src)) return 'youtube'
  if (/^[a-zA-Z0-9_-]{11}$/.test(src.trim())) return 'youtube'
  return 'video'
}

// Extrait l'ID YouTube depuis n'importe quel format
function extractYouTubeId(src: string): string {
  const match = src.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : src.trim()
}

// ── Bouton play partagé ──────────────────────────────────────────────────────
function PlayOverlay({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group absolute inset-0 flex flex-col items-center justify-center gap-3 focus:outline-none"
      aria-label="Lire la vidéo"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-pink shadow-pink-glow group-hover:scale-110 transition-transform duration-200">
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1" aria-hidden="true">
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </div>
      <span className="text-white text-sm font-medium tracking-wide drop-shadow">
        Voir la démo
      </span>
    </button>
  )
}

export function VideoBlock({ src }: VideoBlockProps) {
  const [playing, setPlaying] = useState(false)

  // ── Placeholder ──────────────────────────────────────────────────────────
  if (!src?.trim()) {
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

  const type = detectType(src)

  // ════════════════════════════════════════════════════════════════════════════
  // YOUTUBE
  // ════════════════════════════════════════════════════════════════════════════
  if (type === 'youtube') {
    const ytId = extractYouTubeId(src)

    if (!playing) {
      const thumbnail = `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`
      const fallback  = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`

      return (
        <div className="w-full aspect-video rounded-lg overflow-hidden border border-border relative">
          <img
            src={thumbnail}
            alt="Aperçu de la démo"
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = fallback }}
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-200" />
          <PlayOverlay onClick={() => setPlaying(true)} />
        </div>
      )
    }

    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
        <iframe
          width="100%" height="100%"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
          title="Démo du projet"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="block"
        />
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VIDÉO DIRECTE (mp4, webm, mov…)
  // ════════════════════════════════════════════════════════════════════════════
  if (!playing) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-bg-raised relative flex items-center justify-center">
        {/* Fond avec aperçu vidéo désactivé */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-raised to-bg" />
        <div className="absolute inset-0 flex items-center justify-center text-text-tertiary text-xs font-mono">
          Screen record
        </div>
        <PlayOverlay onClick={() => setPlaying(true)} />
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={src}
        autoPlay
        controls
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  )
}
