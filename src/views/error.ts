// Pantallas de error / no-extracto con frases exactas Elena.
// Enlace a guía y reintento de drop.
import { MSG_ERROR, MSG_NO_EXTRACT, MSG_EMPTY } from '../lib/texts.ts'

export type ErrorKind = 'error' | 'no-extract' | 'empty'

export function errorHtml(kind: ErrorKind = 'error'): string {
  const msg = kind === 'no-extract' ? MSG_NO_EXTRACT : kind === 'empty' ? MSG_EMPTY : MSG_ERROR
  return `
    <main class="card">
      <h1>No leí movimientos</h1>
      <p>${msg}</p>
      <a class="btn" href="#/">Probar otra vez</a>
      <a class="btn btn-secondary" href="#/guia">Abrir guía de exportar</a>
    </main>
  `
}
