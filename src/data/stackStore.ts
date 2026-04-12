import { stackNodes as staticNodes, type StackNode, type StackLink } from './stack'

const NODES_KEY = 'portfolio_stack_nodes'

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

// Links are always derived from the parent field — never stored separately
export function getStackLinks(): StackLink[] {
  return getStackNodes()
    .filter(n => n.parent)
    .map(n => ({ source: n.parent!, target: n.id }))
}

export function saveStack(nodes: StackNode[]): void {
  localStorage.setItem(NODES_KEY, JSON.stringify(nodes))
}

export function resetStack(): void {
  localStorage.removeItem(NODES_KEY)
}

export function isUsingCustomStack(): boolean {
  return localStorage.getItem(NODES_KEY) !== null
}
