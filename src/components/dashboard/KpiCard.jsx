import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../ui/Card.jsx'

/**
 * KpiCard — card de métrica reutilizável.
 *
 * props:
 *  - titulo, valor, sufixo
 *  - icon (componente lucide), cor ('blue'|'green'|'red'|'amber'|'purple'|'slate')
 *  - tendencia (número; positivo/negativo), tendenciaBoaSeSobe (bool)
 */
const CORES = {
  blue: 'bg-brand-50 text-brand-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  slate: 'bg-slate-100 text-slate-600',
}

export default function KpiCard({
  titulo,
  valor,
  sufixo,
  icon: Icon,
  cor = 'blue',
  tendencia,
  tendenciaBoaSeSobe = true,
}) {
  const temTendencia = typeof tendencia === 'number'
  const sobe = temTendencia && tendencia >= 0
  const positiva = temTendencia && (tendenciaBoaSeSobe ? sobe : !sobe)
  const TrendIcon = sobe ? TrendingUp : TrendingDown

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${CORES[cor]}`}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </span>
        {temTendencia && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              positiva
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {Math.abs(tendencia).toFixed(1).replace('.', ',')}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-500">{titulo}</p>
        <p className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {valor}
          </span>
          {sufixo && (
            <span className="text-sm font-medium text-slate-400">{sufixo}</span>
          )}
        </p>
      </div>
    </Card>
  )
}
