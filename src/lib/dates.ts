// Fechas de extracto ES: DD/MM/YYYY (también DD-MM-YYYY).
// Devuelve YYYY-MM-DD o null si no encaja.
export function parseEsDate(raw: string): string | null {
  const s = raw.trim()
  const m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/)
  if (!m) return null
  let [, d, mo, y] = m
  if (y.length === 2) y = Number(y) > 70 ? `19${y}` : `20${y}`
  const day = Number(d)
  const month = Number(mo)
  const year = Number(y)
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const dt = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(dt.getTime())) return null
  if (dt.getDate() !== day || dt.getMonth() + 1 !== month) return null
  return iso
}

export function monthsBetween(a: string, b: string): number {
  const [ay, am] = a.split('-').map(Number)
  const [by, bm] = b.split('-').map(Number)
  return Math.abs((by - ay) * 12 + (bm - am)) + 1
}
