// Guías de exportar: 5 bancos, 4 pasos cada una (Elena).
// Sin Open Banking ni capturas mágicas.
import { BANK_GUIDES } from '../lib/texts.ts'

export function guiaHtml(): string {
  const blocks = BANK_GUIDES.map(
    (b) => `
    <details class="card bank" id="${b.id}">
      <summary><strong>${b.name}</strong></summary>
      <ol class="list-plain">
        ${b.steps.map((s) => `<li>${s}</li>`).join('')}
      </ol>
    </details>`,
  ).join('')

  return `
    <main>
      <p class="muted"><a href="#/">← Drop</a></p>
      <h1>Cómo exportar</h1>
      <p class="muted">Cuatro pasos por banco. Baja CSV o Excel y suéltalo en Fuga.</p>
      ${blocks}
    </main>
  `
}
