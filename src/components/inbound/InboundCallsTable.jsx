import { PhoneIncoming } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { formatDataHora, formatDuracao } from '../../lib/format.js'

/**
 * InboundCallsTable — tabela das últimas chamadas de entrada (recepção).
 * Responsiva: tabela em telas md+, cards em telas pequenas.
 */
const RESULTADO = {
  atendida: { label: 'Atendida', variant: 'green' },
  perdida: { label: 'Perdida', variant: 'red' },
  abandonada: { label: 'Abandonada', variant: 'amber' },
  ocupado: { label: 'Ocupado', variant: 'slate' },
}

function ResultadoBadge({ resultado }) {
  const r = RESULTADO[resultado] || { label: resultado, variant: 'slate' }
  return <Badge variant={r.variant}>{r.label}</Badge>
}

function formatEspera(seg) {
  if (!seg) return '—'
  return `${seg}s`
}

export default function InboundCallsTable({ data }) {
  return (
    <div className="overflow-hidden">
      {/* Tabela (md+) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">Data/Hora</th>
              <th className="px-5 py-3 font-medium">Número origem</th>
              <th className="px-5 py-3 font-medium">Número A (destino)</th>
              <th className="px-5 py-3 font-medium">Resultado</th>
              <th className="px-5 py-3 text-right font-medium">Espera</th>
              <th className="px-5 py-3 text-right font-medium">Duração</th>
              <th className="px-5 py-3 font-medium">Operador</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                  {formatDataHora(c.dataHora)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-700">
                  {c.numeroOrigem}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-500">
                  {c.numeroDestino}
                </td>
                <td className="px-5 py-3">
                  <ResultadoBadge resultado={c.resultado} />
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right text-slate-600">
                  {formatEspera(c.esperaSeg)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-700">
                  {formatDuracao(c.duracaoSeg)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                  {c.operador}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {data.map((c) => (
          <li key={c.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <PhoneIncoming className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono text-sm font-semibold text-slate-700">
                    {c.numeroOrigem}
                  </p>
                  <p className="text-xs text-slate-400">{formatDataHora(c.dataHora)}</p>
                </div>
              </div>
              <ResultadoBadge resultado={c.resultado} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <dt className="text-slate-400">Número A</dt>
                <dd className="font-mono text-slate-600">{c.numeroDestino}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Operador</dt>
                <dd className="text-slate-600">{c.operador}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Espera</dt>
                <dd className="text-slate-600">{formatEspera(c.esperaSeg)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Duração</dt>
                <dd className="text-slate-600">{formatDuracao(c.duracaoSeg)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
