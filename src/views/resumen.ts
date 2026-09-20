// Resumen WhatsApp (Lucía) + copiar; PDF vía window.print si cabe.
// No envía nada a servidores.
import { formatEuros } from '../lib/money.ts'
import { whatsappTemplate } from '../lib/texts.ts'
import type { Report } from '../lib/types.ts'

export function resumenHtml(report: Report | null): string {
  if (!report) {
    return `
      <main class="card">
        <h1>Resumen</h1>
        <p>No hay informe. Suelta un extracto primero.</p>
        <a class="btn" href="#/">Soltar extracto</a>
      </main>
    `
  }

  const text = whatsappTemplate({
    yearlyLabel: formatEuros(report.totalYearlyCents),
    monthlyLabel: formatEuros(report.totalMonthlyCents),
    top: report.recurrents.slice(0, 5).map((r) => ({
      name: r.cleanName,
      monthlyLabel: formatEuros(r.monthlyCents),
    })),
    feesLabel: formatEuros(report.feesTotalCents),
  })

  return `
    <main>
      <p class="muted"><a href="#/informe">← Informe</a></p>
      <h1>Para WhatsApp</h1>
      <textarea id="wa-text" class="wa" readonly rows="14" aria-label="Plantilla WhatsApp">${escapeText(text)}</textarea>
      <div class="actions">
        <button type="button" class="btn" id="copy-wa">Copiar</button>
        <button type="button" class="btn btn-secondary" id="print-wa">Imprimir / PDF</button>
      </div>
      <p class="muted" id="copy-status" aria-live="polite"></p>
    </main>
  `
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
