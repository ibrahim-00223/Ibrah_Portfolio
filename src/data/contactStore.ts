export type ContactLink = {
  label: string
  sub: string
  href: string
  icon: string
}

export type ContactData = {
  name: string
  role: string
  photoUrl: string
  links: ContactLink[]
}

import {
  getContactRaw, saveContact, resetKey,
} from './api'

export function getContact(): ContactData {
  return getContactRaw()
}

export { saveContact as saveContactData }

export function resetContact(): void {
  resetKey('contact')
}
