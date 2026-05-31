import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  Target,
  Clock,
  Timer,
  BarChart3,
  PieChart as PieIcon,
  ListChecks,
  RefreshCw,
  Calendar,
  SignalHigh,
  ChevronRight,
  PhoneOutgoing,
  ShieldCheck,
  Settings2,
} from 'lucide-react'

import Card, { CardHeader, CardBody } from '../components/ui/Card.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import HourlyUsageChart from '../components/dashboard/HourlyUsageChart.jsx'
import UnansweredChart from '../components/dashboard/UnansweredChart.jsx'
import RecentCallsTable from '../components/dashboard/RecentCallsTable.jsx'
import AreaQualityTable from '../components/quality/AreaQualityTable.jsx'

import {
  fetchKpis,
  fetchUsoPorHora,
  fetchNaoAtendidas,
  fetchChamadasRecentes,
  fetchDiasDisponiveis,
  fetchQualidadePorArea,
} from '../services/api.js'
import { useCallerId, descreverModalidade } from '../context/CallerIdContext.jsx'
import {
  formatNumero,
  formatPercent,
  formatMinutos,
} from '../lib/format.js'

export default function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [usoHora, setUsoHora] = useState([])
  const [naoAtend, setNaoAtend] = useState([])
  const [chamadas, setChamadas] = useState([])
  const [qualidade, setQualidade] = useState([])
  const [carregando, setCarregando] = useState(true)

  // Modalidade de Caller ID em operação (contexto global)
  const { config, modos } = useCallerId()
  const modalidade = descreverModalidade(config, modos)

  // Filtro de data
  const [dias, setDias] = useState([])
  const [diaSelecionado, setDiaSelecionado] = useState(null)

  async function carregar(data) {
    setCarregando(true)
    // Em produção, isto continuará igual — só muda o que api.js faz por baixo.
    const [k, u, n, c, q] = await Promise.all([
      fetchKpis(data),
      fetchUsoPorHora(data),
      fetchNaoAtendidas(data),
      fetchChamadasRecentes(data),
      fetchQualidadePorArea(data),
    ])
    setKpis(k)
    setUsoHora(u)
    setNaoAtend(n)
    setChamadas(c)
    setQualidade(q)
    setCarregando(false)
  }

  // Carrega a lista de dias e seleciona o primeiro (hoje) ao montar.
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

  const labelDiaAtual =
    dias.find((d) => d.valor === diaSelecionado)?.label || ''
  const ehHoje = diaSelecionado === dias[0]?.valor

  if (carregando || !kpis) {
    return <Spinner label="Carregando dados de monitoramento..." />
  }

  const t = kpis.tendencias

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {ehHoje ? 'Resumo de hoje' : 'Resumo do dia'} ·{' '}
          <span className="font-medium text-slate-700">{labelDiaAtual}</span>
        </p>

        <div className="flex items-center gap-2">
          {/* Filtro de data */}
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
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
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

      {/* Sinalização: o que está em operação (modalidade de número A ou STIR/SHAKEN) */}
      <div
        className={`flex flex-wrap items-center gap-3 rounded-2xl border p-4 ${
          modalidade.identificada
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-brand-200 bg-brand-50/60'
        }`}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            modalidade.identificada
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-600 text-white'
          }`}
        >
          {modalidade.identificada ? (
            <ShieldCheck className="h-5 w-5" />
          ) : (
            <PhoneOutgoing className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`text-[11px] font-semibold uppercase tracking-wider ${
              modalidade.identificada ? 'text-emerald-600' : 'text-brand-600'
            }`}
          >
            {modalidade.topLabel}
          </p>
          <p className="truncate text-base font-bold text-slate-800">
            {modalidade.label}
          </p>
          {modalidade.detalhe && (
            <p className="truncate text-xs text-slate-500">{modalidade.detalhe}</p>
          )}
        </div>
        <Link
          to="/caller-id"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Configurar</span>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          titulo="Chamadas realizadas hoje"
          valor={formatNumero(kpis.totalChamadas)}
          icon={PhoneCall}
          cor="blue"
          tendencia={t.totalChamadas}
        />
        <KpiCard
          titulo="Tentativas diárias"
          valor={formatNumero(kpis.totalTentativas)}
          icon={PhoneForwarded}
          cor="purple"
          tendencia={t.totalTentativas}
        />
        <KpiCard
          titulo="Chamadas atendidas"
          valor={formatNumero(kpis.chamadasAtendidas)}
          icon={PhoneIncoming}
          cor="green"
          tendencia={t.chamadasAtendidas}
        />
        <KpiCard
          titulo="Chamadas não atendidas"
          valor={formatNumero(kpis.chamadasNaoAtendidas)}
          icon={PhoneMissed}
          cor="red"
          tendencia={t.chamadasNaoAtendidas}
          tendenciaBoaSeSobe={false}
        />
        <KpiCard
          titulo="Efetividade"
          valor={formatPercent(kpis.efetividade)}
          icon={Target}
          cor="green"
          tendencia={t.efetividade}
        />
        <KpiCard
          titulo="Minutos falados"
          valor={formatNumero(kpis.minutosFalados)}
          sufixo="min"
          icon={Clock}
          cor="blue"
          tendencia={t.minutosFalados}
        />
        <KpiCard
          titulo="Duração média"
          valor={formatMinutos(kpis.duracaoMedia)}
          icon={Timer}
          cor="amber"
          tendencia={t.duracaoMedia}
          tendenciaBoaSeSobe={false}
        />
        <KpiCard
          titulo="Total de tentativas/atendidas"
          valor={`${formatNumero(kpis.chamadasAtendidas)} / ${formatNumero(kpis.totalTentativas)}`}
          icon={ListChecks}
          cor="slate"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Uso por hora"
            subtitle="Chamadas realizadas e minutos falados ao longo do dia"
            icon={BarChart3}
          />
          <CardBody>
            <HourlyUsageChart data={usoHora} />
          </CardBody>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Chamadas não atendidas"
            subtitle="Distribuição por motivo"
            icon={PieIcon}
          />
          <CardBody>
            <UnansweredChart data={naoAtend} />
          </CardBody>
        </Card>
      </div>

      {/* Qualidade por código de área — capitais de estado (ordem de DDD) */}
      <Card>
        <CardHeader
          title="Qualidade por código de área"
          subtitle="Capitais de estado por DDD — ASR, ACD e alertas de rota"
          icon={SignalHigh}
          action={
            <Link
              to="/qualidade-area"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-brand-600 hover:bg-brand-50"
            >
              Ver todas
              <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />
        <AreaQualityTable
          dados={[...qualidade]
            .filter((a) => a.capital)
            .sort((a, b) => a.codigo.localeCompare(b.codigo))}
          compacto
        />
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader
          title="Chamadas recentes"
          subtitle={`Últimas ${chamadas.length} chamadas`}
          icon={ListChecks}
        />
        <RecentCallsTable data={chamadas} />
      </Card>
    </div>
  )
}
