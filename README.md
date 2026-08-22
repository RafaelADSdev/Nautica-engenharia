# Náutica Engenharia

Monorepo da reconstrução institucional da Náutica Engenharia.

- `apps/web`: site público em Astro, gerado estaticamente.
- `apps/studio`: painel editorial Sanity Studio.

O site usa o conteúdo editorial local como fallback e passa a consultar o dataset publicado do Sanity quando `SANITY_PROJECT_ID` e `SANITY_DATASET` estão configurados.

## Desenvolvimento

1. Copie os arquivos `.env.example` para `.env` apenas quando houver credenciais.
2. Execute `pnpm install`.
3. Execute `pnpm dev` para o site e `pnpm --filter @nautica/studio dev` para o Studio.
4. Execute `pnpm validate` antes de abrir um pull request.

### Imagens locais

Os arquivos originais permanecem em `apps/web/public/assets` para a importação no
Sanity. Depois de substituir qualquer foto ou logo local, execute
`pnpm --filter @nautica/web assets:optimize` e versione as derivações WebP geradas
em `public/assets/optimized`. O frontend usa `srcset` para entregar 320, 640, 960
ou 1600 px conforme a tela.

## Publicação

O projeto web deve ser conectado à Vercel com `apps/web` como diretório raiz. A publicação do conteúdo no Sanity aciona um Deploy Hook da branch `main`; a URL do hook deve ser tratada como segredo.

## Conteúdo e Sanity

O frontend usa `apps/web/src/lib/content.ts` como camada de leitura. Sem `SANITY_PROJECT_ID`, ele valida e devolve o inventário local versionado. Com o ID configurado, consulta o dataset durante o build com `useCdn: false` e perspectiva `published`; rascunhos são excluídos também no GROQ. Cada campo ausente ou inválido preserva o respectivo valor local, e uma falha remota nunca remove páginas do build.

Variáveis do build na Vercel (Production e Preview):

- `SANITY_PROJECT_ID`: ID público do projeto Sanity.
- `SANITY_DATASET`: normalmente `production`.
- `SANITY_API_VERSION`: `2026-08-01` (fixa para builds reproduzíveis).

Não exponha token de escrita no site. A leitura de documentos publicados não usa `SANITY_AUTH_TOKEN`.

### Importação inicial

1. Copie `apps/studio/.env.example` para `apps/studio/.env` e preencha localmente.
2. Use um token de Editor somente em `SANITY_AUTH_TOKEN` e informe `SANITY_LEGAL_REVIEWED_AT` depois da aprovação jurídica.
3. Execute `pnpm content:validate`. Esse comando faz preflight de contagens, slugs, galerias e arquivos, sem alterar o Sanity.
4. Execute `pnpm sanity:seed` para enviar as imagens e gravar documentos com IDs determinísticos.
5. Revogue o token temporário ou remova-o do ambiente ao terminar.

O seed exige `--apply` (já incluído no script `sanity:seed`), usa `createOrReplace` e não apaga documentos extras. Assim, ele pode ser repetido durante a migração, mas sobrescreve os documentos com IDs gerenciados (`service.*`, `case.*`, `partner.*`, `team.*`, `legal.*`, `siteSettings` e `homePage`).

### Rebuild após publicação

1. Na Vercel, crie um Deploy Hook apontando para `main` e dê a ele um nome que não revele o endereço.
2. No Sanity Manage, crie um webhook para `create`, `update` e `delete`, filtrado aos tipos editoriais do projeto, e use a URL completa do Deploy Hook como destino `POST`.
3. Guarde a URL do hook como credencial: não a coloque em `.env` público, código, issue, log ou documentação compartilhada.
4. Publique uma alteração de teste e confirme na Vercel que o novo deploy terminou com validação, testes e build antes de promovê-lo.
5. Se a URL vazar, exclua o hook na Vercel e gere outro. Previews continuam isolados; somente o hook de `main` deve ser cadastrado no Sanity.

Filtro sugerido para o webhook:

```text
_type in ["siteSettings", "homePage", "service", "caseStudy", "partner", "teamMember", "legalPage"]
```
