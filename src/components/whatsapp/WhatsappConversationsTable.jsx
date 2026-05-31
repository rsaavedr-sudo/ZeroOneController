import { MessageCircle } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { formatDataHora } from '../../lib/format.js'

const STATUS = {
  respondido: { label: 'Respondido', variant: 'green' },
  aguardando: { label: 'Aguardando', variant: 'amber' },
  encerrado: { label: 'Encerrado', variant: 'slate' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, variant: 'slate' }
  return <Badge variant={s.variant}>{s.label}</Badge>
}

/**
 * WhatsappConversationsTable — conversas iniciadas no WhatsApp do número A.
 */
export default function WhatsappConversationsTable({ data }) {
  return (
    <div className="overflow-hidden">
      {/* Tabela (md+) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">1º contato</th>
              <th className="px-5 py-3 font-medium">Contato</th>
              <th className="px-5 py-3 font-medium">Número</th>
              <th className="px-5 py-3 font-medium">Número A</th>
              <th className="px-5 py-3 text-right font-medium">Mensagens</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                  {formatDataHora(c.dataHora)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-700">
                  {c.contato}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-600">
                  {c.numeroOrigem}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-500">
                  {c.numeroA}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-700">
                  {c.mensagens}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status} />
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
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{c.contato}</p>
                  <p className="font-mono text-xs text-slate-400">{c.numeroOrigem}</p>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <dt className="text-slate-400">Número A</dt>
                <dd className="font-mono text-slate-600">{c.numeroA}</dd>
              </div>
              <div>
                <dt className="text-slate-400">1º contato</dt>
                <dd className="text-slate-600">{formatDataHora(c.dataHora)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Mensagens</dt>
                <dd className="text-slate-600">{c.mensagens}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
