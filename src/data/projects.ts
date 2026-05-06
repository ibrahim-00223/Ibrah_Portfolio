export type Project = {
  id: string
  number: string
  name: string
  shortDesc: string
  fullDesc: string
  status: 'Complété' | 'En cours' | 'Concept'
  tags: string[]
  highlights: string[]
  links?: { label: string; url: string }[]
  youtubeId?: string
  thumbnail?: string
}

export const projects: Project[] = [
  {
    id: 'awa',
    number: '01',
    name: 'AWA',
    shortDesc: 'Plateforme d\'agents IA pour l\'intégration administrative des ressortissants étrangers',
    fullDesc:
      'AWA est une plateforme d\'agents IA conversationnels conçue pour les ressortissants étrangers en France, inspirée de Limova.ai. L\'objectif : faciliter la transition culturelle entre la langue maternelle et le français, notamment sur le plan administratif. Le produit permet aux utilisateurs de comprendre rapidement leurs documents et démarches administratives françaises, tout en maintenant une transition fluide depuis leur langue natale — en commençant par le Bambara.',
    status: 'En cours',
    tags: ['Python', 'RAG', 'MCP', 'Data Gouv API', 'Base vectorielle', 'LLM', 'FastAPI'],
    highlights: [
      'Architecture RAG avec accès via MCP à Data Gouv',
      'Base de données vectorielles de documents et démarches administratives',
      'Interface conversationnelle multilingue (Bambara → Français)',
      'Agents spécialisés par domaine administratif (CAF, Préfecture, Sécurité sociale...)',
      'Inspiré de Limova.ai, adapté au contexte administratif français',
    ],
  },
  {
    id: 'prospection-scalefast',
    number: '02',
    name: 'Outil de Prospection Interne',
    shortDesc: 'Centralisation des campagnes Cold Calling pour une agence outbound SaaS B2B',
    fullDesc:
      'Chez SCALEFAST — agence outbound pour SaaS B2B IA, Data et Cyber — ma première mission a été de résoudre le chaos des centaines de fichiers CSV et XLSX pour la prospection téléphonique. J\'ai conçu un outil permettant de centraliser toutes les campagnes de cold calling, détecter des patterns de succès et donner aux sales une interface terrain efficace. Construit sur Airtable pour la BDD et les interfaces, avec des automatisations n8n pour la génération et l\'enrichissement des listes.',
    status: 'Complété',
    tags: ['Airtable', 'n8n', 'No-Code', 'Automatisation', 'CRM', 'Enrichissement data'],
    highlights: [
      'Remplacement de centaines de fichiers CSV/XLSX par une BDD centralisée',
      'Interface terrain dédiée pour les sessions de Cold Calling',
      'Détection automatique de patterns de succès par campagne',
      'Automatisations n8n pour la génération et l\'enrichissement de listes',
      'Intégration avec les outils outbound existants de l\'agence',
    ],
  },
  {
    id: 'coolbot',
    number: '03',
    name: 'CoolBot',
    shortDesc: 'Agent IA RAG pour techniciens frigoristes — accès instantané à la doc technique',
    fullDesc:
      'En tant qu\'ancien technicien frigoriste, j\'ai vécu le problème en première personne : un technicien peut perdre jusqu\'à 2h par jour à chercher une information dans une documentation technique volumineuse — et parfois ne pas la trouver. CoolBot est un agent IA RAG qui donne aux techniciens un accès rapide et sécurisé à la documentation technique de leurs équipements, directement depuis le terrain. Le système crawle et indexe les documentations des fabricants pour les rendre interrogeables en langage naturel.',
    status: 'En cours',
    tags: ['Python', 'MistralAI', 'Crawl4AI', 'RAG', 'Base vectorielle', 'LangChain'],
    highlights: [
      'Réduction du temps de recherche de ~2h/jour à quelques secondes',
      'Crawl et indexation automatique des docs fabricants avec Crawl4AI',
      'Pipeline RAG avec MistralAI pour des réponses précises et sourcées',
      'Interface simple conçue pour une utilisation terrain',
      'Construit à partir d\'un vécu terrain en tant que technicien frigoriste',
    ],
  },
]
