# @nick-lukashik/ui

The Mono Brutal kit shared by the Next.js sites (landing-web, id-web): black and white, square corners, 1px lines, Sofia Sans Extra Condensed caps for titles, Martian Mono for the rest, one green (`signal`) that means "live". Text pairs meet WCAG AA on black (`styles.test.ts` checks them).

## What is in it

- `styles.css`: tokens (`tokens.css`), the Tailwind theme (`theme.css`: every radius is 0, every shadow is none) and utilities (`wrap`, `display`, `label`, `live-dot`, `ticker-track`, `flow`, `reveal`, `float-letter`, the roulette). Motion stops with `prefers-reduced-motion`.
- `fonts.css`: the two families through Fontsource, Latin and Cyrillic, self-hosted (the CSP allows no font hosts).
- Components (`.`): the shadcn/ui set (radix-ui), restyled. The kit's own: `SectionHead`, `PageHead`, `LiveDot`, `Ticker`, `FilterList`, `Wordmark`, `Monogram`, `FloatingWordmark`, `Roulette`.
- Next.js (`./next`): `RouteRoulette`, the roulette wired to the App Router.

## Using it

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "@nick-lukashik/ui/fonts.css";
@import "@nick-lukashik/ui/styles.css";
@source "../../node_modules/@nick-lukashik/ui/dist";
```

```tsx
import { Button, SectionHead } from '@nick-lukashik/ui'
import { RouteRoulette } from '@nick-lukashik/ui/next'

<RouteRoulette
    pages={[{ path: '/', name: t('home'), hint: t('homeHint') }]}
    labels={{ opening: t('opening'), site: 'nick-lukashik.com', page: t('page') }}
/>
```

Every string comes from the site (props), so the kit has no catalogs. Components that render a `style` attribute on the server (chart, progress, sidebar, sonner, toggle-group, code-block) need care under the nonce CSP: render them after hydration, or put the Sonner stylesheet hash in `STYLE_HASHES`.

## Showcase

`pnpm --filter @nick-lukashik/ui demo` builds `demo/dist/index.html`, one self-contained page with every component.

## Changing it

A component that comes from shadcn (`pnpm exec shadcn add <name>` in a scratch app, then copy it here): drop `dark:` classes and rounded corners, use `ring-1 ring-ring` for focus, titles in `font-heading` caps. `components.test.ts` fails on what was missed.
