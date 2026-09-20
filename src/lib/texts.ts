// Frases exactas Elena + guías bancos + plantilla WhatsApp Lucía.
// Copy fijo; no inventar tonos distintos en UI.

export const MSG_EMPTY =
  'No marqué fugas. Hace falta ver el mismo cargo al menos 2 veces con importe parecido.'

export const MSG_ERROR =
  'No pude leer movimientos. Prueba CSV o Excel del banco, o abre la guía de exportar.'

export const MSG_NO_EXTRACT =
  'Esto no parece un extracto de movimientos. Sueltá el CSV/Excel que baja tu banco (fechas e importes).'

export type BankGuide = { id: string; name: string; steps: string[] }

export const BANK_GUIDES: BankGuide[] = [
  {
    id: 'caixa',
    name: 'CaixaBank',
    steps: [
      'Entra en CaixaBankNow (app o web) con tu acceso habitual.',
      'Ve a Cuentas → elige la cuenta → Movimientos.',
      'Pulsa Buscar / Filtrar, elige al menos 3 meses y aplica.',
      'Toca Exportar / Descargar y elige Excel o CSV. Guarda el fichero en tu móvil o PC.',
    ],
  },
  {
    id: 'bbva',
    name: 'BBVA',
    steps: [
      'Abre la app BBVA o bbva.es e inicia sesión.',
      'Entra en Cuentas → Movimientos de la cuenta que uses.',
      'Filtra un rango de al menos 3 meses.',
      'Usa Descargar / Exportar (Excel o CSV) y suelta ese fichero en Fuga.',
    ],
  },
  {
    id: 'santander',
    name: 'Santander',
    steps: [
      'Entra en la app Santander o en banca online.',
      'Ve a Cuentas → Movimientos.',
      'Selecciona fechas (mínimo 3 meses) y confirma la búsqueda.',
      'Pulsa Exportar / Descargar en Excel o CSV y guarda el archivo.',
    ],
  },
  {
    id: 'revolut',
    name: 'Revolut',
    steps: [
      'Abre Revolut → cuenta en EUR (o la que uses).',
      'Entra en Extractos / Statements (a veces bajo tu perfil).',
      'Elige cuenta, rango de al menos 3 meses y formato Excel o CSV.',
      'Genera el extracto, descárgalo y suéltalo en Fuga.',
    ],
  },
  {
    id: 'n26',
    name: 'N26',
    steps: [
      'Abre la app N26 e inicia sesión.',
      'Ve a tu perfil → Documents / Extractos.',
      'Pide un extracto CSV o Excel de al menos 3 meses.',
      'Descárgalo al dispositivo y suéltalo en la pantalla de Fuga.',
    ],
  },
]

export function whatsappTemplate(opts: {
  yearlyLabel: string
  monthlyLabel: string
  top: { name: string; monthlyLabel: string }[]
  feesLabel: string
}): string {
  const lines = [
    'Hola — miré mis movimientos con Fuga (todo en el navegador, sin subir el extracto).',
    '',
    `Al año se me van unos ${opts.yearlyLabel} en suscripciones y comisiones (~${opts.monthlyLabel}/mes).`,
    '',
  ]
  if (opts.top.length) {
    lines.push('Las mayores fugas:')
    for (const t of opts.top.slice(0, 5)) {
      lines.push(`· ${t.name}: ${t.monthlyLabel}/mes`)
    }
    lines.push('')
  }
  if (opts.feesLabel !== '0,00 €') {
    lines.push(`Comisiones del periodo: ${opts.feesLabel}.`)
    lines.push('')
  }
  lines.push('¿Me ayudas a decidir qué mantengo, qué reviso y qué cancelo?')
  return lines.join('\n')
}
