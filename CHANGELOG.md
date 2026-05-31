# Changelog

Todas as mudanças notáveis deste projeto são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Documentação profissional do projeto: `README` completo com capturas,
  `CHANGELOG`, `CONTRIBUTING`, `LICENSE`, `docs/ARQUITETURA.md`, `docs/API.md`
  (contrato de integração), `.env.example`, `.editorconfig` e `.nvmrc`.
- Metadados de `package.json` (autor, licença, repositório, keywords, engines).

### A fazer
- Conexão com backend/API real (toggle `VITE_USE_MOCK`).
- Autenticação e perfis de usuário.
- Testes automatizados.

---

## [0.8.0] — 2026-05-31

### Adicionado
- Sinalização dos recursos complementares ativos (chips de "Chamada de entrada"
  e "Canal WhatsApp") no banner do Dashboard.
- Resumo do Canal WhatsApp no Dashboard quando o canal está ativo (contatos
  discados, acionaram, taxa de engajamento, mensagens).

---

## [0.7.0] — 2026-05-31

### Adicionado
- **Canal WhatsApp** (disponível apenas com STIR/SHAKEN): switch de acionamento
  na configuração e seção dedicada com KPIs, distribuição "acionaram x não
  acionaram", acionamentos por hora e conversas recentes.
- `mockData`: gerador determinístico de engajamento do WhatsApp.

---

## [0.6.0] — 2026-05-31

### Adicionado
- **Chamadas de Entrada** (disponível para "número fixo aleatório" e
  STIR/SHAKEN): switch de acionamento e seção com KPIs, gráfico por hora e
  últimas 50 chamadas recebidas.
- `mockData`: gerador determinístico de chamadas de entrada.

---

## [0.5.0] — 2026-05-31

### Alterado
- Cada modalidade de Caller ID passou a ter seu próprio **switch** de
  acionamento (antes eram radio buttons); todas mutuamente excludentes,
  incluindo STIR/SHAKEN.
- Correção de semântica da **identificação de origem (STIR/SHAKEN)**: ao ativar,
  a chamada sai COM a origem verificada (substitui o antigo "chamada anônima").

### Adicionado
- **Contexto global** de configuração de Caller ID compartilhado entre as telas.
- Banner no Dashboard sinalizando a modalidade de número A em operação.

---

## [0.4.0] — 2026-05-30

### Adicionado
- **Qualidade por código de área**: ASR/ACD por DDD de destino (capitais de
  estado + demais DDDs), com semáforo de alerta, sparkline de 7 dias e detecção
  de quedas bruscas. Resumo no Dashboard e tela dedicada com filtro.

---

## [0.3.0] — 2026-05-30

### Adicionado
- **Estatísticas por opção de Caller ID**: comparativo de ASR e ACD entre as
  modalidades, com histórico de 30 dias e gráfico comparativo.

---

## [0.2.0] — 2026-05-30

### Adicionado
- **Filtro de data** no Dashboard (últimos 14 dias) com dados gerados de forma
  determinística por dia.

---

## [0.1.0] — 2026-05-30

### Adicionado
- Versão inicial: estrutura Vite + React + Tailwind.
- **Dashboard de Monitoramento**: KPIs, uso por hora, distribuição de não
  atendidas e tabela de chamadas recentes.
- **Configuração de Caller ID**: modalidades, lista de números, configuração
  manual (E.164) e identificação de origem.
- Camada `mockData.js` + `services/api.js` preparada para integração futura.

[Não lançado]: #não-lançado
[0.8.0]: #080--2026-05-31
[0.7.0]: #070--2026-05-31
[0.6.0]: #060--2026-05-31
[0.5.0]: #050--2026-05-31
[0.4.0]: #040--2026-05-30
[0.3.0]: #030--2026-05-30
[0.2.0]: #020--2026-05-30
[0.1.0]: #010--2026-05-30
