/**
 * lib/format.js — utilidades de formatação reutilizáveis.
 */

const nf = new Intl.NumberFormat('pt-BR')

export function formatNumero(valor) {
  if (valor == null || Number.isNaN(valor)) return '—'
  return nf.format(valor)
}

export function formatPercent(valor, casas = 1) {
  if (valor == null || Number.isNaN(valor)) return '—'
  return `${valor.toFixed(casas).replace('.', ',')}%`
}

/** Segundos → mm:ss */
export function formatDuracao(segundos) {
  if (!segundos || segundos <= 0) return '—'
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Minutos (número) → "Xh Ymin" ou "Xmin" */
export function formatMinutos(minutos) {
  if (minutos == null) return '—'
  const h = Math.floor(minutos / 60)
  const m = Math.round(minutos % 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

/** "2026-05-30 17:42:11" → "30/05 17:42" */
export function formatDataHora(iso) {
  if (!iso) return '—'
  const [data, hora] = iso.split(' ')
  if (!data || !hora) return iso
  const [, mes, dia] = data.split('-')
  const [hh, mm] = hora.split(':')
  return `${dia}/${mes} ${hh}:${mm}`
}
