# Fuga

PWA: sueltas el CSV/Excel del banco y ves recurrentes, comisiones y el agujero al año **en este navegador**. El extracto no sale de tu PC.

URL prevista: https://gonxcm-creator.github.io/fuga/

## Qué hace (v0.1)

- Parsea CSV/TSV/XLSX en el cliente (fechas DD/MM/YYYY, importes ES, céntimos).
- Marca recurrentes (≥2 cargos, importe ±5% o ±0,50 €) y comisiones por palabras clave.
- Informe: €/mes, **€/año en grande**, top fugas, ficha por cargo, texto WhatsApp.
- Guías de exportar: CaixaBank, BBVA, Santander, Revolut, N26.
- IndexedDB guarda **solo** el informe derivado — nunca el CSV crudo.
- Cero POST/fetch de movimientos a un servidor.

## Stack

- Vite + TypeScript + `xlsx` (SheetJS OSS)
- Hash router (`#/…`), `base: /fuga/` (GitHub Pages)
- PWA (`vite-plugin-pwa`) · MIT

## Qué NO hay

- Open Banking, OCR, cuentas, Stripe, analytics
- Next, Firebase, Dexie, Tailwind CDN
- Cancelación automática en el banco

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

Demo local: en la landing, «Probar con CSV de ejemplo» (`public/demo-extracto.csv`).

## Privacidad

No hay servidor de app. Si DevTools muestra un POST de movimientos, el producto está roto. El `fetch` del CSV demo es un GET al estático de la propia Pages.

## Deploy

Push a `main` → `.github/workflows/pages.yml` (Node 22) publica `dist/`.  
Settings → Pages → Source = GitHub Actions.

## Roadmap v0.2 (no implementado)

1. Más bancos en la guía y cabeceras CSV raras (ING, Openbank, EVO).
2. Diccionario de comercios ampliable por el usuario (sin nube).
3. Comparar dos periodos del mismo banco (antes/después de cortar).
4. Recordatorio local («revisar en 30 días») sin cuentas.
5. Exportar informe a PDF tipográfico (además de imprimir).
