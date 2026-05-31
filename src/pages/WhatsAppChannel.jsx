import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  RefreshCw,
  MessageCircle,
  Users,
  Percent,
  MessagesSquare,
  Clock4,
  PieChart as PieIcon,
  BarChart3,
  ListChecks,
  Settings2,
  AlertTriangle,
} from 'lucide-react'

import Card, { CardHeader, CardBody } from '../components/ui/Card.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import EngagementDonut from '../components/whatsapp/EngagementDonut.jsx'
import WhatsappHourlyChart from '../components/whatsapp/WhatsappHourlyChart.jsx'
import WhatsappConversationsTable from '../components/whatsapp/WhatsappConversationsTable.jsx'
import { fetchCanalWhatsapp, fetchDiasDisponiveis } from '../services/api.js'
import { useCallerId } from '../context/CallerIdContext.jsx'
import { formatNumero, formatPercent } from '../lib/format.js'

export default function WhatsAppChannel() {
  const { config } = useCallerId()
  const [dados, setDados] = useState(null)
  const [dias, setDias] = useState([])
  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(true)

  async function carregar(data) {
    setCarregando(true)
    const d = await fetchCanalWhatsapp(data)
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
  const canalAtivo = config?.canalWhatsappAtivo

  return (
    <div className="space-y-6">
      {/* Cabeçalho + filtro de data */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Engajamento no WhatsApp do número A ·{' '}
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

      {/* Aviso: canal desativado na configuração */}
      {!canalAtivo && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="flex-1 text-sm text-amber-800">
            O canal WhatsApp está <strong>desativado</strong> na configuração
            atual (requer STIR/SHAKEN). Os dados abaixo são ilustrativos.
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
        <Spinner label="Carregando canal WhatsApp..." />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              titulo="Contatos discados"
              valor={formatNumero(dados.kpis.totalContatos)}
              icon={Users}
              cor="slate"
            />
            <KpiCard
              titulo="Acionaram o WhatsApp"
              valor={formatNumero(dados.kpis.acionaram)}
              icon={MessageCircle}
              cor="green"
              tendencia={dados.kpis.tendencias.acionaram}
            />
            <KpiCard
              titulo="Taxa de engajamento"
              valor={formatPercent(dados.kpis.taxaEngajamento)}
              icon={Percent}
              cor="green"
              tendencia={dados.kpis.tendencias.taxaEngajamento}
            />
            <KpiCard
              titulo="Mensagens trocadas"
              valor={formatNumero(dados.kpis.mensagens)}
              icon={MessagesSquare}
              cor="blue"
              tendencia={dados.kpis.tendencias.mensagens}
            />
            <KpiCard
              titulo="Conversas ativas"
              valor={formatNumero(dados.kpis.conversasAtivas)}
              icon={MessagesSquare}
              cor="amber"
            />
            <KpiCard
              titulo="Tempo médio 1º contato"
              valor={`${dados.kpis.tempoMedioPrimeiroContatoMin} min`}
              icon={Clock4}
              cor="blue"
            />
          </div>

          {/* Distribuição + por hora */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-2">
              <CardHeader
                title="Acionaram x não acionaram"
                subtitle="Contatos que abriram conversa no WhatsApp"
                icon={PieIcon}
              />
              <CardBody>
                <EngagementDonut data={dados.distribuicao} />
              </CardBody>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader
                title="Acionamentos por hora"
                subtitle="Quando os contatos abrem conversa ao longo do dia"
                icon={BarChart3}
              />
              <CardBody>
                <WhatsappHourlyChart data={dados.porHora} />
              </CardBody>
            </Card>
          </div>

          {/* Conversas recentes */}
          <Card>
            <CardHeader
              title="Conversas recentes"
              subtitle={`Últimas ${dados.conversas.length} conversas iniciadas`}
              icon={ListChecks}
            />
            <WhatsappConversationsTable data={dados.conversas} />
          </Card>
        </>
      )}
    </div>
  )
}
