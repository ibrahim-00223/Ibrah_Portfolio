# BRANDING — Ibrahim CISSE Portfolio

> Document de référence complet pour le design system et l'identité du portfolio.

---

## 1. Identité

| Élément        | Valeur                                        |
|----------------|-----------------------------------------------|
| **Nom**        | Ibrahim CISSE                                 |
| **Logo**       | `IC.` — monogramme, `font-display` (Syne) bold |
| **Rôle**       | GTM Engineer · AI Builder · Content Creator   |
| **Localisation** | Paris, France                               |
| **Domaine**    | ibrahim-cisse.fr                              |
| **Tagline**    | *"Je construis des systèmes à l'intersection de l'IA, de la data et du business — des outils qui font vraiment la différence."* |
| **Baseline footer** | *"Conçu & codé à la main"*              |

---

## 2. Palette de couleurs

### Brand

| Token              | Hex / Valeur              | Usage                              |
|--------------------|---------------------------|------------------------------------|
| `brand.pink`       | `#E6004C`                 | Accent principal, CTA, actifs      |
| `brand.pink hover` | `#cc003d`                 | Hover sur btn-primary              |
| `brand.pink light` | `#ff4d7d` / `#ff4d8d`     | Gradients, skill bars              |
| `brand.pink soft`  | `#ff80a8`                 | Groupe RevOps dans le graph        |
| `brand.black`      | `#000000`                 | —                                  |
| `brand.white`      | `#FFFFFF`                 | —                                  |

### Fonds (Backgrounds)

| Token          | Hex         | Usage                                |
|----------------|-------------|--------------------------------------|
| `bg`           | `#080808`   | Fond principal du site               |
| `bg.surface`   | `#111111`   | Cartes, NavBar scrollée, modals      |
| `bg.raised`    | `#1a1a1a`   | Tags, inputs admin                   |
| Card gradient  | `linear-gradient(135deg, #0d0d1a 0%, #12080f 60%, #0d0d1a 100%)` | PlayerCard, flip card back, popups |

### Texte

| Token              | Valeur                        | Usage                     |
|--------------------|-------------------------------|---------------------------|
| `text.primary`     | `#FFFFFF`                     | Titres, valeurs principales |
| `text.secondary`   | `rgba(255,255,255,0.55)`      | Corps, labels nav          |
| `text.tertiary`    | `rgba(255,255,255,0.28)`      | Eyebrows, hints, footnotes |

### Bordures

| Token            | Valeur                       | Usage                        |
|------------------|------------------------------|------------------------------|
| `border`         | `rgba(255,255,255,0.08)`     | Bordure standard             |
| `border.strong`  | `rgba(255,255,255,0.15)`     | Hover état actif             |
| `border.accent`  | `rgba(230,0,76,0.35)`        | Bordure rose (tag-pink, etc.)|

### Scrollbar

```css
::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: #080808; }
::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
```

### Sélection de texte

```css
::selection {
  background: rgba(230, 0, 76, 0.25);
  color: #fff;
}
```

### Couleurs de statut (timeline / scorecard)

| Nom      | Hex approx.   | Contexte                               |
|----------|---------------|----------------------------------------|
| `amber`  | `#f59e0b`     | Phase Content (2021-2024), BTS         |
| `cyan`   | `#22d3ee`     | Phase Sales (2024-2025), Growth        |
| `green`  | `#4ade80`     | Phase RevOps/AI (2025+), IA formation  |

### Seuils de couleur (skill rings)

| Score       | Couleur    |
|-------------|------------|
| ≥ 85        | `#4ade80` (vert)   |
| 75 – 84     | `#E6004C` (rose)   |
| 65 – 74     | `#f59e0b` (amber)  |
| < 65        | `#94a3b8` (gris)   |

---

## 3. Typographie

| Token         | Police                                | Usage                        |
|---------------|---------------------------------------|------------------------------|
| `font-display`| **Syne** (sans-serif)                 | Logo `IC.`, titres `h1/h2`   |
| `font-sans`   | **Inter**, system-ui, sans-serif      | Corps de texte               |
| `font-mono`   | **JetBrains Mono**, Consolas, mono    | Tags, eyebrows, labels stats |

### Tailles display (responsive clamp)

