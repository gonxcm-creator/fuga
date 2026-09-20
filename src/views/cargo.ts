// Ficha de un recurrente: historial + Mantener / Revisar / Cancelar.
// Cancelar = ayuda en texto, no cancela nada en el banco.
import { formatEuros } from '../lib/money.ts'
import type { Report, Recurrent } from '../lib/types.ts'

export function cargoHtml(report: Report | null, id: string | null): string {
  const r: Recurrent | undefined = report?.recurrents.find((x) => x.id === id)
  if (!r) {
    return `
      <main class="card">
        <h1>Cargo</h1>
        <p class="muted">No encuentro ese cargo en el informe actual.</p>
        <a class="btn btn-secondary" href="#/informe">Volver al informe</a>
      </main>
    `
  }

  const hist = r.history
    .map(
      (h) =>
        `<li><span>${h.date.split('-').reverse().join('/')}</span> <span>${formatEuros(Math.abs(h.amountCents))}</span></li>`,
    )
    .join('')

  const cancelHelp =
    r.status === 'cancelar'
      ? `<p class="card help">Fuga no cancela por ti. Entra en la web/app del servicio o del banco y cancela la suscripción o el recibo. Si es un recibo domiciliado, suele bastar con «devolver recibo» o dar de baja el mandato.</p>`
      : ''

  return `
    <main>
      <p class="muted"><a href="#/informe">← Informe</a></p>
      <h1>${escapeHtml(r.cleanName)}</h1>
      <div class="card">
        <p><strong>${formatEuros(r.monthlyCents)}</strong> / mes</p>
        <p class="num-ano-sm">${formatEuros(r.yearlyCents)} / año</p>
        <p class="muted">${r.count} cargos parecidos · estado: ${r.status}</p>
      </div>

      <h2>Historial</h2>
      <ul class="hist-list">${hist}</ul>

      <h2>¿Qué haces?</h2>
      <div class="actions" id="cargo-actions" data-id="${escapeHtml(r.id)}">
        <button type="button" class="btn ${r.status === 'mantener' ? '' : 'btn-secondary'}" data-status="mantener">Mantener</button>
        <button type="button" class="btn ${r.status === 'revisar' ? '' : 'btn-secondary'}" data-status="revisar">Revisar</button>
        <button type="button" class="btn ${r.status === 'cancelar' ? '' : 'btn-secondary'}" data-status="cancelar">Cancelar</button>
      </div>
      ${cancelHelp}
    </main>
  `
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
