/**
 * mockData.js
 * --------------------------------------------------------------------------
 * Dados FALSOS (mock) usados pela maqueta frontend.
 *
 * IMPORTANTE PARA INTEGRAÇÃO FUTURA:
 * Cada bloco abaixo tem a mesma forma (shape) que esperamos receber da API real.
 * No futuro, a camada `src/services/api.js` deixará de retornar estes objetos e
 * passará a fazer `fetch()` ao backend — sem que as telas precisem mudar, desde
 * que o backend respeite estes mesmos formatos.
 * --------------------------------------------------------------------------
 */

// 1) KPIs do dia ------------------------------------------------------------
export const kpis = {
  data: '2026-05-30',
  totalChamadas: 1284,        // Total de chamadas realizadas hoje
  totalTentativas: 1637,      // Total de tentativas diárias
  chamadasAtendidas: 842,     // Chamadas atendidas
  chamadasNaoAtendidas: 442,  // Chamadas não atendidas
  efetividade: 65.6,          // % de efetividade (atendidas / chamadas)
  minutosFalados: 3970,       // Total de minutos falados
  duracaoMedia: 4.7,          // Duração média da chamada (minutos)
  // Variação vs. dia anterior (para mostrar tendência nos cards)
  tendencias: {
    totalChamadas: 8.2,
    totalTentativas: 5.1,
    chamadasAtendidas: 11.4,
    chamadasNaoAtendidas: -3.6,
    efetividade: 2.9,
    minutosFalados: 6.8,
    duracaoMedia: -1.2,
  },
}

// 2) Uso por hora (chamadas x minutos falados) ------------------------------
export const usoPorHora = [
  { hora: '08h', chamadas: 42, minutos: 121 },
  { hora: '09h', chamadas: 88, minutos: 268 },
  { hora: '10h', chamadas: 134, minutos: 402 },
  { hora: '11h', chamadas: 156, minutos: 470 },
  { hora: '12h', chamadas: 97, minutos: 281 },
  { hora: '13h', chamadas: 76, minutos: 205 },
  { hora: '14h', chamadas: 142, minutos: 438 },
  { hora: '15h', chamadas: 168, minutos: 512 },
  { hora: '16h', chamadas: 151, minutos: 461 },
  { hora: '17h', chamadas: 118, minutos: 349 },
  { hora: '18h', chamadas: 74, minutos: 211 },
  { hora: '19h', chamadas: 38, minutos: 102 },
]

// 3) Tipos de resultado / distribuição de chamadas NÃO atendidas ------------
//    `cor` é usada nos gráficos para manter consistência visual.
export const naoAtendidas = [
  { tipo: 'Caixa postal', valor: 138, cor: '#3563ff' },
  { tipo: 'Caixa postal iOS', valor: 92, cor: '#598cff' },
  { tipo: 'Ocupado', valor: 74, cor: '#f59e0b' },
  { tipo: 'Não atende', valor: 81, cor: '#94a3b8' },
  { tipo: 'Rejeitada ativamente pelo assinante B', valor: 39, cor: '#ef4444' },
  { tipo: 'Rejeitada por motivo técnico', valor: 18, cor: '#a855f7' },
]

// Catálogo de resultados possíveis (atendidas e não atendidas) --------------
export const resultadosChamada = [
  { id: 'atendida', label: 'Atendida', categoria: 'atendida' },
  { id: 'caixa_postal', label: 'Caixa postal', categoria: 'nao_atendida' },
  { id: 'caixa_postal_ios', label: 'Caixa postal iOS', categoria: 'nao_atendida' },
  { id: 'ocupado', label: 'Ocupado', categoria: 'nao_atendida' },
  { id: 'nao_atende', label: 'Não atende', categoria: 'nao_atendida' },
  { id: 'rejeitada_b', label: 'Rejeitada pelo assinante B', categoria: 'nao_atendida' },
  { id: 'rejeitada_tecnica', label: 'Rejeitada por motivo técnico', categoria: 'nao_atendida' },
]

// 4) Operadores -------------------------------------------------------------
export const operadores = [
  { id: 'op-01', nome: 'Mariana Costa', ramal: '1012', status: 'online' },
  { id: 'op-02', nome: 'Rafael Almeida', ramal: '1018', status: 'em_chamada' },
  { id: 'op-03', nome: 'Camila Ferreira', ramal: '1024', status: 'online' },
  { id: 'op-04', nome: 'Diego Santos', ramal: '1031', status: 'pausa' },
  { id: 'op-05', nome: 'Beatriz Lima', ramal: '1042', status: 'online' },
  { id: 'op-06', nome: 'Lucas Pereira', ramal: '1055', status: 'offline' },
]

