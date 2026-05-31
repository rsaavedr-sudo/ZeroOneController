# Arquitetura

Este documento descreve a organização do frontend do **CallerController** e o
fluxo de dados, com foco em como a camada mock será substituída pela API real.

## Visão geral

```
┌─────────────────────────────────────────────────────────────┐
│                          Telas (pages)                       │
│   Dashboard · QualityByArea · InboundCalls · WhatsAppChannel │
│                      · CallerIdConfig                        │
└───────────────┬───────────────────────────┬─────────────────┘
                │ consome                    │ lê/escreve config
                ▼                            ▼
        services/api.js            context/CallerIdContext.jsx
                │                            │
                ▼                            ▼
          data/mockData.js  ◄───────────────┘
        (hoje: fonte de dados; amanhã: substituído por fetch)
```

## Camadas

### 1. Telas (`src/pages`)
Cada tela é responsável por orquestrar o carregamento dos dados (via
`services/api.js`) e renderizar componentes. Não contêm dados fixos.

### 2. Componentes (`src/components`)
- `ui/` — primitivos reutilizáveis (Card, Badge, Switch, Spinner, Sparkline).
- `layout/` — Sidebar e Header.
- `dashboard/`, `quality/`, `inbound/`, `whatsapp/` — componentes específicos
  de cada domínio (gráficos e tabelas).

### 3. Estado global (`src/context/CallerIdContext.jsx`)
A configuração de Caller ID (modalidade de número A, identificação de origem,
chamada de entrada, canal WhatsApp) é mantida em um contexto React para que o
Dashboard reflita imediatamente o que é definido na tela de configuração.

Regras de exclusão mantidas no contexto/tela:
- As modalidades de número A e o STIR/SHAKEN são **mutuamente excludentes**.
- **Chamada de entrada**: disponível para "número fixo aleatório" ou STIR/SHAKEN.
- **Canal WhatsApp**: disponível apenas para STIR/SHAKEN.
- Ao trocar de modalidade, recursos não suportados são desativados automaticamente.

### 4. Acesso a dados (`src/services/api.js`)
Ponto único de leitura/escrita. Hoje cada função retorna dados de `mockData.js`
encapsulados em `Promise` (com latência simulada). Cada função traz um
comentário `// FUTURO:` com o endpoint real sugerido.

### 5. Dados mock (`src/data/mockData.js`)
Geradores **determinísticos** (mesma data/opção → mesmos números) para KPIs,
séries por hora, qualidade por DDD, estatísticas de Caller ID, chamadas de
entrada e engajamento de WhatsApp.

## Fluxo de carregamento (exemplo: Dashboard)

```
useEffect → fetchDiasDisponiveis()
          → carregar(data) →
              Promise.all([ fetchKpis, fetchUsoPorHora,
                            fetchNaoAtendidas, fetchChamadasRecentes ])
          → setState → render (KPIs, gráficos, tabela)
```

## Migração mock → API real

1. Definir `VITE_USE_MOCK=false` e `VITE_API_BASE_URL` em `.env.local`.
2. Em `services/api.js`, trocar o corpo de cada função por `fetch()` no endpoint
   correspondente (ver `docs/API.md`), mantendo o **mesmo formato de retorno**.
3. Recomendado manter um *switch* por `VITE_USE_MOCK` para alternar entre mock e
   API durante o desenvolvimento.

> Como as telas dependem apenas das assinaturas de `services/api.js`, a migração
> não exige alterações em `pages/` nem em `components/`.

## Decisões de design

- **Determinismo do mock**: facilita demonstração e testes visuais consistentes.
- **Camada de serviço única**: isola o frontend do backend e simplifica a troca.
- **Tailwind + tokens `brand`**: identidade visual centralizada em
  `tailwind.config.js`.
- **Sem dependência de armazenamento do navegador**: todo estado vive em memória
  (React state/context).
