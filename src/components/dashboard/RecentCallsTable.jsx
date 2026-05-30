import { Phone } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { formatDataHora, formatDuracao } from '../../lib/format.js'

/**
 * RecentCallsTable — tabela de chamadas recentes (responsiva).
 * Em telas pequenas vira cards; em telas grandes vira tabela.
 */

// Mapeia o resultado para rótulo + cor do Badge
const RESULTADO = {
  atendida: { label: 'Atendida', variant: 'green' },
  caixa_postal: { label: 'Caixa postal', variant: 'blue' },
  caixa_postal_ios: { label: 'Caixa postal iOS', variant: 'blue' },
  ocupado: { label: 'Ocupado', variant: 'amber' },
  nao_atende: { label: 'Não atende', variant: 'slate' },
  rejeitada_b: { label: 'Rejeitada (assinante B)', variant: 'red' },
  rejeitada_tecnica: { label: 'Rejeitada (técnico)', variant: 'purple' },
}

function ResultadoBadge({ resultado }) {
  const r = RESULTADO[resultado] || { label: resultado, variant: 'slate' }
  return <Badge variant={r.variant}>{r.label}</Badge>
}

export default function RecentCallsTable({ data }) {
  return (
    <div className="overflow-hidden">
      {/* Tabela (telas md+) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">Data/Hora</th>
              <th className="px-5 py-3 font-medium">Operador</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Número destino</th>
              <th className="px-5 py-3 font-medium">Caller ID</th>
              <th className="px-5 py-3 font-medium">Resultado</th>
              <th className="px-5 py-3 text-right font-medium">Duração</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                  {formatDataHora(c.dataHora)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-700">
                  {c.operador}
                </td>
                <td className="px-5 py-3 text-slate-600">{c.cliente}</td>
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-600">
                  {c.numeroDestino}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-500">
                  {c.callerId}
                </td>
                <td className="px-5 py-3">
                  <ResultadoBadge resultado={c.resultado} />
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-700">
                  {formatDuracao(c.duracaoSeg)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (telas pequenas) */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {data.map((c) => (
          <li key={c.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{c.operador}</p>
                  <p className="text-xs text-slate-400">{c.cliente}</p>
                </div>
              </div>
              <ResultadoBadge resultado={c.resultado} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <dt className="text-slate-400">Destino</dt>
                <dd className="font-mono text-slate-600">{c.numeroDestino}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Caller ID</dt>
                <dd className="font-mono text-slate-600">{c.callerId}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Data/Hora</dt>
                <dd className="text-slate-600">{formatDataHora(c.dataHora)}</dd>
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