// 5) Chamadas recentes (tabela) ---------------------------------------------
export const chamadasRecentes = [
  { id: 'c-2051', dataHora: '2026-05-30 17:42:11', operador: 'Mariana Costa', cliente: 'Auto Peças Silva', numeroDestino: '+5511987654321', callerId: '+5511934567890', resultado: 'atendida', duracaoSeg: 372 },
  { id: 'c-2050', dataHora: '2026-05-30 17:39:48', operador: 'Rafael Almeida', cliente: 'Clínica Vida', numeroDestino: '+5521991234567', callerId: '+5521930001122', resultado: 'caixa_postal', duracaoSeg: 0 },
  { id: 'c-2049', dataHora: '2026-05-30 17:36:02', operador: 'Camila Ferreira', cliente: 'Restaurante Bella', numeroDestino: '+5511975553311', callerId: '+5511934567890', resultado: 'atendida', duracaoSeg: 521 },
  { id: 'c-2048', dataHora: '2026-05-30 17:33:27', operador: 'Diego Santos', cliente: 'Tech Solutions BA', numeroDestino: '+5491144556677', callerId: '+5491133221100', resultado: 'ocupado', duracaoSeg: 0 },
  { id: 'c-2047', dataHora: '2026-05-30 17:30:55', operador: 'Beatriz Lima', cliente: 'Imobiliária Norte', numeroDestino: '+5511966778899', callerId: '+5511934567890', resultado: 'nao_atende', duracaoSeg: 0 },
  { id: 'c-2046', dataHora: '2026-05-30 17:27:14', operador: 'Mariana Costa', cliente: 'Farmácia Central', numeroDestino: '+5521988112233', callerId: '+5521930001122', resultado: 'atendida', duracaoSeg: 198 },
  { id: 'c-2045', dataHora: '2026-05-30 17:24:39', operador: 'Camila Ferreira', cliente: 'Escola Aprender', numeroDestino: '+5511933445566', callerId: '+5511934567890', resultado: 'rejeitada_b', duracaoSeg: 0 },
  { id: 'c-2044', dataHora: '2026-05-30 17:21:08', operador: 'Rafael Almeida', cliente: 'Construtora Forte', numeroDestino: '+5521977889900', callerId: '+5521930001122', resultado: 'atendida', duracaoSeg: 645 },
  { id: 'c-2043', dataHora: '2026-05-30 17:18:51', operador: 'Beatriz Lima', cliente: 'Pet Shop Amigo', numeroDestino: '+5511922334455', callerId: '+5511934567890', resultado: 'caixa_postal_ios', duracaoSeg: 0 },
  { id: 'c-2042', dataHora: '2026-05-30 17:15:33', operador: 'Diego Santos', cliente: 'Logística Sul', numeroDestino: '+5651133557799', callerId: '+5651122446688', resultado: 'atendida', duracaoSeg: 287 },
  { id: 'c-2041', dataHora: '2026-05-30 17:12:09', operador: 'Mariana Costa', cliente: 'Estúdio Foco', numeroDestino: '+5511911223344', callerId: '+5511934567890', resultado: 'rejeitada_tecnica', duracaoSeg: 0 },
  { id: 'c-2040', dataHora: '2026-05-30 17:09:47', operador: 'Camila Ferreira', cliente: 'Oficina Mecânica RJ', numeroDestino: '+5521955667788', callerId: '+5521930001122', resultado: 'atendida', duracaoSeg: 412 },
]

// 6) Listas de Caller ID (números A pré-carregados) -------------------------
export const listasCallerId = [
  {
    id: 'lista-br-sp',
    nome: 'Lista Brasil São Paulo',
    pais: 'Brasil',
    regiao: 'São Paulo',
    numeros: ['+5511934567890', '+5511934567891', '+5511934567892', '+5511934567893'],
  },
  {
    id: 'lista-br-rj',
    nome: 'Lista Brasil Rio de Janeiro',
    pais: 'Brasil',
    regiao: 'Rio de Janeiro',
    numeros: ['+5521930001122', '+5521930001123', '+5521930001124'],
  },
  {
    id: 'lista-ar-bsas',
    nome: 'Lista Argentina Buenos Aires',
    pais: 'Argentina',
    regiao: 'Buenos Aires',
    numeros: ['+5491133221100', '+5491133221101', '+5491133221102'],
  },
  {
    id: 'lista-cl-scl',
    nome: 'Lista Chile Santiago',
    pais: 'Chile',
    regiao: 'Santiago',
    numeros: ['+5622445566778', '+5622445566779'],
  },
]

