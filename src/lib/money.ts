// Formato y parseo ES: decimal ,, miles ., dinero en céntimos.
// Nunca floats para totales de informe.
export function parseEsAmount(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, '').replace(/€/g, '').replace(/EUR/gi, '')
  if (!s || s === '-' || s === '+') return null
  const neg = s.startsWith('-') || s.endsWith('-') || /^\(.*\)$/.test(s)
  let t = s.replace(/^\(/, '').replace(/\)$/, '').replace(/^[+-]/, '').replace(/-$/, '')
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(t)) {
    t = t.replace(/\./g, '').replace(',', '.')
  } else if (/^\d+,\d{1,2}$/.test(t)) {
    t = t.replace(',', '.')
  } else if (/^\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(t)) {
    t = t.replace(/,/g, '')
  } else if (t.includes(',') && t.includes('.')) {
    if (t.lastIndexOf(',') > t.lastIndexOf('.')) {
      t = t.replace(/\./g, '').replace(',', '.')
    } else {
      t = t.replace(/,/g, '')
    }
  } else if (t.includes(',')) {
    t = t.replace(',', '.')
  }
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  const cents = Math.round(Math.abs(n) * 100)
  return neg ? -cents : cents
}

export function formatEuros(cents: number, opts?: { signed?: boolean }): string {
  const sign = cents < 0 || opts?.signed ? (cents < 0 ? '-' : '') : ''
  const abs = Math.abs(cents)
  const euros = Math.floor(abs / 100)
  const c = String(abs % 100).padStart(2, '0')
  const withDots = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${sign}${withDots},${c} €`
}

export function formatEurosShort(cents: number): string {
  return formatEuros(cents)
}
