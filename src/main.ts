// Entrada de Fuga: monta rutas hash y landing con drop (sin parser).
// Día 3 = cascarón. Parser llega en día 4.
import './style.css'
import { onRoute, navigate, type Route } from './router.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

function landing(): string {
  return `
    <main>
      <div class="drop" id="drop" tabindex="0" role="button" aria-label="Soltar extracto">
        <strong>Soltar extracto</strong>
        <span class="muted">CSV o Excel del banco</span>
        <span class="stub">Día 4: aquí irá el parser (hoy no lee el fichero)</span>
        <input id="file" type="file" accept=".csv,.txt,.xlsx,.xls" hidden />
      </div>

      <h1>Ves las fugas de tu banco sin subir el extracto.</h1>
      <ul class="list-plain">
        <li>Recurrentes y comisiones en un vistazo</li>
        <li>Total al mes y al año (el año, en grande)</li>
        <li>Qué cortar primero + texto para WhatsApp</li>
      </ul>

      <h2>Qué NO hacemos</h2>
      <ul class="list-plain muted">
        <li>No conectamos tu banco</li>
        <li>No cancelamos por ti</li>
        <li>No leemos facturas mágicas</li>
        <li>No hay cuentas ni nube</li>
      </ul>

      <p class="privacy">El extracto no sale de tu PC. Todo ocurre en este navegador.</p>

      <a class="btn btn-secondary" href="#/guia">Cómo exportar</a>
    </main>
  `
}

function stub(title: string, note: string): string {
  return `
    <main class="card">
      <h1>${title}</h1>
      <p class="stub">${note}</p>
      <a class="btn btn-secondary" href="#/">Volver al drop</a>
    </main>
  `
}

function render(route: Route): void {
  switch (route) {
    case '/':
      app.innerHTML = landing()
      wireDrop()
      break
    case '/informe':
      app.innerHTML = stub('Informe', 'Stub. Día 4+: totales y fugas.')
      break
    case '/cargo':
      app.innerHTML = stub('Ficha cargo', 'Stub. Detalle de un recurrente.')
      break
    case '/comisiones':
      app.innerHTML = stub('Comisiones', 'Stub. Mantenimiento / cuota tarjeta.')
      break
    case '/guia':
      app.innerHTML = stub(
        'Cómo exportar',
        'Stub. Guías Caixa / BBVA / Santander / Revolut / N26 (copy de Lucía).',
      )
      break
    case '/ajustes':
      app.innerHTML = stub('Ajustes', 'Stub. Sueldo neto opcional + borrar datos locales.')
      break
    case '/resumen':
      app.innerHTML = stub('Resumen WhatsApp', 'Stub. Copiar plantilla (PDF después si cabe).')
      break
    case '/error':
    default:
      app.innerHTML = stub('No leí movimientos', 'Stub vacío/error. Reintentar drop o abrir guía.')
      break
  }

  const nav = document.createElement('nav')
  nav.className = 'stub-nav'
  nav.innerHTML = `
    <a href="#/">drop</a>
    <a href="#/informe">informe</a>
    <a href="#/cargo">cargo</a>
    <a href="#/comisiones">comisiones</a>
    <a href="#/guia">guía</a>
    <a href="#/ajustes">ajustes</a>
    <a href="#/resumen">resumen</a>
    <a href="#/error">error</a>
  `
  app.appendChild(nav)
}

function wireDrop(): void {
  const drop = document.querySelector<HTMLDivElement>('#drop')
  const file = document.querySelector<HTMLInputElement>('#file')
  if (!drop || !file) return

  const open = () => file.click()
  drop.addEventListener('click', open)
  drop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  })
  ;['dragenter', 'dragover'].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault()
      drop.style.borderColor = 'var(--ink)'
    })
  })
  ;['dragleave', 'drop'].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault()
      drop.style.borderColor = '#d4cfc4'
    })
  })
  drop.addEventListener('drop', () => {
    const note = drop.querySelector('.stub')
    if (note) note.textContent = 'Archivo recibido en memoria local — parser en día 4 (no se lee aún).'
  })
  file.addEventListener('change', () => {
    const note = drop.querySelector('.stub')
    if (note) note.textContent = 'Archivo recibido en memoria local — parser en día 4 (no se lee aún).'
    file.value = ''
  })
}

if (!location.hash) navigate('/')
onRoute(render)
