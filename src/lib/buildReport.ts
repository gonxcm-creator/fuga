// Construye el informe derivado a partir de movimientos en memoria.
// Solo este objeto puede persistirse (nunca el CSV).
import { monthsBetween } from './dates.ts'
import { isFeeName } from './fees.ts'
import { findRecurrents } from './recurrent.ts'
import type { Fee, Movement, Report } from './types.ts'

export function buildReport(movements: Movement[]): Report {
  const sorted = [...movements].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0]?.date ?? new Date().toISOString().slice(0, 10)
  const last = sorted[sorted.length - 1]?.date ?? first
  const monthSpan = Math.max(1, monthsBetween(first, last))

  const fees: Fee[] = sorted
    .filter((m) => m.amountCents < 0 && isFeeName(m.rawName + ' ' + m.cleanName))
    .map((m) => ({
      cleanName: m.cleanName,
      amountCents: Math.abs(m.amountCents),
      date: m.date,
    }))

  const feeNames = new Set(fees.map((f) => f.cleanName.toLowerCase()))
  const forRec = sorted.filter((m) => !feeNames.has(m.cleanName.toLowerCase()) || !isFeeName(m.rawName))
  // Exclude fee movements from recurrents more carefully
  const nonFee = sorted.filter((m) => !isFeeName(m.rawName + ' ' + m.cleanName))
  const recurrents = findRecurrents(nonFee.length ? nonFee : forRec)

  const recMonthly = recurrents.reduce((s, r) => s + r.monthlyCents, 0)
  const feesYearly = fees.reduce((s, f) => s + f.amountCents, 0)
  // Annualize fees over observed span
  const feesMonthly = Math.round(feesYearly / monthSpan)
  const totalMonthly = recMonthly + feesMonthly
  const totalYearly = recurrents.reduce((s, r) => s + r.yearlyCents, 0) + feesMonthly * 12

  return {
    createdAt: new Date().toISOString(),
    monthSpan,
    totalMonthlyCents: totalMonthly,
    totalYearlyCents: totalYearly,
    feesTotalCents: feesYearly,
    recurrents,
    fees,
    movementCount: movements.length,
  }
}
