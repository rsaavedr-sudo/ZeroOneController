import { useEffect, useState, useMemo } from 'react'
import {
  Calendar,
  RefreshCw,
  SignalHigh,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

import Card, { CardHeader, CardBody } from '../components/ui/Card.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import AreaQualityTable from '../components/quality/AreaQualityTable.jsx'
import { fetchQualidadePorArea, fetchDiasDisponiveis } from '../services/api.js'

export default function QualityByArea() {
  const [dados, setDados] = useState([])
  const [dias, setDias] = useState([])
  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('todas') // todas | capitais | outras

  async function carregar(data) {
    setCarregando(true)
    const d = await fetchQualidadePorArea(data)
    setDados(d)
    setCarregando(false)
  }

  useEffect(() => {
    ;(async () => {
      const lista = await fetchDiasDisponiveis()
      setDias(lista)
      const inicial = lista[0]?.valor
      setDiaSelecionado(inicial)
      carregar(inicial)
    })()
  }, [])

  function handleTrocarDia(e) {
    const data = e.target.value
    setDiaSelecionado(data)
    carregar(data)
  }

  const dadosFiltrados = useMemo(() => {
    if (filtro === 'capitais') return dados.filter((d) => d.capital)
    if (filtro === 'outras') return dados.filter((d) => !d.capital)
    return dados
  }, [dados, filtro])

  const resumo = useMemo(() => {
    const criticos = dadosFiltrados.filter((d) => d.nivel === 'critico').length
    const alertas = dadosFiltrados.filter((d) => d.nivel === 'alerta').length
    const ok = dadosFiltrados.filter((d) => d.nivel === 'ok').length
    const quedas = dadosFiltrados.filter((d) => d.quedaBrusca).length
    return { criticos, alertas, ok, quedas }
  }, [dadosFiltrados])

  const labelDia = dias.find((d) => d.valor === diaSelecionado)?.label || ''

  return (
    <div className="space-y-6">
      {/* Cabeçalho + filtro de data */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Qualidade por código de área (DDD de destino) ·{' '}
          <span className="font-medium text-slate-700">{labelDia}</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro capitais / outras */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'capitais', label: 'Capitais' },
              { id: 'outras', label: 'Outras' },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => setFiltro(op.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filtro === op.id
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={diaSelecionado || ''}
              onChange={handleTrocarDia}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {dias.map((d) => (
                <option key={d.valor} value={d.valor}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => carregar(diaSelecionado)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {carregando ? (
        <Spinner label="Carregando qualidade por área..." />
      ) : (
        <>
          {/* Resumo de níveis */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <ResumoNivel
              icon={AlertOctagon}
              cor="red"
              valor={resumo.criticos}
              titulo="Áreas críticas"
              subtitulo="ASR abaixo de 40%"
            />
            <ResumoNivel
              icon={AlertTriangle}
              cor="amber"
              valor={resumo.alertas}
              titulo="Áreas em alerta"
              subtitulo="ASR entre 40% e 55%"
            />
            <ResumoNivel
              icon={CheckCircle2}
              cor="green"
              valor={resumo.ok}
              titulo="Áreas OK"
              subtitulo="ASR acima de 55%"
            />
            <ResumoNivel
              icon={SignalHigh}
              cor="slate"
              valor={resumo.quedas}
              titulo="Quedas bruscas"
              subtitulo="Hoje abaixo da média 7d"
            />
          </div>

          {/* Aviso quando há problemas */}
          {(resumo.criticos > 0 || resumo.quedas > 0) && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-800">
                Há áreas com ASR crítico ou queda brusca. Pode indicar uma rota
                ou interconexão degradada nesses destinos — vale revisar a
                operadora de terminação antes que afete a campanha.
              </p>
            </div>
          )}

          {/* Tabela completa, ordenável */}
          <Card>
            <CardHeader
              title="Detalhe por código de área"
              subtitle="Clique nos títulos para ordenar"
              icon={SignalHigh}
            />
            <AreaQualityTable dados={dadosFiltrados} ordenavel mostrarSparkline />
          </Card>
        </>
      )}
    </div>
  )
}

const CORES = {
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
}

function ResumoNivel({ icon: Icon, cor, valor, titulo, subtitulo }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${CORES[cor]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold text-slate-900">{valor}</p>
          <p className="text-xs font-medium text-slate-600">{titulo}</p>
          <p className="text-[11px] text-slate-400">{subtitulo}</p>
        </div>
      </div>
    </Card>
  )
}
