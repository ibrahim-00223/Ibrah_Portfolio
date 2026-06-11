import type { StackNode, StackLink } from './stack'
import {
  getStackNodesRaw, saveStackNodes, resetKey,
} from './api'

export function getStackNodes(): StackNode[] {
  return getStackNodesRaw()
}

export function getStackLinks(): StackLink[] {
  return getStackNodes()
    .filter(n => n.parent)
    .map(n => ({ source: n.parent!, target: n.id }))
}

export { saveStackNodes as saveStack }

export function resetStack(): void {
  resetKey('stackNodes')
}

export function isUsingCustomStack(): boolean {
  return localStorage.getItem('portfolio_stack_nodes') !== null
}
