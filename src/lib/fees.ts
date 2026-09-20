// Detecta comisiones bancarias por palabras clave ES.
// Conservador: solo cargos (importe negativo).
const FEE_WORDS = [
  'MANTENIMIENTO',
  'CUOTA TARJETA',
  'CUOTA DE TARJETA',
  'COMISION',
  'COMISIÓN',
  'COM. ADMINISTRATIVA',
  'COM ADMINISTRATIVA',
  'GASTOS DE GESTION',
  'GASTOS DE GESTIÓN',
  'COMISION APERTURA',
  'COMISION DESCUBIERTO',
  'COMISION TRANSFERENCIA',
  'CUOTA ANUAL',
  'COMISION SERVICIO',
]

export function isFeeName(name: string): boolean {
  const u = name.toUpperCase().normalize('NFD').replace(/\p{M}/gu, '')
  return FEE_WORDS.some((w) => {
    const nw = w.normalize('NFD').replace(/\p{M}/gu, '')
    return u.includes(nw)
  })
}
