# Zero2One · Call Controller (Maqueta Frontend)

Maquete frontend de uma plataforma de **monitoramento de chamadas manuais de saída** para operadores e supervisores de call center (chamadas via PBX).

Esta é uma **primeira versão visual**. Não há backend, banco de dados nem login. Todos os dados são **fictícios (mock)**, mas com aparência realista. A estrutura já está preparada para conexão futura com uma API real.

## Stack

- **React 18** + **Vite**
- **TailwindCSS** (estilo SaaS moderno)
- **Recharts** (gráficos)
- **Lucide React** (ícones)
- **React Router** (navegação)

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (por padrão `http://localhost:5173`).

Build de produção:

```bash
npm run build
npm run preview
```

## Telas

1. **Dashboard de Monitoramento** — 8 cards de KPI, gráfico de uso por hora
   (chamadas × minutos falados), gráfico de distribuição de chamadas não
   atendidas e tabela de chamadas recentes.
2. **Configuração de Caller ID** — seleção do número A (opções mutuamente
   exclusivas via radio buttons), lista de números carregados, configuração
   manual em formato E.164 com validação, e switch de identificação de origem
   (mostrar Caller ID vs. chamada anônima) com alerta.

## Estrutura

```
src/
├── App.jsx                      # Layout (sidebar + header) e rotas
├── main.jsx                     # Bootstrap React + Router
├── index.css                    # Tailwind + estilos globais
├── data/
│   └── mockData.js              # TODOS os dados fictícios (KPIs, horas, etc.)
├── services/
│   └── api.js                   # Camada de dados (hoje mock → amanhã fetch real)
├── lib/
│   └── format.js                # Utilidades de formatação (pt-BR)
├── components/
│   ├── layout/                  # Sidebar, Header
│   ├── ui/                      # Card, Badge, Switch, Spinner (reutilizáveis)
│   └── dashboard/               # KpiCard, gráficos, tabela
└── pages/
    ├── Dashboard.jsx
    └── CallerIdConfig.jsx
```

## Integração futura com a API

Toda a leitura de dados passa por `src/services/api.js`. Hoje essas funções
retornam os objetos de `mockData.js` envolvidos em `Promise` (com latência
simulada). Para conectar ao backend real, basta trocar o corpo de cada função
por um `fetch()` que respeite os mesmos formatos de dados — **as telas não
precisam mudar**. Há comentários `// FUTURO:` em cada função indicando o
endpoint sugerido.
