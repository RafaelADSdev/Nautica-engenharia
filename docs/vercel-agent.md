# Vercel Agent — configuração do projeto

Este repositório está preparado para usar o [Vercel Agent](https://vercel.com/docs/agent) após conectar o GitHub à Vercel.

## 1. Conectar o repositório

1. Acesse [vercel.com/new](https://vercel.com/new) e importe `RafaelADSdev/Nautica-engenharia`.
2. Configure o projeto:
   - **Root Directory:** `apps/web`
   - **Framework:** Astro
   - **Production Branch:** `main`
3. Adicione as variáveis de ambiente (Production, Preview e Development):
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET` = `production`
   - `SANITY_API_VERSION` = `2026-08-01`

Detalhes completos em [DEPLOYMENT.md](./DEPLOYMENT.md).

## 2. Habilitar o Vercel Agent

1. No dashboard da Vercel, abra **Agent** (ou `/{team}/~/vercel-agent`).
2. Ative **Code Review** → *Review PRs and build failures automatically*.
3. Em **Repositories**, inclua `RafaelADSdev/Nautica-engenharia`.
4. Salve as preferências.

O agente usa o contexto do repositório, builds, logs e o arquivo `AGENTS.md` na raiz para orientar revisões.

## 3. Recursos disponíveis

| Recurso | Uso |
| --- | --- |
| [Code Review](https://vercel.com/docs/agent/pr-review) | Revisão automática de PRs; mencione `@vercel` em comentários |
| [Investigation](https://vercel.com/docs/agent/investigation) | Análise de anomalias (requer Observability Plus) |
| [Installation](https://vercel.com/docs/agent/installation) | Instala Web Analytics / Speed Insights via PR |
| [Chat](https://vercel.com/docs/agent/chat/dashboard) | Perguntas sobre deploys e projeto no dashboard |

## 4. Fluxo recomendado

1. Abra PR para `main`.
2. Aguarde o workflow **Quality** (GitHub Actions) e o preview da Vercel.
3. Solicite revisão do Vercel Agent (`@vercel run a review` no PR, se necessário).
4. Após aprovação, merge em `main` → deploy de produção.

## 5. Custos

Code Review e Investigation consomem créditos conforme [preços do Vercel Agent](https://vercel.com/docs/agent/pricing). A instalação de SDKs via Agent é gratuita.
