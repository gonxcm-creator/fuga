// Ajustes: sueldo neto opcional y borrar informe local.
// El sueldo solo vive en localStorage.
import { formatEuros, parseEsAmount } from '../lib/money.ts'
import { loadSettings } from '../lib/settings.ts'

export function ajustesHtml(): string {
  const s = loadSettings()
  const value =
    s.netSalaryCents != null ? (s.netSalaryCents / 100).toFixed(2).replace('.', ',') : ''
  return `
    <main>
      <p class="muted"><a href="#/">← Drop</a></p>
      <h1>Ajustes</h1>
      <form id="settings-form" class="card">
        <label for="salary">Sueldo neto mensual (opcional)</label>
        <input
          id="salary"
          name="salary"
          type="text"
          inputmode="decimal"
          placeholder="1.200,00"
          value="${value}"
          aria-describedby="salary-hint"
        />
        <p class="muted" id="salary-hint">Sirve para estimar horas de trabajo al año en el informe. No se sube a ningún sitio.</p>
        <button type="submit" class="btn">Guardar</button>
      </form>
      <div class="card" style="margin-top:1rem">
        <p>Borrar el informe guardado en este navegador (IndexedDB). El extracto ya no está; solo el resumen.</p>
        <button type="button" class="btn btn-secondary" id="clear-report">Borrar informe local</button>
        <p class="muted" id="clear-status" aria-live="polite"></p>
      </div>
      ${s.netSalaryCents != null ? `<p class="muted">Ahora: ${formatEuros(s.netSalaryCents)} netos/mes</p>` : ''}
    </main>
  `
}

export { parseEsAmount }
