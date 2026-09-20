// Ajustes locales (sueldo neto) en localStorage.
// No toca el extracto ni IndexedDB del informe.
import type { Settings } from './types.ts'

const KEY = 'fuga-settings'

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { netSalaryCents: null }
    const parsed = JSON.parse(raw) as Settings
    return { netSalaryCents: parsed.netSalaryCents ?? null }
  } catch {
    return { netSalaryCents: null }
  }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(KEY, JSON.stringify(s))
}

/** Horas de trabajo al año asociadas a la fuga (aprox. 160 h/mes). */
export function hoursForLeak(yearlyCents: number, netSalaryCents: number): number {
  if (netSalaryCents <= 0) return 0
  const hourly = netSalaryCents / 160
  if (hourly <= 0) return 0
  return Math.round(yearlyCents / hourly)
}
