// IndexedDB: SOLO informe derivado (+ estados de cargos).
// Nunca CSV crudo ni movimientos.
import type { Report, Recurrent } from './types.ts'

const DB = 'fuga-v1'
const STORE = 'report'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveReport(report: Report): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(report, 'latest')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

export async function loadReport(): Promise<Report | null> {
  const db = await openDb()
  const report = await new Promise<Report | null>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get('latest')
    req.onsuccess = () => resolve((req.result as Report) ?? null)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return report
}

export async function updateRecurrentStatus(
  id: string,
  status: Recurrent['status'],
): Promise<Report | null> {
  const report = await loadReport()
  if (!report) return null
  report.recurrents = report.recurrents.map((r) => (r.id === id ? { ...r, status } : r))
  await saveReport(report)
  return report
}

export async function clearReport(): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete('latest')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}
