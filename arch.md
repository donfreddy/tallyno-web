# Architecture

```
tallyno-web/                     Nuxt 4 + Nuxt UI + Tailwind 4
├── nuxt.config.ts               runtime config, security headers, SSR route rules
├── server/
│   ├── api/summary/[token].get.ts  proxy to GET /api/v1/public/summary/:token (?viewerName=)
│   ├── api/groups/[token].get.ts   proxy to GET /api/v1/public/groups/:token
│   └── utils/recap.ts              filters by level, maps errors (tests/recap.test.ts)
└── app/
    ├── pages/
    │   ├── index.vue            302 to the marketing site
    │   ├── s/[token]/index.vue  expense or tontine round recap
    │   ├── s/[token]/me.vue     the viewer's own share, name picker on PRIVATE links
    │   └── g/[token].vue        group balances and simplified transfers
    ├── components/
    │   ├── summary/             SummaryHeader, SummarySkeleton
    │   ├── ProgressCard         counts only, safe on SOCIAL links
    │   ├── ParticipantList      names, status, amounts (DETAILED only)
    │   ├── PayInstructions      payee number and amount with copy buttons
    │   ├── CopyField, ShareSummary, InstallCta, BrandMark
    │   └── SummaryState         410 / 404 / 5xx messages, sets the HTTP status
    ├── composables/useSummary.ts
    ├── utils/summary-view.ts    pure visibility rules (tests/summary-view.test.ts)
    └── types/summary.ts         mirrors tallyno-api public-summary.service.ts
```

## Decisions

- No Mobile Money deep links: MTN MoMo and Orange Money publish none, so the page hands over the number and the amount
  to copy instead of opening a fake scheme.
- SOCIAL links never list who has not paid, matching `summary-text.builder.ts` and TALLYNO_TONE.md.
- The root redirects to the marketing site, so the app works on its own subdomain or behind a path-based router. With a
  path router, send `/s/`, `/g/`, `/api/`, `/_nuxt/`, `/og-default.png` and the favicons to this app, everything else
  to the marketing site.
- Nuxt UI stays, though only `<UApp>` is used today: the planned "manage from the web" screens need its forms, modals
  and toasts.
