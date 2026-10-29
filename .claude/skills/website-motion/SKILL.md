---
name: website-motion
description: Regels voor animatie en scrollbeweging op Gerrits portfoliosite (GSAP, Lenis, React Bits). Gebruik bij elke wijziging die iets laat bewegen, verschijnen of scrollen.
---

# Website motion

De site heeft een bewuste retrostijl (Winamp, oude Neocities-sites, editoriale werkpagina's). Beweging moet daar rustig bij passen. Liever te weinig dan te veel.

## Waar alles zit

- `artifacts/gerrit-thanh-landing/src/motion/tokens.ts`: alle timings, easing en afstanden. Nieuwe waarden komen hier, nooit los in een component.
- `src/motion/smooth-scroll.tsx`: Lenis voor vloeiend scrollen, gekoppeld aan de GSAP-ticker en ScrollTrigger. Staat rond de router in `App.tsx`.
- `src/motion/use-reveal.ts`: hook die een element zacht laat verschijnen bij het scrollen.
- Bestaande CSS-animaties op de homepagina (`src/styles/home-motion.css`) blijven CSS. Niet omzetten naar GSAP.

## Vaste regels

1. Duur tussen 0.25 en 0.9 seconden. Gebruik `motion.duration.quick`, `base` of `slow`.
2. Easing is `power2.out`. Geen bounce, elastic of back.
3. Verplaatsing hoogstens 16 tot 24 px. Geen grote slides van buiten het scherm.
4. Elk element animeert maar één keer bij het scrollen (`once: true`).
5. Wat bij het laden al zichtbaar is, wordt niet verborgen en opnieuw getoond.
6. Respecteer `prefers-reduced-motion`: dan geen Lenis en geen GSAP-animaties. Gebruik `prefersReducedMotion()` uit tokens.
7. Lijsten, chatvensters, de guestbook en de works-rail scrollen zelf. Lenis laat die met rust via `allowNestedScroll`. Krijgt een nieuw scrollvak toch last, zet er `data-lenis-prevent` op.
8. Animeer alleen `transform` en `opacity` (of `autoAlpha`). Geen width, height, top of left.
9. Ruim GSAP altijd op met `gsap.context()` en `ctx.revert()` in de cleanup van een effect.
10. Raak de SVG-maskers en inktanimaties van de homepagina niet aan.

## React Bits

React Bits (reactbits.dev) is geen npm-pakket. Je kopieert een component in de code.

- Zet gekopieerde componenten in `src/components/react-bits/`, één bestand per component.
- Kies de TypeScript + CSS-versie, niet de Tailwind-versie, tenzij de pagina al Tailwind gebruikt.
- Pas de timings aan naar `tokens.ts` en controleer regel 1 tot 3.
- Eén opvallend React Bits-effect per pagina is genoeg.
- Zware achtergronden met WebGL of canvas enkel op de homepagina en nooit op de werkpagina's.

## Testen

- `pnpm run build` in `artifacts/gerrit-thanh-landing` moet slagen.
- Controleer op desktop en gsm-breedte, en één keer met reduced motion aan (in de browser devtools: Rendering > Emulate prefers-reduced-motion).
- Werk op een aparte branch en bekijk de Vercel-preview voor je naar main merget.
