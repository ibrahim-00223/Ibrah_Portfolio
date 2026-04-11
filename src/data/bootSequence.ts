export type BootLine = {
  text: string
  delay: number
  color?: 'green' | 'amber' | 'muted' | 'red' | 'cyan'
  speed?: 'instant' | 'fast' | 'normal' | 'slow'
}

export const bootLines: BootLine[] = [
  { text: 'IBRAHIM/OS v2.0.26 — initialisation système...', delay: 0, color: 'muted', speed: 'fast' },
  { text: 'Chargement du noyau........................ [OK]', delay: 300, color: 'muted', speed: 'fast' },
  { text: 'Montage système de fichiers................ [OK]', delay: 250, color: 'muted', speed: 'fast' },
  { text: 'Initialisation réseau...................... [OK]', delay: 200, color: 'muted', speed: 'fast' },
  { text: 'Démarrage moteur IA........................ [OK]', delay: 400, color: 'green', speed: 'fast' },
  { text: 'Chargement modules RevOps.................. [OK]', delay: 300, color: 'green', speed: 'fast' },
  { text: 'Connexion interfaces externes.............. [OK]', delay: 200, color: 'green', speed: 'fast' },
  { text: '', delay: 200, color: 'muted', speed: 'instant' },
  { text: '> Système opérationnel. Bienvenue.', delay: 400, color: 'green', speed: 'normal' },
]
