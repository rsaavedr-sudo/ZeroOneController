import { useEffect, useMemo, useState } from 'react'
import {
  PhoneOutgoing,
  Shuffle,
  Hash,
  ListOrdered,
  Pencil,
  AlertTriangle,
  Check,
  Save,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'

import Card, { CardHeader, CardBody } from '../components/ui/Card.jsx'
import Switch from '../components/ui/Switch.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import CallerIdStats from '../components/caller/CallerIdStats.jsx'

import {
  fetchListasCallerId,
  fetchEstatisticasCallerId,
  salvarConfigCallerId,
} from '../services/api.js'
import { useCallerId } from '../context/CallerIdContext.jsx'

// Ícone por modo
const ICONES_MODO = {
  aleatorio_mesma_area: Shuffle,
  fixo_aleatorio: Hash,
  lista_carregada: ListOrdered,
  manual: Pencil,
}

// Valida E.164: + seguido de 8 a 15 dígitos
const E164 = /^\+[1-9]\d{7,14}$/

export default function CallerIdConfig() {
  // Config e modos vêm do contexto global (compartilhado com o Dashboard).
  const { config, atualizarConfig, modos, carregando: carregandoConfig } =
    useCallerId()

  const [listas, setListas] = useState([])
  const [estatisticas, setEstatisticas] = useState([])
  const [carregandoLocal, setCarregandoLocal] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    ;(async () => {
      const [l, e] = await Promise.all([
        fetchListasCallerId(),
        fetchEstatisticasCallerId(),
      ])
      setListas(l)
      setEstatisticas(e)
      setCarregandoLocal(false)
    })()
  }, [])

  const carregando = carregandoConfig || carregandoLocal

  function atualizar(patch) {
    atualizarConfig(patch)
    setSalvo(false)
  }

  // Validação dos números manuais (apenas quando o modo é manual)
  const numerosManuais = config?.numerosManuais || ''
  const validacaoManual = useMemo(() => {
    const tokens = numerosManuais.split(/[\s,;]+/).filter(Boolean)
    const validos = tokens.filter((n) => E164.test(n))
    const invalidos = tokens.filter((n) => !E164.test(n))
    return { tokens, validos, invalidos }
  }, [numerosManuais])

  const listaSelecionada = useMemo(
    () => listas.find((l) => l.id === config?.listaSelecionada),
    [listas, config],
  )

  async function handleSalvar() {
    setSalvando(true)
    await salvarConfigCallerId(config)
    setSalvando(false)
    setSalvo(true)
  }

  if (carregando || !config) {
    return <Spinner label="Carregando configuração de Caller ID..." />
  }

  // Identificação de origem (STIR/SHAKEN) é EXCLUDENTE: quando ativa, a chamada
  // sai por uma rota com origem verificada e a modalidade de número A não se aplica.
  const identifica = config.identificacaoOrigem

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Coluna principal */}
      <div className="space-y-6 xl:col-span-2">
        {/* Modos de Caller ID */}
        <Card>
          <CardHeader
            title="Número A em chamadas de saída"
            subtitle="Escolha como o Caller ID será definido (opções mutuamente exclusivas)"
            icon={PhoneOutgoing}
          />
          <CardBody className="space-y-3">
            <p className="text-xs text-slate-400">
              Cada modalidade é uma opção independente e excludente. Ao ativar
              uma, as demais — e a identificação de origem (STIR/SHAKEN) — são
              desativadas.
            </p>
            {modos.map((m) => {
              const Icon = ICONES_MODO[m.id] || Hash
              const ativo = !identifica && config.modo === m.id
              const ativar = () =>
                atualizar({ modo: m.id, identificacaoOrigem: false })
              return (
                <div key={m.id}>
                  <div
                    onClick={ativar}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      ativo
                        ? 'border-brand-300 bg-brand-50/60 ring-1 ring-brand-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        ativo ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-slate-800">
                        {m.titulo}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {m.descricao}
                      </span>
                    </span>
                    <Switch checked={ativo} onChange={ativar} />
                  </div>

                  {/* Painel: Lista de números carregados */}
                  {ativo && m.id === 'lista_carregada' && (
                    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4">
                      <label className="block text-xs font-medium text-slate-600">
                        Selecione a lista
                      </label>
                      <select
                        value={config.listaSelecionada}
                        onChange={(e) => atualizar({ listaSelecionada: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      >
                        {listas.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.nome} ({l.numeros.length} números)
                          </option>
                        ))}
                      </select>

                      {listaSelecionada && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-400">
                            Números nesta lista ({listaSelecionada.pais} ·{' '}
                            {listaSelecionada.regiao}):
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {listaSelecionada.numeros.map((n) => (
                              <span
                                key={n}
                                className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600"
                              >
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Painel: Configuração manual */}
                  {ativo && m.id === 'manual' && (
                    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4">
                      <label className="block text-xs font-medium text-slate-600">
                        Números no formato E.164 (separe por espaço, vírgula ou
                        quebra de linha)
                      </label>
                      <textarea
                        rows={3}
                        value={config.numerosManuais}
                        onChange={(e) => atualizar({ numerosManuais: e.target.value })}
                        placeholder="+5511999999999 +5511988888888 +5491155555555"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                      {validacaoManual.tokens.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <Badge variant="green">
                            <Check className="h-3 w-3" />
                            {validacaoManual.validos.length} válido(s)
                          </Badge>
                          {validacaoManual.invalidos.length > 0 && (
                            <Badge variant="red">
                              <AlertTriangle className="h-3 w-3" />
                              {validacaoManual.invalidos.length} inválido(s)
                            </Badge>
                          )}
                          {validacaoManual.invalidos.length > 0 && (
                            <span className="text-slate-400">
                              Inválidos: {validacaoManual.invalidos.join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </CardBody>
        </Card>

        {/* Identificação de origem (STIR/SHAKEN) */}
        <Card>
          <CardHeader
            title="Identificação de origem (STIR/SHAKEN)"
            subtitle="Ative para que a chamada saia com a origem verificada/atestada"
            icon={ShieldCheck}
          />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    identifica
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {identifica ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <ShieldOff className="h-5 w-5" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {identifica
                      ? 'Identificação de origem ativada'
                      : 'Sem identificação de origem'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {identifica
                      ? 'A chamada sai com a origem verificada (STIR/SHAKEN). Esta rota não usa a modalidade de número A.'
                      : 'A chamada sai sem atestação de origem; usa a modalidade de número A configurada acima.'}
                  </p>
                </div>
              </div>
              <Switch
                checked={identifica}
                onChange={(v) => atualizar({ identificacaoOrigem: v })}
              />
            </div>

            {identifica ? (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm text-emerald-800">
                  A chamada será originada por uma rota com identificação de
                  origem verificada (STIR/SHAKEN), o que tende a reduzir
                  bloqueios pelas operadoras.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Chamadas sem identificação de origem podem ser bloqueadas por
                  alguns operadores. Ative o STIR/SHAKEN para reduzir bloqueios.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Coluna lateral: resumo + salvar */}
      <div className="space-y-6">
        <Card className="xl:sticky xl:top-20">
          <CardHeader title="Resumo da configuração" icon={Check} />
          <CardBody className="space-y-4">
            <ResumoItem
              rotulo="Modo do número A"
              valor={
                identifica ? (
                  <span className="text-slate-400">Não se aplica</span>
                ) : (
                  modos.find((m) => m.id === config.modo)?.titulo
                )
              }
            />
            {!identifica && config.modo === 'lista_carregada' && (
              <ResumoItem rotulo="Lista" valor={listaSelecionada?.nome} />
            )}
            {!identifica && config.modo === 'manual' && (
              <ResumoItem
                rotulo="Números válidos"
                valor={`${validacaoManual.validos.length} número(s)`}
              />
            )}
            <ResumoItem
              rotulo="Identificação de origem"
              valor={
                identifica ? (
                  <Badge variant="green">Ativada (STIR/SHAKEN)</Badge>
                ) : (
                  <Badge variant="slate">Desativada</Badge>
                )
              }
            />

            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {salvando ? (
                'Salvando...'
              ) : salvo ? (
                <>
                  <Check className="h-4 w-4" /> Configuração salva
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Salvar configuração
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400">
              Demonstração: a configuração não é enviada a um servidor real.
            </p>
          </CardBody>
        </Card>
      </div>
      </div>

      {/* Estatísticas comparativas (ASR x ACD) por opção de Caller ID */}
      {estatisticas.length > 0 && (
        <CallerIdStats dados={estatisticas} modoAtivo={config.modo} />
      )}
    </div>
  )
}

function ResumoItem({ rotulo, valor }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-slate-400">{rotulo}</span>
      <span className="text-right text-sm font-medium text-slate-700">
        {valor || '—'}
      </span>
    </div>
  )
}
