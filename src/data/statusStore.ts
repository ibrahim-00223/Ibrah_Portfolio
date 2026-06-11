export type StatusData = {
  label: string
  available: boolean
}

import {
  getStatusRaw, saveStatus, resetKey,
} from './api'

export function getStatus(): StatusData {
  return getStatusRaw()
}

export { saveStatus }

export function resetStatus(): void {
  resetKey('status')
}
