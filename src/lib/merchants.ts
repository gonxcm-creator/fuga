// Diccionario comercios Andrés: 15 mapas sucio→limpio (ES habituales).
// Se aplica tras quitar *1234 y ruido de extracto.
export const MERCHANT_MAP: Record<string, string> = {
  'NETFLIX.COM': 'Netflix',
  'NETFLIX COM': 'Netflix',
  'SPOTIFY AB': 'Spotify',
  'SPOTIFY P1': 'Spotify',
  'AMAZON PRIME': 'Amazon Prime',
  'AMZN DIGITAL': 'Amazon',
  'DISNEY PLUS': 'Disney+',
  'HBO MAX': 'Max',
  'MAX COM': 'Max',
  'YOUTUBE PREMIUM': 'YouTube Premium',
  'APPLE.COM/BILL': 'Apple',
  'APPLE COM BILL': 'Apple',
  'GOOGLE ONE': 'Google One',
  'ORANGE ESPANA': 'Orange',
  'ORANGE ES': 'Orange',
  MOVISTAR: 'Movistar',
  'DIGI SPAIN': 'Digi',
  IBERDROLA: 'Iberdrola',
  ENDESA: 'Endesa',
  'BASIC FIT': 'Basic-Fit',
  'ADOBE SYSTEMS': 'Adobe',
  'MICROSOFT*MICROSOFT 365': 'Microsoft 365',
}


const ORDERED = Object.entries(MERCHANT_MAP).sort((a, b) => b[0].length - a[0].length)

export function cleanMerchantName(raw: string): string {
  let s = raw.normalize('NFKC').replace(/\u00a0/g, ' ').trim()
  s = s.replace(/\*\d{3,}/g, ' ')
  s = s.replace(/\b\d{4,}\b/g, ' ')
  s = s.replace(/[^\p{L}\p{N}\s.+/-]/gu, ' ')
  s = s.replace(/\s+/g, ' ').trim()
  const upper = s.toUpperCase()
  for (const [dirty, clean] of ORDERED) {
    if (upper.includes(dirty)) return clean
  }
  return s
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .slice(0, 4)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
