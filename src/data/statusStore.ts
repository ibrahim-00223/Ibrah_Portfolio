const KEY = 'portfolio_status'

export type StatusData = {
  label: string
  available: boolean
}

const DEFAULT: StatusData = {
  label: 'Disponible · Paris',
  available: true,
}

export function getStatus(): StatusData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT
}

export function saveStatus(data: StatusData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function resetStatus(): void {
  localStorage.removeItem(KEY)
}
