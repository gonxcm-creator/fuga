// Entrada de Fuga: rutas, drop→parse→informe, sin POST de movimientos.
// Persistimos solo el informe derivado en IndexedDB.
import './style.css'
import { onRoute, navigate, type Route } from './router.ts'
import { parseExtractFile, parseExtractText } from './lib/parseExtract.ts'
import { buildReport } from './lib/buildReport.ts'
import { saveReport, loadReport, updateRecurrentStatus, clearReport } from './lib/idb.ts'
import { saveSettings } from './lib/settings.ts'
import { parseEsAmount } from './lib/money.ts'
import type { Report } from './lib/types.ts'
import { landingHtml } from './views/landing.ts'
import { informeHtml } from './views/informe.ts'
import { cargoHtml } from './views/cargo.ts'
import { comisionesHtml } from './views/comisiones.ts'
import { guiaHtml } from './views/guia.ts'
import { ajustesHtml } from './views/ajustes.ts'
import { resumenHtml } from './views/resumen.ts'
import { errorHtml } from './views/error.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

let cache: Report | null = null

async function ensureReport(): Promise<Report | null> {
  if (cache) return cache
  cache = await loadReport()
  return cache
}

async function ingestFile(file: File): Promise<void> {
  const status = document.querySelector('#drop-status')
  if (status) status.textContent = 'Leyendo en tu navegador…'
  const result = await parseExtractFile(file)
  if (!result.ok) {
    navigate('/error', { errorKind: result.kind })
    return
  }
  const report = buildReport(result.movements)
  cache = report
  await saveReport(report)
  if (report.recurrents.length === 0 && report.fees.length === 0) {
    navigate('/informe')
    return
  }
  navigate('/informe')
}

async function ingestDemo(): Promise<void> {
  const status = document.querySelector('#drop-status')
  if (status) status.textContent = 'Cargando ejemplo…'
  try {
    const url = `${import.meta.env.BASE_URL}demo-extracto.csv`
    const res = await fetch(url)
    if (!res.ok) throw new Error('demo')
    const text = await res.text()
    const result = await parseExtractText(text)
    if (!result.ok) {
      navigate('/error', { errorKind: result.kind })
      return
    }
    const report = buildReport(result.movements)
    cache = report
    await saveReport(report)
    navigate('/informe')
  } catch {
    navigate('/error', { errorKind: 'error' })
  }
}

function wireDrop(): void {
  const drop = document.querySelector<HTMLDivElement>('#drop')
  const file = document.querySelector<HTMLInputElement>('#file')
  const demo = document.querySelector<HTMLButtonElement>('#demo-btn')
  if (!drop || !file) return

  const open = () => file.click()
  drop.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('input')) return
    open()
  })
  drop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  })

  ;['dragenter', 'dragover'].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault()
      drop.classList.add('drop-active')
    })
  })
  ;['dragleave', 'drop'].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault()
      drop.classList.remove('drop-active')
    })
  })

  drop.addEventListener('drop', (e) => {
    const dt = (e as DragEvent).dataTransfer
    const f = dt?.files?.[0]
    if (f) void ingestFile(f)
  })

  file.addEventListener('change', () => {
    const f = file.files?.[0]
    if (f) void ingestFile(f)
    file.value = ''
  })

  demo?.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    void ingestDemo()
  })
}

function wireCargo(): void {
  const box = document.querySelector('#cargo-actions')
  if (!box) return
  const id = box.getAttribute('data-id')
  if (!id) return
  box.querySelectorAll<HTMLButtonElement>('button[data-status]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const status = btn.dataset.status as 'mantener' | 'revisar' | 'cancelar'
      cache = await updateRecurrentStatus(id, status)
      app.innerHTML = cargoHtml(cache, id)
      wireCargo()
      const nav = document.createElement('nav')
      nav.className = 'app-nav'
      nav.setAttribute('aria-label', 'Secciones')
      nav.innerHTML = `
        <a href="#/">Drop</a>
        <a href="#/informe">Informe</a>
        <a href="#/guia">Guía</a>
        <a href="#/ajustes">Ajustes</a>
      `
      app.appendChild(nav)
    })
  })
}

function wireAjustes(): void {
  const form = document.querySelector<HTMLFormElement>('#settings-form')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.querySelector<HTMLInputElement>('#salary')
    const raw = input?.value.trim() ?? ''
    if (!raw) {
      saveSettings({ netSalaryCents: null })
    } else {
      const cents = parseEsAmount(raw)
      if (cents == null || cents <= 0) {
        input?.setCustomValidity('Pon un importe válido, p. ej. 1.200,00')
        input?.reportValidity()
        return
      }
      input?.setCustomValidity('')
      saveSettings({ netSalaryCents: Math.abs(cents) })
    }
    navigate('/ajustes')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })

  document.querySelector('#clear-report')?.addEventListener('click', async () => {
    await clearReport()
    cache = null
    const st = document.querySelector('#clear-status')
    if (st) st.textContent = 'Informe local borrado.'
  })
}

function wireResumen(): void {
  document.querySelector('#copy-wa')?.addEventListener('click', async () => {
    const ta = document.querySelector<HTMLTextAreaElement>('#wa-text')
    const st = document.querySelector('#copy-status')
    if (!ta) return
    try {
      await navigator.clipboard.writeText(ta.value)
      if (st) st.textContent = 'Copiado. Pégalo en WhatsApp.'
    } catch {
      ta.select()
      if (st) st.textContent = 'Seleccionado — copia con Ctrl+C / ⌘C.'
    }
  })
  document.querySelector('#print-wa')?.addEventListener('click', () => window.print())
}

async function render(route: Route): Promise<void> {
  const report = await ensureReport()

  switch (route.name) {
    case '/':
      app.innerHTML = landingHtml()
      wireDrop()
      break
    case '/informe':
      app.innerHTML = informeHtml(report)
      break
    case '/cargo':
      app.innerHTML = cargoHtml(report, route.cargoId)
      wireCargo()
      break
    case '/comisiones':
      app.innerHTML = comisionesHtml(report)
      break
    case '/guia':
      app.innerHTML = guiaHtml()
      break
    case '/ajustes':
      app.innerHTML = ajustesHtml()
      wireAjustes()
      break
    case '/resumen':
      app.innerHTML = resumenHtml(report)
      wireResumen()
      break
    case '/error':
    default:
      app.innerHTML = errorHtml(route.errorKind ?? 'error')
      break
  }

  const nav = document.createElement('nav')
  nav.className = 'app-nav'
  nav.setAttribute('aria-label', 'Secciones')
  nav.innerHTML = `
    <a href="#/">Drop</a>
    <a href="#/informe">Informe</a>
    <a href="#/guia">Guía</a>
    <a href="#/ajustes">Ajustes</a>
  `
  app.appendChild(nav)
}

if (!location.hash) navigate('/')
onRoute((r) => {
  void render(r)
})
