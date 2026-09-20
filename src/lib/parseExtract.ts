// Entrada unificada: CSV/TSV/XLSX → movimientos o error tipado.
// Cero red con el extracto del usuario.
import { parseCsvText } from './parseCsv.ts'
import { parseXlsxFile } from './parseXlsx.ts'
import type { Movement } from './types.ts'

export type ParseResult =
  | { ok: true; movements: Movement[] }
  | { ok: false; kind: 'error' | 'no-extract' }

export async function parseExtractFile(file: File): Promise<ParseResult> {
  const name = file.name.toLowerCase()
  try {
    let movements: Movement[]
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      movements = await parseXlsxFile(file)
    } else {
      const text = await file.text()
      movements = parseCsvText(text)
    }
    if (movements.length === 0) return { ok: false, kind: 'no-extract' }
    return { ok: true, movements }
  } catch {
    return { ok: false, kind: 'error' }
  }
}

export async function parseExtractText(text: string): Promise<ParseResult> {
  try {
    const movements = parseCsvText(text)
    if (movements.length === 0) return { ok: false, kind: 'no-extract' }
    return { ok: true, movements }
  } catch {
    return { ok: false, kind: 'error' }
  }
}