// 7) Modos de configuração de Caller ID (número A) --------------------------
export const modosCallerId = [
  {
    id: 'aleatorio_mesma_area',
    titulo: 'Número aleatório com o mesmo código de área',
    descricao: 'Gera um número A aleatório que mantém o mesmo DDD/código de área do número de destino.',
  },
  {
    id: 'fixo_aleatorio',
    titulo: 'Número fixo aleatório',
    descricao: 'Usa um único número fixo escolhido aleatoriamente pelo sistema para toda a campanha.',
  },
  {
    id: 'lista_carregada',
    titulo: 'Lista de números carregados',
    descricao: 'Rotaciona os números A a partir de uma lista pré-carregada.',
  },
  {
    id: 'manual',
    titulo: 'Configuração manual',
    descricao: 'Informe manualmente um ou vários números no formato E.164.',
  },
]

// Configuração inicial (estado padrão da tela de Caller ID) -----------------
export const configCallerIdPadrao = {
  modo: 'aleatorio_mesma_area',
  listaSelecionada: 'lista-br-sp',
  numerosManuais: '',
  // Identificação de origem
  ocultarOrigem: false, // false = mostrar Caller ID | true = chamada anônima
}

// ===========================================================================
// 8) DADOS POR DIA (para o filtro de data do Dashboard)
// ---------------------------------------------------------------------------
// "Hoje" é fixo nesta maquete: 30/05/2026. A partir daí geramos dados
// fictícios e DETERMINÍSTICOS para os dias anteriores (a mesma data sempre
// produz os mesmos números), simulando o histórico que a API real entregaria.
// ===========================================================================

export const HOJE = '2026-05-30'

