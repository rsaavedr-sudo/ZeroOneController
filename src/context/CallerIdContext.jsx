import { createContext, useContext, useEffect, useState } from 'react'
import { fetchConfigCallerId, fetchModosCallerId } from '../services/api.js'

/**
 * CallerIdContext — compartilha a configuração de Caller ID (modalidade do
 * número A + identificação de origem) entre as telas. Assim o Dashboard sabe
 * em qual modalidade estamos operando, mesmo que a escolha tenha sido feita
 * na tela de Configuração.
 *
 * FUTURO: ao integrar com a API, basta o provider buscar/salvar no backend.
 */
const Ctx = createContext(null)

export function CallerIdProvider({ children }) {
  const [config, setConfig] = useState(null)
  const [modos, setModos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [c, m] = await Promise.all([
        fetchConfigCallerId(),
        fetchModosCallerId(),
      ])
      setConfig(c)
      setModos(m)
      setCarregando(false)
    })()
  }, [])

  // Atualiza parcialmente a configuração (merge).
  function atualizarConfig(patch) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  return (
    <Ctx.Provider value={{ config, setConfig, atualizarConfig, modos, carregando }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCallerId() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCallerId deve ser usado dentro de CallerIdProvider')
  return ctx
}

/**
 * descreverModalidade — resumo legível do que está em operação.
 * Retorna { topLabel, label, detalhe, identificada }.
 *  - identificada=true  → identificação de origem (STIR/SHAKEN) ativa.
 *  - identificada=false → modalidade de número A escolhida.
 */
export function descreverModalidade(config, modos) {
  if (!config)
    return { topLabel: 'Caller ID', label: '—', detalhe: '', identificada: false }

  if (config.identificacaoOrigem) {
    return {
      topLabel: 'Identificação de origem em operação',
      label: 'Identificação de origem (STIR/SHAKEN)',
      detalhe: 'A chamada sai com a origem verificada',
      identificada: true,
    }
  }

  const modo = modos.find((m) => m.id === config.modo)
  const label = modo?.titulo || '—'
  let detalhe = ''
  if (config.modo === 'lista_carregada') detalhe = 'Lista de números carregados'
  else if (config.modo === 'manual') {
    const qtd = (config.numerosManuais || '')
      .split(/[\s,;]+/)
      .filter(Boolean).length
    detalhe = qtd ? `${qtd} número(s) manuais` : 'Configuração manual'
  }
  return {
    topLabel: 'Modalidade de número A (Caller ID) em operação',
    label,
    detalhe,
    identificada: false,
  }
}
