// Agrupa cargos recurrentes: ≥2, importe ±5% o ±0,50€, nombre limpio.
// Si hay duda → no marcar.
import type { Movement, Recurrent } from './types.ts'

const FIFTY = 50 // céntimos

function similarAmount(a: number, b: number): boolean {
  const aa = Math.abs(a)
  const bb = Math.abs(b)
  const diff = Math.abs(aa - bb)
  if (diff <= FIFTY) return true
  const base = Math.max(aa, bb, 1)
  return diff / base <= 0.05
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function findRecurrents(movements: Movement[]): Recurrent[] {
  const charges = movements.filter((m) => m.amountCents < 0)
  const byName = new Map<string, Movement[]>()
  for (const m of charges) {
    const key = m.cleanName.toLowerCase()
    const list = byName.get(key) ?? []
    list.push(m)
    byName.set(key, list)
  }

  const out: Recurrent[] = []
  for (const [, list] of byName) {
    if (list.length < 2) continue
    // Cluster by similar amount around median
    const amounts = list.map((m) => m.amountCents).sort((a, b) => a - b)
    const median = amounts[Math.floor(amounts.length / 2)]!
    const cluster = list.filter((m) => similarAmount(m.amountCents, median))
    if (cluster.length < 2) continue
    // Doubt: high variance across cluster → skip
    const abs = cluster.map((m) => Math.abs(m.amountCents))
    const min = Math.min(...abs)
    const max = Math.max(...abs)
    if (max - min > Math.max(FIFTY, Math.round(max * 0.05)) + 1) continue

    const avg = Math.round(abs.reduce((s, n) => s + n, 0) / abs.length)
    const history = [...cluster]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((m) => ({ date: m.date, amountCents: m.amountCents }))

    out.push({
      id: slug(cluster[0]!.cleanName),
      cleanName: cluster[0]!.cleanName,
      monthlyCents: avg,
      yearlyCents: avg * 12,
      count: cluster.length,
      history,
      status: 'pendiente',
    })
  }

  return out.sort((a, b) => b.yearlyCents - a.yearlyCents)
}
