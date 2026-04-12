export type StackNode = {
  id: string
  group: 'lang' | 'framework' | 'ai' | 'revops' | 'devops'
  label: string
  size: number
  parent?: string   // ID du nœud parent — crée automatiquement le lien
}

export type StackLink = {
  source: string
  target: string
}

export const groupColors: Record<string, string> = {
  lang:      '#ffffff',
  framework: '#E6004C',
  ai:        '#ff4d8d',
  revops:    '#ff80a8',
  devops:    'rgba(255,255,255,0.55)',
}

export const groupLabels: Record<string, string> = {
  lang:      'Langages',
  framework: 'Frameworks',
  ai:        'IA & Data',
  revops:    'RevOps & Growth',
  devops:    'DevOps & Outils',
}

export const stackNodes: StackNode[] = [
  // ── Langages (nœuds racines) ─────────────────────────────────────────────
  { id: 'python',     group: 'lang',      label: 'Python',           size: 14 },
  { id: 'javascript', group: 'lang',      label: 'JavaScript',       size: 8  },
  { id: 'sql',        group: 'lang',      label: 'SQL',              size: 8  },
  { id: 'html',       group: 'lang',      label: 'HTML/CSS',         size: 7  },
  { id: 'json',       group: 'lang',      label: 'JSON',             size: 6  },

  // ── Frameworks Python ─────────────────────────────────────────────────────
  { id: 'fastapi',    group: 'framework', label: 'FastAPI',          size: 11, parent: 'python' },
  { id: 'langchain',  group: 'framework', label: 'LangChain',        size: 11, parent: 'python' },
  { id: 'pandas',     group: 'framework', label: 'Pandas',           size: 9,  parent: 'python' },
  { id: 'crawl4ai',   group: 'framework', label: 'Crawl4AI',         size: 9,  parent: 'python' },
  { id: 'flask',      group: 'framework', label: 'Flask',            size: 8,  parent: 'python' },

  // ── IA & Data (nœuds racines) ─────────────────────────────────────────────
  { id: 'mistral',    group: 'ai',        label: 'Mistral AI',       size: 13 },
  { id: 'openai',     group: 'ai',        label: 'OpenAI',           size: 10 },
  { id: 'rag',        group: 'ai',        label: 'RAG',              size: 12 },
  { id: 'mcp',        group: 'ai',        label: 'MCP',              size: 9  },
  { id: 'vectordb',   group: 'ai',        label: 'Base vectorielle', size: 10 },
  { id: 'multiagent', group: 'ai',        label: 'Multi-agent',      size: 9  },

  // ── RevOps & Growth (nœuds racines) ──────────────────────────────────────
  { id: 'airtable',   group: 'revops',    label: 'Airtable',         size: 10 },
  { id: 'n8n',        group: 'revops',    label: 'n8n',              size: 10 },
  { id: 'semrush',    group: 'revops',    label: 'Semrush',          size: 8  },
  { id: 'gsc',        group: 'revops',    label: 'GSC',              size: 7  },
  { id: 'seo',        group: 'revops',    label: 'SEO/GEO',          size: 9  },

  // ── DevOps & Outils (nœuds racines) ──────────────────────────────────────
  { id: 'git',        group: 'devops',    label: 'Git/GitHub',       size: 9  },
  { id: 'docker',     group: 'devops',    label: 'Docker',           size: 8  },
  { id: 'notion',     group: 'devops',    label: 'Notion API',       size: 7  },
  { id: 'whatsapp',   group: 'devops',    label: 'WhatsApp API',     size: 7  },
]

// Liens statiques conservés pour compatibilité — stackStore les calcule depuis parent
export const stackLinks: StackLink[] = stackNodes
  .filter(n => n.parent)
  .map(n => ({ source: n.parent!, target: n.id }))
