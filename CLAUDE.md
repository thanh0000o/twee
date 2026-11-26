# twee — thanhlambeetstwee.com

Persoonlijke website in early-2000s/Neocities-stijl. pnpm-monorepo (oorspronkelijk opgezet in Replit), live via Vercel.

## Vaste regels

Werkwijze voor elke wijziging:

1. Werk op een aparte branch, nooit rechtstreeks op `main`.
2. Push de branch meteen naar GitHub.
3. Geef Gerrit de Vercel preview-link en een korte lijst van wat er veranderd is.
4. Merge pas naar `main` als Gerrit "zet live" zegt: `main` gaat live via Vercel.

- Controleer visuele wijzigingen zelf met Playwright op desktop- en mobielformaat voordat je ze aan Gerrit toont.

## Hoe het in elkaar zit

- `artifacts/gerrit-thanh-landing/` — de website (Vite + React 19, Tailwind 4, wouter-routing, shadcn/ui in `src/components/ui`).
  - Routes staan in `src/App.tsx`, pagina's in `src/pages/`, stijlen per pagina in `src/styles/`.
  - Blogposts/site-updates: `src/content/blog-posts.ts`. Werken: `src/lib/works*.ts` en `src/pages/works/...`.
  - Statische bestanden (muziek, cv, guestbook-smileys, covers) in `public/`.
  - Tests: `tests/*.test.mjs`, draaien met `node --test` (node:test + assert).
- `artifacts/api-server/` — Express 5 API (guestbook, bezoekersteller, muziek, health).
  - `build-vercel.mjs` bundelt de API naar `gerrit-thanh-landing/api/_server.mjs`; `api/index.mjs` is de Vercel-functie.
- `artifacts/mockup-sandbox/` — losse sandbox voor UI-mockups, niet deel van de live site.
- `lib/db` — Drizzle + Postgres (schema: guestbook, visitors). Vereist `DATABASE_URL`.
- `lib/api-spec` (OpenAPI + orval) genereert `lib/api-zod` en `lib/api-client-react`.
- `scripts/` — kleine hulpscripts en tests.

## Deploy

Vercel bouwt `artifacts/gerrit-thanh-landing` (`vercel.json`): `vite build` naar `dist/public`, plus de API-bundel. `/api/*` wordt herschreven naar de serverless functie, de rest naar `index.html` (SPA).

## Commando's

- Alleen pnpm (npm/yarn worden geweigerd door `preinstall`).
- `pnpm install`, `pnpm run typecheck`, `pnpm run build` (vanuit de root).
- Dev-server site: `pnpm --filter @workspace/gerrit-thanh-landing dev` (poort 5173, of `PORT`).
