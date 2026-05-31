# Contrato de API

Especificação dos endpoints que o backend deve expor para substituir a camada
mock. Os formatos abaixo correspondem exatamente aos objetos retornados hoje por
`src/data/mockData.js` e consumidos por `src/services/api.js`.

- **Base URL**: `VITE_API_BASE_URL` (ex.: `/api`)
- **Formato**: JSON (`Content-Type: application/json`)
- **Datas**: `data` no formato `YYYY-MM-DD`
- **Autenticação**: sugerido `Authorization: Bearer <token>` (a definir)

## Convenção de resposta

Os endpoints retornam diretamente o objeto/array descrito (sem envelope). Erros
seguem o padrão HTTP (`4xx`/`5xx`) com corpo:

```json
{ "error": { "code": "string", "message": "string" } }
```

---

## Dashboard

### GET `/dashboard/dias`
Lista de dias disponíveis para o filtro.
```json
[ { "valor": "2026-05-30", "label": "Hoje · 30/05" } ]
```

### GET `/dashboard/kpis?data=YYYY-MM-DD`
```json
{
  "data": "2026-05-30",
  "totalChamadas": 1284,
  "totalTentativas": 1637,
  "chamadasAtendidas": 842,
  "chamadasNaoAtendidas": 442,
  "efetividade": 65.6,
  "minutosFalados": 3970,
  "duracaoMedia": 4.7,
  "tendencias": {
    "totalChamadas": 8.2, "totalTentativas": 5.1, "chamadasAtendidas": 11.4,
    "chamadasNaoAtendidas": -3.6, "efetividade": 2.9, "minutosFalados": 6.8,
    "duracaoMedia": -1.2
  }
}
```

### GET `/dashboard/uso-por-hora?data=YYYY-MM-DD`
```json
[ { "hora": "08h", "chamadas": 42, "minutos": 121 } ]
```

### GET `/dashboard/nao-atendidas?data=YYYY-MM-DD`
```json
[ { "tipo": "Caixa postal", "valor": 138, "cor": "#3563ff" } ]
```

### GET `/chamadas/recentes?data=YYYY-MM-DD`
```json
[ {
  "id": "c-2051", "dataHora": "2026-05-30 17:42:11", "operador": "Mariana Costa",
  "cliente": "Auto Peças Silva", "numeroDestino": "+5511987654321",
  "callerId": "+5511934567890", "resultado": "atendida", "duracaoSeg": 372
} ]
```
`resultado` ∈ `atendida | caixa_postal | caixa_postal_ios | ocupado | nao_atende | rejeitada_b | rejeitada_tecnica`.

---

## Qualidade por código de área

### GET `/dashboard/qualidade-area?data=YYYY-MM-DD`
```json
[ {
  "codigo": "+55 11", "pais": "Brasil", "uf": "SP", "capital": true,
  "regiao": "São Paulo", "chamadas": 4200, "atendidas": 2688,
  "asr": 64.0, "acd": 4.8, "asr7": 63.5,
  "serie7": [ { "data": "2026-05-24", "asr": 62.1 } ],
  "nivel": "ok", "quedaBrusca": false
} ]
```
`nivel` ∈ `critico (ASR<40) | alerta (40–55) | ok (>55)`.

---

## Caller ID

### GET `/caller-id/modos`
```json
[ { "id": "aleatorio_mesma_area", "titulo": "...", "descricao": "..." } ]
```

### GET `/caller-id/listas`
```json
[ {
  "id": "lista-br-sp", "nome": "Lista Brasil São Paulo", "pais": "Brasil",
  "regiao": "São Paulo", "numeros": ["+5511934567890"]
} ]
```

### GET `/caller-id/config`
```json
{
  "modo": "aleatorio_mesma_area",
  "listaSelecionada": "lista-br-sp",
  "numerosManuais": "",
  "identificacaoOrigem": false,
  "chamadaEntradaAtiva": false,
  "canalWhatsappAtivo": false
}
```