| Token          | Clamp                               | Line-height | Letter-spacing |
|----------------|-------------------------------------|-------------|----------------|
| `display-xl`   | `clamp(3rem, 8vw, 6rem)`            | `1.0`       | `-0.03em`      |
| `display-lg`   | `clamp(2rem, 5vw, 3.5rem)`          | `1.1`       | `-0.02em`      |
| `display-sm`   | `clamp(1.4rem, 3vw, 2rem)`          | `1.2`       | `-0.01em`      |

### Patterns typographiques récurrents

- **Eyebrow section** : `text-xs font-mono tracking-widest uppercase text-text-tertiary`
  - Format : `"01 — Projets"`, `"02 — Stack"`, `"03 — Parcours"`
- **Logo** : `font-display font-bold text-lg text-white`
- **Labels stats** : `text-[9-11px] font-mono tracking-[0.12-0.2em] uppercase`

---

## 4. Ombres (Box Shadows)

| Token         | Valeur                                                                 |
|---------------|------------------------------------------------------------------------|
| `card`        | `0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`        |
| `card-hover`  | `0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(230,0,76,0.25)`          |
| `pink-glow`   | `0 0 24px rgba(230,0,76,0.25)`                                         |
| card PlayerCard | `0 0 0 1px rgba(230,0,76,0.15), 0 24px 60px rgba(0,0,0,0.6)`        |
| flip card back | `0 0 0 1px rgba(230,0,76,0.25), 0 24px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(230,0,76,0.04)` |

---

## 5. Animations

### Keyframes

| Nom          | Effet                                          | Durée  |
|--------------|------------------------------------------------|--------|
| `fade-up`    | `translateY(20px) → 0`, `opacity 0 → 1`       | 0.6s   |
| `fade-in`    | `opacity 0 → 1`                               | 0.4s   |
| `pulse-pink` | `opacity 1 → 0.5 → 1` infinite                | 2s     |

### Easing standard

```ts
ease: [0.22, 1, 0.36, 1]  // cubic-bezier custom "spring-out"
```

### Stagger (Framer Motion — Hero)

```ts
staggerChildren: 0.12
delayChildren: 0.1
```

---

## 6. Composants UI

### Boutons

| Classe        | Style                                                |
|---------------|------------------------------------------------------|
| `btn-primary` | Fond `#E6004C`, texte blanc, `rounded-md`, hover `#cc003d`, active scale 95% |
| `btn-ghost`   | Bordure `border`, texte `text-secondary`, hover border-strong + text-primary |

### Tags / Pills

| Classe     | Style                                                       |
|------------|-------------------------------------------------------------|
| `tag`      | `bg-bg-raised border border-border text-text-secondary font-mono text-xs rounded` |
| `tag-pink` | `border-border-accent text-brand-pink bg-[rgba(230,0,76,0.06)]` |

### Cartes

```css
.card {
  bg-bg-surface border border-border rounded-lg shadow-card
  hover: shadow-card-hover border-border-strong
}
```

### Accent line

```css
.accent-line { width: 2rem; height: 2px; background: #E6004C; }
```

### Inputs admin

```css
.admin-input {
  bg-bg-raised border border-border rounded-lg
  focus: border-brand-pink/50
}
```

---

## 7. Layout

- **Max width contenu** : `max-w-5xl` (80rem)
- **Padding horizontal** : `px-4 md:px-8`
- **Sections** : `py-24`
- **NavBar** : `h-16`, `z-50`, transparent → `bg-bg/95 backdrop-blur-md` au scroll
- **Grid hero** : `md:grid-cols-2 gap-12 md:gap-16`

---

## 8. Navigation

| Label      | Ancre      |
|------------|------------|
| Projets    | `#projects` |
| Stack      | `#stack`   |
| Parcours   | `#about`   |
| CTA        | "Me contacter" → modal |

---

## 9. Liens sociaux

