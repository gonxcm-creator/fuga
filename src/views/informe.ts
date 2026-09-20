// Informe: €/año GRANDE en rojo solo aquí; top fugas; comisiones.
// Lee informe ya derivado (IndexedDB / memoria).
import { formatEuros } from '../lib/money.ts'
import { hoursForLeak, loadSettings } from '../lib/settings.ts'
import { MSG_EMPTY } from '../lib/texts.ts'
import type { Report } from '../lib/types.ts'

export function informeHtml(report: Report | null): string {
  if (!report) {
    return `
      <main class="card">
        <h1>Informe</h1>
        <p>Aún no hay informe. Suelta un extracto en la pantalla de inicio.</p>
        <a class="btn" href="#/">Soltar extracto</a>
      </main>
    `
  }

  const emptyFugas = report.recurrents.length === 0 && report.fees.length === 0
  const settings = loadSettings()
  const hours =
    settings.netSalaryCents != null
      ? hoursForLeak(report.totalYearlyCents, settings.netSalaryCents)
      : null

  const top = report.recurrents.slice(0, 8)
  const list = top
    .map(
      (r) => `
      <li>
        <a class="fuga-row" href="#/cargo/${encodeURIComponent(r.id)}">
          <span class="fuga-name">${escapeHtml(r.cleanName)}</span>
          <span class="fuga-amt">${formatEuros(r.monthlyCents)}/mes</span>
        </a>
      </li>`,
    )
    .join('')

  return `
    <main>
      <p class="muted"><a href="#/">← Nuevo extracto</a></p>
      <h1>Tu informe</h1>

      <div class="card hero-ano" aria-label="Total al año">
        <p class="label-ano">Al año se te van</p>
        <p class="num-ano">${formatEuros(report.totalYearlyCents)}</p>
        <p class="muted">≈ ${formatEuros(report.totalMonthlyCents)} / mes</p>
        ${
          hours != null
            ? `<p class="hours">≈ <strong>${hours} h</strong> de trabajo al año (con tu sueldo neto)</p>`
            : `<p class="muted"><a href="#/ajustes">Añade sueldo neto</a> para ver horas de trabajo</p>`
        }
      </div>

      ${
        emptyFugas
          ? `<p class="card">${MSG_EMPTY}</p>`
          : `
      <h2>Top fugas</h2>
      <ul class="fuga-list">${list || `<li class="muted">${MSG_EMPTY}</li>`}</ul>

      <h2>Comisiones</h2>
      <p>${
        report.fees.length
          ? `${report.fees.length} cargos · ${formatEuros(report.feesTotalCents)} en el periodo`
          : 'No vi comisiones claras (mantenimiento, cuota tarjeta…).'
      }</p>
      ${report.fees.length ? `<a class="btn btn-secondary" href="#/comisiones">Ver comisiones</a>` : ''}
      `
      }

      <div class="actions">
        <a class="btn" href="#/resumen">Texto WhatsApp</a>
        <a class="btn btn-secondary" href="#/guia">Cómo exportar</a>
      </div>
    </main>
  `
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
