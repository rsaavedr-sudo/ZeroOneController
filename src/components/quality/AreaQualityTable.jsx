import { useState, useMemo } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, TrendingDown } from 'lucide-react'
import Sparkline from '../ui/Sparkline.jsx'
import { formatNumero, formatMinutos } from '../../lib/format.js'

/**
 * Estilos de semáforo por nível de ASR.
 */
const NIVEL = {
  critico: { dot: 'bg-red-500', texto: 'text-red-600', chip: 'bg-red-50 text-red-700 ring-red-600/20', label: 'Crítico', spark: '#ef4444' },
  alerta:  { dot: 'bg-amber-500', texto: 'text-amber-600', chip: 'bg-amber-50 text-amber-700 ring-amber-600/20', label: 'Alerta', spark: '#f59e0b' },
  ok:      { dot: 'bg-emerald-500', texto: 'text-emerald-600', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', label: 'OK', spark: '#10b981' },
}

export function SemaphoreChip({ nivel }) {
  const n = NIVEL[nivel] || NIVEL.ok
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${n.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${n.dot}`} />
      {n.label}
    </span>
  )
}

/**
 * AreaQualityTable — tabela de qualidade por código de área.
 *
 * props:
 *  - dados: array de áreas (ver getQualidadePorArea)
 *  - compacto: oculta colunas secundárias (uso no Dashboard)
 *  - ordenavel: habilita ordenação por colunas (uso na tela dedicada)
 *  - mostrarSparkline: mostra o mini histórico de 7 dias
 */
export default function AreaQualityTable({
  dados,
  compacto = false,
  ordenavel = false,
  mostrarSparkline = true,
}) {
  const [ordem, setOrdem] = useState({ campo: 'asr', dir: 'asc' })

  const dadosOrdenados = useMemo(() => {
    if (!ordenavel) return dados
    const arr = [...dados]
    arr.sort((a, b) => {
      const va = a[ordem.campo]
      const vb = b[ordem.campo]
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
      return ordem.dir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [dados, ordem, ordenavel])

  function trocarOrdem(campo) {
    if (!ordenavel) return
    setOrdem((o) =>
      o.campo === campo
        ? { campo, dir: o.dir === 'asc' ? 'desc' : 'asc' }
        : { campo, dir: 'asc' },
    )
  }

  function Th({ campo, children, className = '' }) {
    const ativo = ordem.campo === campo
    const Icon = !ativo ? ArrowUpDown : ordem.dir === 'asc' ? ArrowUp : ArrowDown
    return (
      <th className={`px-4 py-3 font-medium ${className}`}>
        <button
          onClick={() => trocarOrdem(campo)}
          className={`inline-flex items-center gap-1 ${ordenavel ? 'hover:text-slate-700' : 'cursor-default'}`}
        >
          {children}
          {ordenavel && <Icon className="h-3.5 w-3.5" />}
        </button>
      </th>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
            <Th campo="codigo">Código / Região</Th>
            {!compacto && <Th campo="chamadas" className="text-right">Chamadas</Th>}
            <Th campo="asr" className="text-right">ASR</Th>
            <Th campo="acd" className="text-right">ACD</Th>
            {mostrarSparkline && !compacto && (
              <th className="px-4 py-3 font-medium">7 dias</th>
            )}
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {dadosOrdenados.map((a) => {
            const n = NIVEL[a.nivel] || NIVEL.ok
            return (
              <tr key={a.codigo} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                    <div>
                      <p className="font-mono text-sm font-semibold text-slate-800">
                        {a.codigo}
                      </p>
                      <p className="text-xs text-slate-400">
                        {a.regiao} · {a.uf || a.pais}
                      </p>
                    </div>
                  </div>
                </td>
                {!compacto && (
                  <td className="px-4 py-3 text-right text-slate-600">
                    {formatNumero(a.chamadas)}
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex items-center gap-1 font-semibold ${n.texto}`}>
                    {a.quedaBrusca && <TrendingDown className="h-3.5 w-3.5" />}
                    {a.asr.toFixed(1).replace('.', ',')}%
                  </span>
                  {!compacto && (
                    <p className="text-[11px] text-slate-400">
                      7d: {a.asr7.toFixed(1).replace('.', ',')}%
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {formatMinutos(a.acd)}
                </td>
                {mostrarSparkline && !compacto && (
                  <td className="px-4 py-3">
                    <Sparkline
                      valores={a.serie7.map((p) => p.asr)}
                      color={n.spark}
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <SemaphoreChip nivel={a.nivel} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
