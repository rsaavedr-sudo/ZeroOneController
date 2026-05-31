import { useMemo } from 'react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from 'recharts'
import { Activity, Timer, TrendingUp, Trophy } from 'lucide-react'

import Card, { CardHeader, CardBody } from '../ui/Card.jsx'

/**
 * CallerIdStats — comparação de desempenho (ASR x ACD) entre as opções de
 * Caller ID, com histórico de 30 dias para a opção atualmente selecionada.
 *
 * props:
 *  - dados: array de { modo, titulo, tituloCurto, asrMedio, acdMedio, chamadas30d, serie }
 *  - modoAtivo: id do modo selecionado nos radio buttons acima
 */
export default function CallerIdStats({ dados, modoAtivo }) {
  const ativo = useMemo(
    () => dados.find((d) => d.modo === modoAtivo) || dados[0],
    [dados, modoAtivo],
  )

  // Melhor opção por ASR (para destacar visualmente).
  const melhorAsr = useMemo(
    () => dados.reduce((a, b) => (b.asrMedio > a.asrMedio ? b : a), dados[0]),
    [dados],
  )

  const dadosBarra = dados.map((d) => ({
    nome: d.tituloCurto,
    asr: d.asrMedio,
    ativo: d.modo === modoAtivo,
  }))

  return (
    <Card>
      <CardHeader
        title="Desempenho por opção de Caller ID"
        subtitle="Comparativo de ASR e ACD — últimos 30 dias"
        icon={Activity}
      />
      <CardBody className="space-y-6">
        {/* Legenda das métricas */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <span>
            <strong className="text-slate-700">ASR</strong> (Answer Seizure
            Ratio): % de chamadas atendidas sobre as tentativas.
          </span>
          <span>
            <strong className="text-slate-700">ACD</strong> (Average Call
            Duration): duração média da chamada atendida.
          </span>
        </div>

        {/* Cards comparativos por opção */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dados.map((d) => {
            const ativoSel = d.modo === modoAtivo
            const ehMelhor = d.modo === melhorAsr.modo
            return (
              <div
                key={d.modo}
                className={`rounded-xl border p-4 transition-colors ${
                  ativoSel
                    ? 'border-brand-300 bg-brand-50/60 ring-1 ring-brand-200'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">
                    {d.tituloCurto}
                  </p>
                  {ehMelhor && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      <Trophy className="h-3 w-3" /> Melhor ASR
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">ASR médio</p>
                    <p className="text-xl font-bold text-slate-900">
                      {d.asrMedio.toFixed(1).replace('.', ',')}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">ACD médio</p>
                    <p className="text-xl font-bold text-slate-900">
                      {d.acdMedio.toFixed(1).replace('.', ',')}
                      <span className="ml-0.5 text-xs font-medium text-slate-400">
                        min
                      </span>
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  {d.chamadas30d.toLocaleString('pt-BR')} chamadas / 30 dias
                </p>
              </div>
            )
          })}
        </div>

        {/* Gráficos: histórico da opção ativa + comparativo de ASR */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          {/* Histórico 30 dias da opção ativa */}
          <div className="xl:col-span-3">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              <p className="text-sm font-semibold text-slate-700">
                Histórico de 30 dias ·{' '}
                <span className="text-brand-600">{ativo.tituloCurto}</span>
              </p>
            </div>
            <p className="mb-3 text-xs text-slate-400">
              Atualiza conforme a opção selecionada acima.
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={ativo.serie}
                  margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
                >
                  <defs>
                    <linearGradient id="gradAsr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3563ff" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3563ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#eef2f7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="rotulo"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    yAxisId="asr"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <YAxis
                    yAxisId="acd"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    unit="m"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      fontSize: 12,
                    }}
                    formatter={(valor, nome) =>
                      nome === 'ASR'
                        ? [`${valor}%`, 'ASR']
                        : [`${valor} min`, 'ACD']
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                  <Area
                    yAxisId="asr"
                    type="monotone"
                    dataKey="asr"
                    name="ASR"
                    stroke="#3563ff"
                    strokeWidth={2.5}
                    fill="url(#gradAsr)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="acd"
                    type="monotone"
                    dataKey="acd"
                    name="ACD"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparativo de ASR entre opções */}
          <div className="xl:col-span-2">
            <div className="mb-2 flex items-center gap-2">
              <Timer className="h-4 w-4 text-brand-600" />
              <p className="text-sm font-semibold text-slate-700">
                ASR médio por opção
              </p>
            </div>
            <p className="mb-3 text-xs text-slate-400">
              Quanto maior, melhor a taxa de atendimento.
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosBarra}
                  layout="vertical"
                  margin={{ top: 4, right: 36, bottom: 0, left: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#eef2f7"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="nome"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      fontSize: 12,
                    }}
                    formatter={(valor) => [`${valor}%`, 'ASR médio']}
                  />
                  <Bar dataKey="asr" radius={[0, 6, 6, 0]} barSize={22}>
                    {dadosBarra.map((d) => (
                      <Cell
                        key={d.nome}
                        fill={d.ativo ? '#3563ff' : '#c7d2fe'}
                      />
                    ))}
                    <LabelList
                      dataKey="asr"
                      position="right"
                      formatter={(v) => `${v}%`}
                      style={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
