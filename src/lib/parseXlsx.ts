// Lectura XLSX con SheetJS (OSS) → misma tubería que CSV.
// Primera hoja; filas a TSV lógico.
import * as XLSX from 'xlsx'
import { parseCsvText } from './parseCsv.ts'
import type { Movement } from './types.ts'

export async function parseXlsxFile(file: File): Promise<Movement[]> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array', cellDates: false })
  const sheetName = wb.SheetNames[0]
  if (!sheetName) return []
  const sheet = wb.Sheets[sheetName]
  if (!sheet) return []
  const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ';' })
  return parseCsvText(csv)
}
