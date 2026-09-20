# Fuga

PWA: sueltas el CSV/Excel del banco y ves recurrentes, comisiones y el agujero al año **en este navegador**. El extracto no sale de tu PC.

URL: https://gonxcm-creator.github.io/fuga/

## Stack

- Vite + TypeScript
- Hash router (`#/…`)
- `base: /fuga/` (GitHub Pages)
- PWA (`vite-plugin-pwa`)
- MIT

## Qué hay hoy (Día 3)

Cascarón: landing + drop (sin parser), stubs de rutas, Action Pages, README, LICENSE.

## Qué NO hay (aún / nunca en v0.1)

- Parser CSV ES (día 4)
- PDF
- Open Banking, login, Stripe, analytics
- Next, Firebase, Tailwind CDN, Dexie

## Desarrollo

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Privacidad

No hay servidor de app. No se hace POST de movimientos. Si DevTools muestra uno, el producto está roto.

## Deploy

Push a `main` → workflow `.github/workflows/pages.yml` publica `dist/`.
En el repo: Settings → Pages → Source = GitHub Actions.

**No hagas push hasta que Gonzalo escriba exactamente `ok push`.**
