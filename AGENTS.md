# Náutica Engenharia — guia para agentes

## Visão geral

Monorepo da reconstrução institucional da Náutica Engenharia.

- `apps/web`: site público em Astro (SSG), deploy na Vercel com root em `apps/web`.
- `apps/studio`: Sanity Studio para conteúdo editorial.

O site usa conteúdo local versionado como fallback e consulta o Sanity em build quando `SANITY_PROJECT_ID` está configurado.

## Comandos principais

```bash
pnpm install
pnpm dev
pnpm validate
pnpm build
pnpm test
pnpm test:e2e
```

## Convenções de código

- Responda e documente em português (pt-BR).
- Prefira diffs pequenos e focados; não altere arquivos fora do escopo pedido.
- Siga os padrões existentes de componentes Astro, tipos em `apps/web/src/data/types.ts` e conteúdo em `apps/web/src/data/site.ts`.
- Não commite `.env`, tokens, URLs de Deploy Hook ou outros segredos.
- Use `var(--*)` e tokens de `global.css` em vez de cores hardcoded, exceto em marcas de terceiros (ex.: WhatsApp `#25D366`).
- Ícones Lucide via `astro-icon` (`lucide:*`). Ícones de marca com componentes dedicados (ex.: `WhatsAppIcon.astro`).
- Imagens locais: originais em `public/assets`, otimizadas em `public/assets/optimized` via `pnpm --filter @nautica/web assets:optimize`.

## Qualidade antes de merge

1. `pnpm validate` (content:validate + check + test + build)
2. Workflow `Quality` no GitHub Actions deve passar
3. Revisar previews da Vercel em PRs

## Deploy

- Produção: branch `main`, root `apps/web`, output `dist`
- Variáveis de build: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`
- Detalhes em `docs/DEPLOYMENT.md` e `docs/vercel-agent.md`

## Áreas sensíveis

- `apps/web/src/lib/content.ts`: camada de leitura Sanity + fallback local
- `apps/studio/scripts/seed.ts`: seed determinístico — exige revisão cuidadosa
- Claims legais, WhatsApp e dados de contato em `apps/web/src/data/site.ts`
