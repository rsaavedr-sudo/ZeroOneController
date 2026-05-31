# Guia de Contribuição

Obrigado por contribuir com o **CallerController**. Este guia descreve o fluxo
de trabalho, as convenções de código e o padrão de commits adotados.

## Pré-requisitos

- Node.js 20+ (ver `.nvmrc`)
- npm 10+

```bash
npm install
npm run dev
```

## Fluxo de trabalho

1. Crie um branch a partir de `main`:
   - `feat/<descricao>` — nova funcionalidade
   - `fix/<descricao>` — correção
   - `docs/<descricao>` — documentação
   - `refactor/<descricao>` — refatoração sem mudança de comportamento
2. Faça commits pequenos e descritivos (ver convenção abaixo).
3. Garanta que o build passa: `npm run build`.
4. Abra um Pull Request descrevendo o **o quê** e o **porquê**.

## Convenção de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
<tipo>(<escopo opcional>): <descrição no imperativo>
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

Exemplos:
```
feat(whatsapp): adicionar seção de engajamento do canal
fix(caller-id): corrigir exclusão mútua entre modalidades
docs(api): documentar contrato de chamadas de entrada
```

## Convenções de código

- **Componentes**: um componente por arquivo, `PascalCase.jsx`. Componentes
  reutilizáveis em `src/components/ui`.
- **Dados**: nenhum dado fixo dentro das telas — tudo passa por
  `src/services/api.js`. Mock fica em `src/data/mockData.js`.
- **Estilo**: TailwindCSS; evite CSS solto. Reaproveite os tokens de cor
  (`brand`) definidos em `tailwind.config.js`.
- **Formatação**: 2 espaços de indentação, aspas simples, sem ponto e vírgula
  desnecessário (ver `.editorconfig`).
- **Idioma**: textos da interface e comentários em **português (pt-BR)**.
- **Acessibilidade**: use `aria-*` e elementos semânticos quando aplicável.

## Adicionando uma nova tela

1. Crie a página em `src/pages/`.
2. Adicione a função de dados em `src/services/api.js` (e o gerador mock em
   `src/data/mockData.js`).
3. Registre a rota em `src/App.jsx` e o item de menu em
   `src/components/layout/Sidebar.jsx`.
4. Atualize o `CHANGELOG.md`.

## Checklist do Pull Request

- [ ] `npm run build` passa sem erros.
- [ ] Sem dados fixos nas telas (consome via `services/api.js`).
- [ ] `CHANGELOG.md` atualizado.
- [ ] Responsivo (testado em telas pequenas).
