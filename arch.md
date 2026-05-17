tallyno-web/                          # Nuxt 3 + Nuxt UI + Tailwind
│
├── nuxt.config.ts
├── tailwind.config.ts
│
├── app/
│   └── app.vue                       # layout racine minimaliste
│
├── pages/
│   ├── s/
│   │   └── [token].vue               # summary public (SSR) — page la plus critique
│   ├── s/
│   │   └── [token]/
│   │       └── me.vue                # summary personnalisé (auth légère)
│   └── g/
│       └── [token].vue               # summary groupe consolidé (SSR)
│
├── components/
│   ├── summary/
│   │   ├── SummaryHeader.vue         # dépense + payeur + montant total
│   │   ├── DebtLine.vue              # "Ta part : 8 000 XAF → Freddy"
│   │   ├── StatusBadge.vue           # ✅ Confirmé / ⏳ En attente
│   │   └── SummaryFooter.vue         # "Géré avec Tallyno 🧾"
│   │
│   ├── cta/
│   │   ├── PayDeepLink.vue           # bouton MTN / Orange / Wave
│   │   ├── DownloadAppBanner.vue     # CTA téléchargement Flutter
│   │   └── ShareSummary.vue          # Web Share API → relance WhatsApp
│   │
│   └── states/
│       ├── SummarySkeleton.vue       # skeleton pendant le fetch
│       ├── TokenExpired.vue          # lien expiré — redirection app
│       └── SummaryError.vue          # erreur générique
│
├── composables/
│   ├── useSummary.ts                 # fetch + gestion token expiré
│   └── useDeepLink.ts               # construit les deep links MTN/Orange/Wave
│
├── server/
│   └── api/
│       └── summary/
│           └── [token].get.ts        # proxy vers NestJS — évite le CORS
│                                     # + injecte les Open Graph tags
│
├── middleware/
│   └── validate-token.ts             # vérifie TTL avant de servir la page
│
└── public/
└── og-default.png               # image Open Graph fallback

# Nuxt UI pour des composants pré-stylés et accessibles
https://ui.nuxt.com/docs/getting-started/installation/nuxt