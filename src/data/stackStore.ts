import { stackNodes as staticNodes, stackLinks as staticLinks, type StackNode, type StackLink } from './stack'

const NODES_KEY = 'portfolio_stack_nodes'
const LINKS_KEY = 'portfolio_stack_links'

export function getStackNodes(): StackNode[] {
  try {
    const stored = localStorage.getItem(NODES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as StackNode[]
    }
  } catch { /* silent fallback */ }
  return staticNodes
}

export function getStackLinks(): StackLink[] {
  try {
    const stored = localStorage.getItem(LINKS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed as StackLink[]
    }
  } catch { /* silent fallback */ }
  return staticLinks
}

export function saveStack(nodes: StackNode[], links: StackLink[]): void {
  localStorage.setItem(NODES_KEY, JSON.stringify(nodes))
  localStorage.setItem(LINKS_KEY, JSON.stringify(links))
}

export function resetStack(): void {
  localStorage.removeItem(NODES_KEY)
  localStorage.removeItem(LINKS_KEY)
}

export function isUsingCustomStack(): boolean {
  return localStorage.getItem(NODES_KEY) !== null
}
