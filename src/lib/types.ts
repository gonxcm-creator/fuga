// Tipos del informe derivado (nunca CSV crudo).
// Importes siempre en céntimos enteros.
export type Movement = {
  date: string // YYYY-MM-DD
  rawName: string
  cleanName: string
  amountCents: number // negativo = cargo
}

export type Recurrent = {
  id: string
  cleanName: string
  monthlyCents: number
  yearlyCents: number
  count: number
  history: { date: string; amountCents: number }[]
  status: 'pendiente' | 'mantener' | 'revisar' | 'cancelar'
}

export type Fee = {
  cleanName: string
  amountCents: number
  date: string
}

export type Report = {
  createdAt: string
  monthSpan: number
  totalMonthlyCents: number
  totalYearlyCents: number
  feesTotalCents: number
  recurrents: Recurrent[]
  fees: Fee[]
  movementCount: number
}

export type Settings = {
  netSalaryCents: number | null
}
