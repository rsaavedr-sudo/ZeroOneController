/**
 * services/api.js
 * --------------------------------------------------------------------------
 * Camada de acesso a dados.
 *
 * HOJE: retorna os dados mock de `src/data/mockData.js` envolvidos em Promises
 *       (com um pequeno atraso simulado) para imitar uma chamada de rede.
 *
 * AMANHÃ (integração real): basta trocar o corpo de cada função por um
 *       `fetch(`${API_BASE_URL}/...`)`. As telas consomem estas funções via
 *       async/await, então NÃO precisarão ser alteradas.
 * --------------------------------------------------------------------------
 */

import {
  resultadosChamada,
  operadores,
  listasCallerId,
  modosCallerId,
  configCallerIdPadrao,
  diasDisponiveis,
  getDadosDia,
  getEstatisticasCallerId,
  getQualidadePorArea,
  HOJE,
} from '../data/mockData.js'

// Base da API real no futuro. Ex.: import.meta.env.VITE_API_BASE_URL
export const API_BASE_URL = '/api'

// Simula latência de rede para parecer realista durante o protótipo.
const SIMULAR_LATENCIA_MS = 350
function mock(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), SIMULAR_LATENCIA_MS)
  })
}

/*
 * Exemplo de como ficará uma chamada real no futuro:
 *
 * async function getJson(path) {
 *   const res = await fetch(`${API_BASE_URL}${path}`, {
 *     headers: { Authorization: `Bearer ${token}` },
 *   })
 *   if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${path}`)
 *   return res.json()
 * }
 */

// ---- Dashboard ------------------------------------------------------------
// Todas as leituras do dashboard aceitam uma data (YYYY-MM-DD). Sem argumento,
// usam HOJE. No backend real, a data viraria um query param: ?data=YYYY-MM-DD

export function fetchDiasDisponiveis() {
  // FUTURO: return getJson('/dashboard/dias')
  return mock(diasDisponiveis)
}

export function fetchKpis(data = HOJE) {
  // FUTURO: return getJson(`/dashboard/kpis?data=${data}`)
  return mock(getDadosDia(data).kpis)
}

export function fetchUsoPorHora(data = HOJE) {
  // FUTURO: return getJson(`/dashboard/uso-por-hora?data=${data}`)
  return mock(getDadosDia(data).usoPorHora)
}

export function fetchNaoAtendidas(data = HOJE) {
  // FUTURO: return getJson(`/dashboard/nao-atendidas?data=${data}`)
  return mock(getDadosDia(data).naoAtendidas)
}

export function fetchChamadasRecentes(data = HOJE) {
  // FUTURO: return getJson(`/chamadas/recentes?data=${data}`)
  return mock(getDadosDia(data).chamadasRecentes)
}

export function fetchQualidadePorArea(data = HOJE) {
  // Qualidade (ASR/ACD) por código de área de destino.
  // FUTURO: return getJson(`/dashboard/qualidade-area?data=${data}`)
  return mock(getQualidadePorArea(data))
}

export function fetchOperadores() {
  // FUTURO: return getJson('/operadores')
  return mock(operadores)
}

export function fetchResultadosChamada() {
  return mock(resultadosChamada)
}

// ---- Configuração de Caller ID -------------------------------------------
export function fetchListasCallerId() {
  // FUTURO: return getJson('/caller-id/listas')
  return mock(listasCallerId)
}

export function fetchModosCallerId() {
  return mock(modosCallerId)
}

export function fetchEstatisticasCallerId() {
  // Estatísticas comparativas (ASR e ACD) por opção, últimos 30 dias.
  // FUTURO: return getJson('/caller-id/estatisticas?dias=30')
  return mock(getEstatisticasCallerId())
}

export function fetchConfigCallerId() {
  // FUTURO: return getJson('/caller-id/config')
  return mock(configCallerIdPadrao)
}

export function salvarConfigCallerId(config) {
  // FUTURO: return postJson('/caller-id/config', config)
  // eslint-disable-next-line no-console
  console.log('[mock] salvarConfigCallerId →', config)
  return mock({ ok: true, salvoEm: new Date().toISOString(), config })
}