| Plateforme       | Handle / URL                                              |
|------------------|-----------------------------------------------------------|
| LinkedIn         | [ibrahim-cissé](https://www.linkedin.com/in/ibrahim-ciss%C3%A9-6981b8240/) |
| GitHub           | [ibrahim-00223](https://github.com/ibrahim-00223)         |
| YouTube          | [@by_ibrah07](https://youtube.com/@by_ibrah07)            |
| Notion Calendar  | [Réserver un call](https://calendar.notion.so/meet/ibrahimcisse1/044on4pg6) |

---

## 10. Contenu — Projets

| #  | Nom                          | Statut    | Tags clés                              |
|----|------------------------------|-----------|----------------------------------------|
| 01 | **AWA**                      | En cours  | Python, RAG, MCP, LLM, FastAPI         |
| 02 | **Outil de Prospection Interne** | Complété | Airtable, n8n, No-Code, CRM          |
| 03 | **CoolBot**                  | En cours  | Python, MistralAI, Crawl4AI, RAG       |

Statuts disponibles : `Complété` · `En cours` · `Concept`

---

## 11. Stack technique (Knowledge Graph)

| Groupe          | Couleur     | Éléments                                                  |
|-----------------|-------------|-----------------------------------------------------------|
| **Langages**    | `#ffffff`   | Python, JavaScript, SQL, HTML/CSS, JSON                   |
| **Frameworks**  | `#E6004C`   | FastAPI, LangChain, Pandas, Crawl4AI, Flask               |
| **IA & Data**   | `#ff4d8d`   | Mistral AI, OpenAI, RAG, MCP, Base vectorielle, Multi-agent |
| **RevOps & Growth** | `#ff80a8` | Airtable, n8n, Semrush, GSC, SEO/GEO                  |
| **DevOps & Outils** | `rgba(255,255,255,0.55)` | Git/GitHub, Docker, Notion API, WhatsApp API |

---

## 12. Scorecard (PlayerCard)

Score overall = moyenne des 5 modules.

| Module           | Short | Skills                                                         | Score ~  |
|------------------|-------|----------------------------------------------------------------|----------|
| **Business**     | BUS   | Storytelling 92, Sales Strategy 88, Négociation 85, Client Mgmt 87 | 88  |
| **IA**           | AI    | LLM/Prompting 85, Multi-agent 80, AI Automation 82, No-code AI 81 | 82 |
| **Data**         | DAT   | Data Enrichment 78, CRM Analytics 74, Reporting 72, SQL/Sheets 72 | 74 |
| **Engineering**  | ENG   | Python 73, FastAPI 68, API Integration 72, React/Web 67       | 70       |
| **Proj. Mgmt**   | PM    | GTM Planning 80, Roadmapping 79, Process Design 78, Coordination 75 | 78 |

HeroFlipCard SKILLS (séparées) :

| Label              | Valeur |
|--------------------|--------|
| Business           | 88     |
| IA                 | 82     |
| Data               | 74     |
| Engineering        | 70     |
| Project Management | 78     |

---

## 13. Parcours — Carrière

| Période          | Titre                    | Entreprise  | Couleur |
|------------------|--------------------------|-------------|---------|
| 2021 — 2024      | YouTube Content Manager  | —           | amber   |
| 2024 — 2025      | Key Account Manager      | Daikin      | cyan    |
| 2025 — Aujourd'hui | GTM & AI Engineer      | Scalefast   | green   |

---

## 14. Parcours — Académique

| Période          | Formation                          | École                                  | Couleur |
|------------------|------------------------------------|----------------------------------------|---------|
| 2019 — 2021      | BTS Management Commercial          | Formation initiale                     | amber   |
| 2021 — 2024      | Growth & Stratégie Éditoriale      | Auto-formation                         | cyan    |
| 2024 — Présent   | IA & Ingénierie Logicielle         | DeepLearning.AI · Anthropic · OpenAI   | green   |

---

## 15. Ton & Voix

- **Langue** : Français
- **Registre** : Direct, technique, sans fioriture
- **Persona** : Builder praticien — pas théoricien
- **Mots clés récurrents** : construire, systèmes, IA, data, business, terrain, scalable, résultats mesurables
- **Pas de** : jargon creux, buzzwords vides, texte corporate

---

## 16. Photo

- **Fichier** : `public/ibrahim.png`
- **Usage** : HeroFlipCard (front), flip card back (miniature), ContactModal (avatar), PlayerCard (identité)
- **Traitement** : `object-cover object-top` — cadrage sur le visage

---

*Généré le 2026-05-27 — source de vérité : codebase `mon-portfolio`*
