import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  RefreshCw,
  PhoneIncoming,
  PhoneMissed,
  Percent,
  Clock,
  Timer,
  BarChart3,
  ListChecks,
  Settings2,
  AlertTriangle,
} from 'lucide-react'

import Card, { CardHeader, CardBody } from '../components/ui/Card.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import InboundHourlyChart from '../components/inbound/InboundHourlyChart.jsx'
import InboundCallsTable from '../components/inbound/InboundCallsTable.jsx'
import { fetchChamadasEntrada, fetchDiasDisponiveis } from '../services/api.js'
import { useCallerId } from '../context/CallerIdContext.jsx'
import { formatNumero, formatPercent, formatMinutos } from '../lib/format.js'

export default function InboundCalls() {
  const { config } = useCallerId()
  const [dados, setDados] = useState(null)
  const [dias, setDias] = useState([])
  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(true)

  async function carregar(data) {
    setCarregando(true)
    const d = await fetchChamadasEntrada(data)
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

  const labelDia = dias.find((d) => d.valor === diaSelecionado)?.label || ''
  const entradaAtiva = config?.chamadaEntradaAtiva

  return (
    <div className="space-y-6">
      {/* Cabeçalho + filtro de data */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Chamadas recebidas no número A ·{' '}
          <span className="font-medium text-slate-700">{labelDia}</span>
        </p>
        <div className="flex items-center gap-2">
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

      {/* Aviso: entrada desativada na configuração */}
      {!entradaAtiva && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="flex-1 text-sm text-amber-800">
            A chamada de entrada está <strong>desativada</strong> na configuração
            atual. Os dados abaixo são ilustrativos.
          </p>
          <Link
            to="/caller-id"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
          >
            <Settings2 className="h-4 w-4" />
            Configurar
          </Link>
        </div>
      )}

      {carregando || !dados ? (
        <Spinner label="Carregando chamadas de entrada..." />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              titulo="Chamadas recebidas"
              valor={formatNumero(dados.kpis.total)}
              icon={PhoneIncoming}
              cor="blue"
              tendencia={dados.kpis.tendencias.total}
            />
            <KpiCard
              titulo="Atendidas"
              valor={formatNumero(dados.kpis.atendidas)}
              icon={ListChecks}
              cor="green"
              tendencia={dados.kpis.tendencias.atendidas}
            />
            <KpiCard
              titulo="Perdidas"
              valor={formatNumero(dados.kpis.perdidas)}
              icon={PhoneMissed}
              cor="red"
              tendencia={dados.kpis.tendencias.perdidas}
              tendenciaBoaSeSobe={false}
            />
            <KpiCard
              titulo="Taxa de atendimento"
              valor={formatPercent(dados.kpis.taxaAtendimento)}
              icon={Percent}
              cor="green"
              tendencia={dados.kpis.tendencias.taxaAtendimento}
            />
            <KpiCard
              titulo="Minutos recebidos"
              valor={formatNumero(dados.kpis.minutos)}
              sufixo="min"
              icon={Clock}
              cor="blue"
            />
            <KpiCard
              titulo="Duração média"
              valor={formatMinutos(dados.kpis.duracaoMedia)}
              icon={Timer}
              cor="amber"
            />
            <KpiCard
              titulo="Espera média"
              valor={`${dados.kpis.esperaMediaSeg}s`}
              icon={Timer}
              cor="slate"
            />
          </div>

          {/* Gráfico por horário */}
          <Card>
            <CardHeader
              title="Chamadas de entrada por hora"
              subtitle="Entrantes e atendidas ao longo do dia"
              icon={BarChart3}
            />
            <CardBody>
              <InboundHourlyChart data={dados.porHora} />
            </CardBody>
          </Card>

          {/* Últimas 50 */}
          <Card>
            <CardHeader
              title="Últimas chamadas recebidas"
              subtitle={`As ${dados.ultimas.length} chamadas de entrada mais recentes`}
              icon={ListChecks}
            />
            <InboundCallsTable data={dados.ultimas} />
          </Card>
        </>
      )}
    </div>
  )
}
