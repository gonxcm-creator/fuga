// Hash router mínimo para Fuga (sin servidor).
// Lee location.hash y notifica cambios de ruta.
export type Route =
  | '/'
  | '/informe'
  | '/cargo'
  | '/comisiones'
  | '/guia'
  | '/ajustes'
  | '/error'
  | '/resumen'

const ROUTES: Route[] = [
  '/',
  '/informe',
  '/cargo',
  '/comisiones',
  '/guia',
  '/ajustes',
  '/error',
  '/resumen',
]

export function currentRoute(): Route {
  const raw = location.hash.replace(/^#/, '') || '/'
  const path = (raw.startsWith('/') ? raw : `/${raw}`) as Route
  return ROUTES.includes(path) ? path : '/error'
}

export function navigate(route: Route): void {
  location.hash = route === '/' ? '#/' : `#${route}`
}

export function onRoute(cb: (route: Route) => void): () => void {
  const handler = () => cb(currentRoute())
  window.addEventListener('hashchange', handler)
  handler()
  return () => window.removeEventListener('hashchange', handler)
}
