// Lista de comisiones detectadas en el periodo del extracto.
// Solo lectura del informe derivado.
import { formatEuros } from '../lib/money.ts'
import type { Report } from '../lib/types.ts'

export function comisionesHtml(report: Report | null): string {
  if (!report || !report.fees.length) {
    return `
      <main class="card">
        <h1>Comisiones</h1>
        <p class="muted">No hay comisiones marcadas en este informe.</p>
        <a class="btn btn-secondary" href="#/informe">Volver</a>
      </main>
    `
  }
  const rows = report.fees
    .map(
      (f) =>
        `<li><span>${f.date.split('-').reverse().join('/')} · ${escapeHtml(f.cleanName)}</span><span>${formatEuros(f.amountCents)}</span></li>`,
    )
    .join('')
  return `
    <main>
      <p class="muted"><a href="#/informe">← Informe</a></p>
      <h1>Comisiones</h1>
      <p>Total periodo: <strong>${formatEuros(report.feesTotalCents)}</strong></p>
      <ul class="hist-list">${rows}</ul>
    </main>
  `
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
