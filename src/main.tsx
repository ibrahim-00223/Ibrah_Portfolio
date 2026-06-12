import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { initDataStore, getContactRaw } from './data/api'

initDataStore().then(() => {
  const contact = getContactRaw()
  if (contact?.photoUrl) {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (favicon) favicon.href = contact.photoUrl
    const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
    if (ogImage) ogImage.content = contact.photoUrl
    const twitterImage = document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]')
    if (twitterImage) twitterImage.content = contact.photoUrl
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