// --- Utilidades de data (sem dependências) ---------------------------------
function parseISO(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function toISO(dt) {
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
function addDays(s, n) {
  const dt = parseISO(s)
  dt.setDate(dt.getDate() + n)
  return toISO(dt)
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Lista de dias disponíveis no filtro (hoje + 13 dias anteriores).
export const diasDisponiveis = Array.from({ length: 14 }, (_, i) => {
  const data = addDays(HOJE, -i)
  const dt = parseISO(data)
  const dm = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const semana = capitalize(
    dt.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
  )
  let label
  if (i === 0) label = `Hoje · ${dm}`
  else if (i === 1) label = `Ontem · ${dm}`
  else label = `${semana} · ${dm}`
  return { valor: data, label }
})

// --- PRNG determinístico (mesma data → mesmos números) ---------------------
function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Pools para gerar chamadas recentes realistas
const POOL_CLIENTES = [
  'Auto Peças Silva', 'Clínica Vida', 'Restaurante Bella', 'Tech Solutions BA',
  'Imobiliária Norte', 'Farmácia Central', 'Escola Aprender', 'Construtora Forte',
  'Pet Shop Amigo', 'Logística Sul', 'Estúdio Foco', 'Oficina Mecânica RJ',
  'Mercado União', 'Transportes Andes', 'Padaria Aurora', 'Studio Pilates Zen',
  'Contabilidade Prado', 'Gráfica Rápida', 'Hotel Mirador', 'Floricultura Bela',
]
const POOL_CALLER_IDS = [
  '+5511934567890', '+5521930001122', '+5491133221100',
  '+5651122446688', '+5622445566778',
]
const POOL_DDD = ['+5511', '+5521', '+5531', '+5541', '+5491', '+5651', '+5622']

// Distribuição base (proporção) das não atendidas, com cores fixas.
const BASE_NAO_ATENDIDAS = [
  { tipo: 'Caixa postal', peso: 0.31, cor: '#3563ff' },
  { tipo: 'Caixa postal iOS', peso: 0.21, cor: '#598cff' },
  { tipo: 'Ocupado', peso: 0.17, cor: '#f59e0b' },
  { tipo: 'Não atende', peso: 0.18, cor: '#94a3b8' },
  { tipo: 'Rejeitada ativamente pelo assinante B', peso: 0.09, cor: '#ef4444' },
  { tipo: 'Rejeitada por motivo técnico', peso: 0.04, cor: '#a855f7' },
]

// Resultados possíveis para chamadas recentes, com peso de ocorrência.
const RESULTADOS_PESO = [
  ['atendida', 0.55],
  ['caixa_postal', 0.12],
  ['caixa_postal_ios', 0.08],
  ['ocupado', 0.07],
  ['nao_atende', 0.1],
  ['rejeitada_b', 0.05],
  ['rejeitada_tecnica', 0.03],
]

function escolherPonderado(rnd, pares) {
  const r = rnd()
  let acc = 0
  for (const [valor, peso] of pares) {
    acc += peso
    if (r <= acc) return valor
  }
  return pares[pares.length - 1][0]
}

// Bundle de "hoje" usando os dados artesanais já definidos acima.
function payloadHoje() {
  return {
    kpis: structuredClone(kpis),
    usoPorHora: structuredClone(usoPorHora),
    naoAtendidas: structuredClone(naoAtendidas),
    chamadasRecentes: structuredClone(chamadasRecentes),
  }
}

// Gera o pacote completo de dados para uma data anterior.
function gerarDadosDia(dataISO) {
  const rnd = mulberry32(hashSeed(dataISO))
  const ri = (min, max) => Math.floor(min + rnd() * (max - min + 1))

  // --- KPIs ---
  const totalChamadas = ri(820, 1480)
  const efetividade = +(56 + rnd() * 16).toFixed(1) // 56% a 72%
  const chamadasAtendidas = Math.round((totalChamadas * efetividade) / 100)
  const chamadasNaoAtendidas = totalChamadas - chamadasAtendidas
  const totalTentativas = totalChamadas + ri(180, 460)
  const duracaoMedia = +(3.6 + rnd() * 2.4).toFixed(1) // 3.6 a 6.0 min
  const minutosFalados = Math.round(chamadasAtendidas * duracaoMedia)
  const tend = () => +((rnd() - 0.5) * 24).toFixed(1) // -12% a +12%

  const kpisDia = {
    data: dataISO,
    totalChamadas,
    totalTentativas,
    chamadasAtendidas,
    chamadasNaoAtendidas,
    efetividade,
    minutosFalados,
    duracaoMedia,
    tendencias: {
      totalChamadas: tend(),
      totalTentativas: tend(),
      chamadasAtendidas: tend(),
      chamadasNaoAtendidas: tend(),
      efetividade: tend(),
      minutosFalados: tend(),
      duracaoMedia: tend(),
    },
  }

  // --- Uso por hora (curva diurna 08h–19h) ---
  const horas = ['08h','09h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h']
  const curva = [3, 6, 9, 10, 6, 5, 9, 11, 10, 8, 5, 3] // peso por hora
  const somaCurva = curva.reduce((a, b) => a + b, 0)
  const usoPorHoraDia = horas.map((hora, idx) => {
    const jitter = 0.85 + rnd() * 0.3
    const chamadasH = Math.round((totalChamadas * curva[idx] * jitter) / somaCurva)
    const minutosH = Math.round(chamadasH * duracaoMedia * (efetividade / 100))
    return { hora, chamadas: chamadasH, minutos: minutosH }
  })

  // --- Não atendidas (distribui o total pelas categorias) ---
  let restante = chamadasNaoAtendidas
  const naoAtendidasDia = BASE_NAO_ATENDIDAS.map((c, idx) => {
    let valor
    if (idx === BASE_NAO_ATENDIDAS.length - 1) {
      valor = restante
    } else {
      const jitter = 0.8 + rnd() * 0.4
      valor = Math.round(chamadasNaoAtendidas * c.peso * jitter)
      valor = Math.min(valor, restante)
      restante -= valor
    }
    return { tipo: c.tipo, valor: Math.max(valor, 0), cor: c.cor }
  })

  // --- Chamadas recentes (12 linhas) ---
  let minuto = 17 * 60 + ri(35, 55) // começa entre 17:35 e 17:55
  const usados = new Set()
  const chamadasRecentesDia = Array.from({ length: 12 }, (_, i) => {
    const hh = String(Math.floor(minuto / 60)).padStart(2, '0')
    const mm = String(minuto % 60).padStart(2, '0')
    const ss = String(ri(0, 59)).padStart(2, '0')
    minuto -= ri(2, 5) // recua o relógio

    const op = operadores[ri(0, operadores.length - 1)]
    let cli
    do {
      cli = POOL_CLIENTES[ri(0, POOL_CLIENTES.length - 1)]
    } while (usados.has(cli) && usados.size < POOL_CLIENTES.length)
    usados.add(cli)

    const ddd = POOL_DDD[ri(0, POOL_DDD.length - 1)]
    const numeroDestino = ddd + String(ri(900000000, 999999999))
    const callerId = POOL_CALLER_IDS[ri(0, POOL_CALLER_IDS.length - 1)]
    const resultado = escolherPonderado(rnd, RESULTADOS_PESO)
    const duracaoSeg = resultado === 'atendida' ? ri(75, 720) : 0

    return {
      id: `c-${dataISO}-${i}`,
      dataHora: `${dataISO} ${hh}:${mm}:${ss}`,
      operador: op.nome,
      cliente: cli,
      numeroDestino,
      callerId,
      resultado,
      duracaoSeg,
    }
  })

  return {
    kpis: kpisDia,
    usoPorHora: usoPorHoraDia,
    naoAtendidas: naoAtendidasDia,
    chamadasRecentes: chamadasRecentesDia,
  }
}

/**
 * getDadosDia — ponto único para obter o pacote de dados de uma data.
 * Para HOJE retorna os dados artesanais; para outras datas, dados gerados.
 */
export function getDadosDia(dataISO) {
  if (!dataISO || dataISO === HOJE) return payloadHoje()
  return gerarDadosDia(dataISO)
}
