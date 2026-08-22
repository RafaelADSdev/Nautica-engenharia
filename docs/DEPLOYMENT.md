# Publicação, previews e atualizações de conteúdo

## Vercel

Crie um projeto privado ligado a este repositório e use estas configurações:

- **Root Directory:** `apps/web`
- **Framework Preset:** Astro
- **Production Branch:** `main`
- **Install Command:** `pnpm install --frozen-lockfile`
- **Build Command:** manter o valor de `apps/web/vercel.json`
- **Output Directory:** `dist`

Cadastre `SANITY_PROJECT_ID`, `SANITY_DATASET=production` e
`SANITY_API_VERSION=2026-08-01` nos ambientes Production, Preview e Development.
O site consulta somente documentos publicados durante o build; não cadastre token
de escrita no projeto web.

Pull requests geram previews e não alteram produção. O workflow `Quality` precisa
estar verde antes da integração em `main`. O build da Vercel repete check, testes
unitários e build, portanto uma falha preserva o último deploy saudável.

Em **Domains**, cadastre `www.nauticaengenharia.com` como domínio principal e
configure `nauticaengenharia.com` para redirecionar permanentemente ao domínio com
`www`. Não altere o DNS antes da aprovação do preview final.

## Sanity Studio

Defina `SANITY_STUDIO_PROJECT_ID` e `SANITY_STUDIO_DATASET=production` no ambiente
local do Studio. Esses valores identificam o projeto e o dataset; tokens e URLs de
deploy hook nunca devem entrar no repositório.

No painel da Vercel, crie um Deploy Hook chamado `Sanity Production`, apontado para
a branch `main`. Trate a URL gerada como segredo. No gerenciamento do projeto
Sanity, crie um webhook com:

- URL: a URL secreta do Deploy Hook;
- dataset: `production`;
- eventos: create, update e delete;
- filtro GROQ:
  `!(_id in path("drafts.**")) && _type in ["siteSettings", "homePage", "service", "caseStudy", "partner", "teamMember", "legalPage"]`;
- projeção: `{_id, _type}`;
- método: `POST`.

Assim, alterações de rascunho não disparam publicação; a mutação do documento
publicado inicia um novo build estático. Valide o webhook primeiro em um preview ou
projeto de homologação.

## Checklist de corte e recuperação

1. Congele alterações no Wix e faça a importação final para o Sanity.
2. Aprove copy, fotos, marcas parceiras, claims e as 16 URLs no preview.
3. Confirme o workflow `Quality` e o deploy de produção.
4. Teste o webhook publicando uma alteração controlada no Sanity.
5. Aponte os domínios somente após a aprovação formal.
6. Mantenha o Wix recuperável por pelo menos 14 dias.

Para recuperar uma versão anterior, abra **Deployments** na Vercel, selecione o
último deploy aprovado e use **Promote to Production**. Essa ação não altera o
conteúdo no Sanity; corrija o conteúdo antes de permitir um novo rebuild.
