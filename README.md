# Tallyno Web

Public recap pages for people who do not have the Tallyno app. When a group shares a recap on WhatsApp, the link opens
here: the expense or tontine round, who has paid, and how to pay the right person by Mobile Money.

Tallyno never holds money. These pages only read what the group recorded in the app.

## Routes

| Route | What it shows |
| --- | --- |
| `/s/:token` | One expense or one tontine round: progress, and names with amounts on DETAILED links |
| `/s/:token/me` | The viewer's own share and the payee's Mobile Money number (PRIVATE links ask "who are you") |
| `/g/:token` | A group's balances and the minimum transfers to settle it |
| `/` | Redirects to the marketing site |

Links expire after 7 days (HTTP 410). Visibility follows the token level set in the app:

- `SOCIAL`: counts only, never who has not paid (same rule as the WhatsApp text);
- `DETAILED`: every name, status and amount;
- `PRIVATE`: names for the picker, then only the chosen person's amount.

tallyno-api returns every participant's status at every level, so the filtering happens in this app's server
(`server/utils/recap.ts`) before anything reaches the browser, SSR payload included. The page rules live in
`app/utils/summary-view.ts`. Both are unit tested.

The name on PRIVATE and DETAILED links is self-declared: anyone holding the link can pick any name. The link itself is
the access control.

## Stack

- Nuxt 4 (SSR, so WhatsApp reads the Open Graph tags from the first HTML) and Nuxt UI
- Tailwind CSS 4 with the petrol palette shared with the mobile app and the marketing site
- DM Sans, self-hosted through Fontsource
- A Nitro proxy (`server/api`) to the NestJS public endpoints, so the browser never calls the API directly

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `NUXT_API_BASE` | `http://localhost:3000` | tallyno-api base URL (server side only) |
| `NUXT_PUBLIC_SITE_URL` | `https://tallyno.example` | Public origin of this app, for Open Graph URLs |
| `NUXT_PUBLIC_MARKETING_URL` | `https://tallyno.example` | Marketing site, target of `/` and of the install buttons |

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3003
pnpm test         # unit tests (Vitest)
pnpm typecheck
pnpm build && node .output/server/index.mjs
```

Every response carries `X-Robots-Tag: noindex, nofollow`, `Referrer-Policy: no-referrer`, `Cache-Control: private,
no-store` and `frame-ancestors 'none'`: recaps contain names and amounts, and the token in the URL is the only access
control. Upstream errors are mapped to 404, 410 or 502 without the API's URL or message.
