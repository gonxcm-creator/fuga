// Hash router mínimo para Fuga (sin servidor).
// Soporta /cargo/:id y query ?kind= en /error.
export type RouteName =
  | '/'
  | '/informe'
  | '/cargo'
  | '/comisiones'
  | '/guia'
  | '/ajustes'
  | '/error'
  | '/resumen'

export type Route = {
  name: RouteName
  cargoId: string | null
  errorKind: 'error' | 'no-extract' | 'empty' | null
}

const NAMES: RouteName[] = [
  '/',
  '/informe',
  '/cargo',
  '/comisiones',
  '/guia',
  '/ajustes',
  '/error',
  '/resumen',
]

function parseHash(): Route {
  const raw = location.hash.replace(/^#/, '') || '/'
  const [pathPart, query = ''] = raw.split('?')
  const path = pathPart!.startsWith('/') ? pathPart! : `/${pathPart}`
  const params = new URLSearchParams(query)

  if (path.startsWith('/cargo/') || path === '/cargo') {
    const id = path === '/cargo' ? params.get('id') : decodeURIComponent(path.slice('/cargo/'.length))
    return { name: '/cargo', cargoId: id || null, errorKind: null }
  }

  const name = (NAMES.includes(path as RouteName) ? path : '/error') as RouteName
  const kind = params.get('kind')
  const errorKind =
    name === '/error' && (kind === 'no-extract' || kind === 'empty' || kind === 'error')
      ? kind
      : name === '/error'
        ? 'error'
        : null

  return { name, cargoId: null, errorKind }
}

export function currentRoute(): Route {
  return parseHash()
}

export function navigate(
  route: RouteName,
  opts?: { cargoId?: string; errorKind?: 'error' | 'no-extract' | 'empty' },
): void {
  if (route === '/cargo' && opts?.cargoId) {
    location.hash = `#/cargo/${encodeURIComponent(opts.cargoId)}`
    return
  }
  if (route === '/error' && opts?.errorKind && opts.errorKind !== 'error') {
    location.hash = `#/error?kind=${opts.errorKind}`
    return
  }
  location.hash = route === '/' ? '#/' : `#${route}`
}

export function onRoute(cb: (route: Route) => void): () => void {
  const handler = () => cb(currentRoute())
  window.addEventListener('hashchange', handler)
  handler()
  return () => window.removeEventListener('hashchange', handler)
}