### POST `/caller-id/config`
Corpo: o mesmo objeto de `GET /caller-id/config`. Resposta:
```json
{ "ok": true, "salvoEm": "2026-05-31T12:00:00Z" }
```

### GET `/caller-id/estatisticas?dias=30`
```json
[ {
  "modo": "aleatorio_mesma_area", "titulo": "...", "tituloCurto": "Aleatório mesma área",
  "asrMedio": 67.8, "acdMedio": 5.1, "chamadas30d": 31000,
  "serie": [ { "data": "2026-05-02", "rotulo": "02/05", "asr": 68.1, "acd": 5.0, "chamadas": 980 } ]
} ]
```

---

## Chamadas de entrada

### GET `/chamadas/entrada?data=YYYY-MM-DD`
```json
{
  "kpis": {
    "data": "2026-05-30", "total": 312, "atendidas": 245, "perdidas": 67,
    "taxaAtendimento": 78.5, "duracaoMedia": 4.3, "minutos": 1053,
    "esperaMediaSeg": 22,
    "tendencias": { "total": 5.1, "atendidas": 6.0, "perdidas": -2.0, "taxaAtendimento": 1.8 }
  },
  "porHora": [ { "hora": "08h", "entrantes": 14, "atendidas": 11 } ],
  "ultimas": [ {
    "id": "e-...", "dataHora": "2026-05-30 18:40:00", "numeroOrigem": "+55119...",
    "numeroDestino": "+5511934567890", "resultado": "atendida",
    "esperaSeg": 12, "duracaoSeg": 240, "operador": "Mariana Costa"
  } ]
}
```
`resultado` ∈ `atendida | perdida | abandonada | ocupado`.

---

## Canal WhatsApp

### GET `/canal-whatsapp?data=YYYY-MM-DD`
```json
{
  "kpis": {
    "data": "2026-05-30", "totalContatos": 450, "acionaram": 70,
    "naoAcionaram": 380, "taxaEngajamento": 15.6, "mensagens": 280,
    "conversasAtivas": 14, "tempoMedioPrimeiroContatoMin": 22,
    "tendencias": { "acionaram": 10.6, "taxaEngajamento": 7.9, "mensagens": -3.9 }
  },
  "distribuicao": [
    { "tipo": "Acionaram WhatsApp", "valor": 70, "cor": "#22c55e" },
    { "tipo": "Não acionaram", "valor": 380, "cor": "#cbd5e1" }
  ],
  "porHora": [ { "hora": "08h", "acionamentos": 4 } ],
  "conversas": [ {
    "id": "w-...", "dataHora": "2026-05-30 18:40:00", "contato": "Auto Peças Silva",
    "numeroOrigem": "+55119...", "numeroA": "+5511934567890",
    "mensagens": 6, "status": "respondido"
  } ]
}
```
`status` ∈ `respondido | aguardando | encerrado`.

---

## Mapa de funções → endpoints

| `services/api.js` | Método | Endpoint |
|-------------------|--------|----------|
| `fetchDiasDisponiveis` | GET | `/dashboard/dias` |
| `fetchKpis` | GET | `/dashboard/kpis` |
| `fetchUsoPorHora` | GET | `/dashboard/uso-por-hora` |
| `fetchNaoAtendidas` | GET | `/dashboard/nao-atendidas` |
| `fetchChamadasRecentes` | GET | `/chamadas/recentes` |
| `fetchQualidadePorArea` | GET | `/dashboard/qualidade-area` |
| `fetchModosCallerId` | GET | `/caller-id/modos` |
| `fetchListasCallerId` | GET | `/caller-id/listas` |
| `fetchConfigCallerId` | GET | `/caller-id/config` |
| `salvarConfigCallerId` | POST | `/caller-id/config` |
| `fetchEstatisticasCallerId` | GET | `/caller-id/estatisticas` |
| `fetchChamadasEntrada` | GET | `/chamadas/entrada` |
| `fetchCanalWhatsapp` | GET | `/canal-whatsapp` |
