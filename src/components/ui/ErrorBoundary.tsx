import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
          <div className="text-center space-y-4">
            <p className="text-brand-pink font-mono text-xs tracking-widest uppercase">Erreur système</p>
            <h1 className="font-display text-3xl text-white">Quelque chose a cassé</h1>
            <p className="text-text-secondary text-sm max-w-md">
              Une erreur inattendue est survenue. Rafraîchissez la page pour réessayer.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Rafraîchir
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
