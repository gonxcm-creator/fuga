// Parser CSV/TSV ES: separador ; o ,, cabeceras flexibles.
// Solo lee en cliente; no sube nada.
import { parseEsAmount } from './money.ts'
import { parseEsDate } from './dates.ts'
import { cleanMerchantName } from './merchants.ts'
import type { Movement } from './types.ts'

function detectSep(headerLine: string): ';' | ',' | '\t' {
  const sc = (headerLine.match(/;/g) || []).length
  const cc = (headerLine.match(/,/g) || []).length
  const tc = (headerLine.match(/\t/g) || []).length
  if (tc >= sc && tc >= cc && tc > 0) return '\t'
  return sc >= cc ? ';' : ','
}

function splitLine(line: string, sep: string): string[] {
  const out: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!
    if (ch === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"'
        i++
      } else q = !q
    } else if (ch === sep && !q) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((c) => c.trim())
}

function normHeader(h: string): string {
  return h
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]/g, '')
}

const DATE_KEYS = ['fecha', 'date', 'fechavalor', 'fechadeoperacion', 'operationdate', 'bookingdate']
const NAME_KEYS = [
  'concepto',
  'descripcion',
  'description',
  'detalle',
  'movimiento',
  'beneficiario',
  'nombre',
  'merchant',
  'payee',
]
const AMOUNT_KEYS = ['importe', 'amount', 'cantidad', 'valor', 'cargo', 'haber']
const DEBIT_KEYS = ['cargo', 'debe', 'debit', 'withdrawal']
const CREDIT_KEYS = ['abono', 'haber', 'credit', 'deposit']

function findCol(headers: string[], keys: string[]): number {
  const norms = headers.map(normHeader)
  for (const k of keys) {
    const i = norms.indexOf(k)
    if (i >= 0) return i
  }
  for (let i = 0; i < norms.length; i++) {
    if (keys.some((k) => norms[i]!.includes(k))) return i
  }
  return -1
}

export function parseCsvText(text: string): Movement[] {
  const cleaned = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = cleaned.split('\n').filter((l) => l.trim().length > 0)
  if (lines.length < 2) return []

  // Skip bank preamble lines without separators of dates
  let start = 0
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const sep = detectSep(lines[i]!)
    const cells = splitLine(lines[i]!, sep)
    const n = cells.map(normHeader)
    if (n.some((h) => DATE_KEYS.includes(h) || h.includes('fecha') || h.includes('date'))) {
      start = i
      break
    }
  }

  const headerLine = lines[start]!
  const sep = detectSep(headerLine)
  const headers = splitLine(headerLine, sep)
  const dateI = findCol(headers, DATE_KEYS)
  const nameI = findCol(headers, NAME_KEYS)
  const amountI = findCol(headers, AMOUNT_KEYS)
  const debitI = findCol(headers, DEBIT_KEYS)
  const creditI = findCol(headers, CREDIT_KEYS)

  if (dateI < 0 || nameI < 0) return []

  const movs: Movement[] = []
  for (let i = start + 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]!, sep)
    const date = parseEsDate(cells[dateI] ?? '')
    const rawName = (cells[nameI] ?? '').trim()
    if (!date || !rawName) continue

    let amountCents: number | null = null
    if (amountI >= 0) {
      amountCents = parseEsAmount(cells[amountI] ?? '')
    } else if (debitI >= 0 || creditI >= 0) {
      const d = debitI >= 0 ? parseEsAmount(cells[debitI] ?? '') : null
      const c = creditI >= 0 ? parseEsAmount(cells[creditI] ?? '') : null
      if (d != null && d !== 0) amountCents = -Math.abs(d)
      else if (c != null && c !== 0) amountCents = Math.abs(c)
    }
    if (amountCents == null || amountCents === 0) continue

    movs.push({
      date,
      rawName,
      cleanName: cleanMerchantName(rawName),
      amountCents,
    })
  }
  return movs
}
