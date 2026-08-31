import {createReadStream, existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "node:path";
import {createClient, type SanityClient} from "@sanity/client";
import {
  caseCategories,
  homePage,
  legalPages,
  partners,
  services,
  siteSettings,
  teamMembers,
} from "../../web/src/data/site";
import type {ImageAsset, LegalPage, ServiceSlug} from "../../web/src/data/types";
import {validateSiteContent} from "../../web/src/lib/validate-content";

type SanityDocument = {_id: string; _type: string} & Record<string, unknown>;
type SanityImage = {
  _type: "image";
  asset: {_type: "reference"; _ref: string};
  alt: string;
  caption?: string;
};

const APPLY = process.argv.includes("--apply");
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = resolve(scriptDirectory, "../../web/public");
const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? "2026-08-01";
const token = process.env.SANITY_AUTH_TOKEN;
const reviewedAt = process.env.SANITY_LEGAL_REVIEWED_AT;

validateSiteContent({services, caseCategories, partners, teamMembers, legalPages});

const allAssetPaths = new Set<string>([
  "/assets/brand/logo-nautica.png",
  homePage.hero.image.src,
  homePage.about.image.src,
  ...services.flatMap((service) => [
    service.heroImage.src,
    ...service.gallery.map(({src}) => src),
  ]),
  ...caseCategories.flatMap((category) => [
    category.heroImage.src,
    ...category.gallery.map(({src}) => src),
  ]),
  ...partners.map(({logo}) => logo.src),
  ...teamMembers.map(({photo}) => photo.src),
]);

function diskPath(publicPath: string): string {
  if (!publicPath.startsWith("/assets/")) {
    throw new Error(`O seed aceita somente ativos locais em /assets/: ${publicPath}`);
  }
  return resolve(publicDirectory, publicPath.slice(1));
}

const missingAssets = [...allAssetPaths].filter(
  (publicPath) => !existsSync(diskPath(publicPath)),
);
if (missingAssets.length > 0) {
  throw new Error(
    `Seed interrompido: ${missingAssets.length} arquivo(s) ausente(s):\n- ${missingAssets.join("\n- ")}`,
  );
}

if (!APPLY) {
  console.info(
    [
      "Pré-validação do seed concluída (nenhuma alteração remota foi feita).",
      `9 serviços, ${caseCategories.reduce((total, item) => total + item.cases.length, 0)} casos, 25 parceiros, 2 integrantes e 2 páginas legais.`,
      `${allAssetPaths.size} arquivos de imagem prontos para envio.`,
      "Para importar: configure as variáveis documentadas e execute pnpm --filter @nautica/studio seed:apply.",
    ].join("\n"),
  );
  process.exit(0);
}

if (!projectId) {
  throw new Error(
    "Defina SANITY_PROJECT_ID (ou SANITY_STUDIO_PROJECT_ID) antes de importar.",
  );
}
if (!token) {
  throw new Error("Defina SANITY_AUTH_TOKEN com permissão de Editor antes de importar.");
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt ?? "")) {
  throw new Error(
    "Defina SANITY_LEGAL_REVIEWED_AT no formato AAAA-MM-DD após a revisão jurídica do conteúdo.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "published",
});

const uploadedAssets = new Map<string, string>();

async function uploadImage(publicPath: string): Promise<string> {
  const cached = uploadedAssets.get(publicPath);
  if (cached) return cached;

  const asset = await client.assets.upload("image", createReadStream(diskPath(publicPath)), {
    filename: publicPath.split("/").at(-1),
  });
  uploadedAssets.set(publicPath, asset._id);
  console.info(`Imagem enviada: ${publicPath}`);
  return asset._id;
}

async function sanityImage(image: ImageAsset): Promise<SanityImage> {
  const assetId = await uploadImage(image.src);
  return {
    _type: "image",
    asset: {_type: "reference", _ref: assetId},
    alt: image.alt,
    ...(image.caption ? {caption: image.caption} : {}),
  };
}

let blockIndex = 0;
function block(
  text: string,
  style = "normal",
  listItem?: "bullet" | "number",
): Record<string, unknown> {
  blockIndex += 1;
  const key = `block${blockIndex.toString(36)}`;
  return {
    _type: "block",
    _key: key,
    style,
    ...(listItem ? {listItem, level: 1} : {}),
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}span`,
        marks: [],
        text,
      },
    ],
  };
}

function imageKey(image: SanityImage, key: string): SanityImage & {_key: string} {
  return {...image, _key: key};
}

function reference(id: string, key?: string): Record<string, string> {
  return {
    _type: "reference",
    _ref: id,
    ...(key ? {_key: key} : {}),
  };
}

function seo(
  value: {title: string; description: string; noIndex?: boolean},
  openGraphImage?: SanityImage,
): Record<string, unknown> {
  return {
    _type: "seo",
    metaTitle: value.title,
    metaDescription: value.description,
    noIndex: value.noIndex ?? false,
    ...(openGraphImage ? {openGraphImage} : {}),
  };
}

const studioIcon: Record<ServiceSlug, string> = {
  "recuperacao-e-reforco-estrutural": "structural-recovery",
  impermeabilizacao: "waterproofing",
  "trabalhos-em-altura": "work-at-height",
  obras: "construction",
  "instalacao-predial-e-industrial": "installations",
  "estrutura-metalica": "steel-structure",
  "sistemas-de-seguranca": "security-systems",
  "terceirizacao-mao-de-obra": "workforce",
  "laudos-e-projetos": "reports-projects",
};

const serviceIds = new Map(
  services.map(({slug}) => [slug, `service.${slug}`] as const),
);

function serviceReferences(activities: string[]): ServiceSlug[] {
  const text = activities.join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const slugs = new Set<ServiceSlug>();
  if (/recuper|refor|concreto|fissura|trinca/.test(text))
    slugs.add("recuperacao-e-reforco-estrutural");
  if (/imperme|infiltra|reservatorio/.test(text)) slugs.add("impermeabilizacao");
  if (/altura|fachada|telhado/.test(text)) slugs.add("trabalhos-em-altura");
  if (/metal|cobertura|mezanino/.test(text)) slugs.add("estrutura-metalica");
  if (/laudo|projeto|avaliacao/.test(text)) slugs.add("laudos-e-projetos");
  if (/camera|cftv|incendio|seguranca|concertina/.test(text))
    slugs.add("sistemas-de-seguranca");
  if (/eletric|hidraul|instalac/.test(text))
    slugs.add("instalacao-predial-e-industrial");
  if (/mao de obra|terceir/.test(text)) slugs.add("terceirizacao-mao-de-obra");
  if (slugs.size === 0 || /obra|construc|alvenaria|pintura|revestimento|manutencao/.test(text))
    slugs.add("obras");
  return [...slugs].slice(0, 4);
}

function legalBlocks(page: LegalPage): Record<string, unknown>[] {
  return [
    block(page.introduction),
    ...page.sections.flatMap((section) => [
      block(section.heading, "h2"),
      ...section.paragraphs.map((paragraph) => block(paragraph)),
      ...(section.items ?? []).map((item) => block(item, "normal", "bullet")),
    ]),
  ];
}

function whatsappMessage(href: string, fallback: string): string {
  try {
    return new URL(href).searchParams.get("text") ?? fallback;
  } catch {
    return fallback;
  }
}

async function buildDocuments(): Promise<SanityDocument[]> {
  const documents: SanityDocument[] = [];

  for (const [index, service] of services.entries()) {
    const heroImage = await sanityImage(service.heroImage);
    documents.push({
      _id: serviceIds.get(service.slug)!,
      _type: "service",
      title: service.title,
      slug: {_type: "slug", current: service.slug},
      shortDescription: service.summary,
      intro: service.introduction.join("\n\n"),
      content: [
        ...service.introduction.map((paragraph) => block(paragraph)),
        block(service.technicalHeading, "h2"),
        block(service.closing),
      ],
      technicalItems: service.technicalItems.map((item, itemIndex) => ({
        _type: "serviceItem",
        _key: `item${itemIndex + 1}`,
        title: item.title,
        description:
          item.description ?? item.details?.join("; ") ?? `${item.title}: escopo técnico.`,
      })),
      heroImage,
      gallery: await Promise.all(
        service.gallery.map(async (image, imageIndex) =>
          imageKey(await sanityImage(image), `gallery${imageIndex + 1}`),
        ),
      ),
      icon: studioIcon[service.slug],
      relatedServices: service.relatedSlugs.map((slug, relatedIndex) =>
        reference(serviceIds.get(slug)!, `related${relatedIndex + 1}`),
      ),
      whatsappMessage: service.whatsappMessage,
      order: index + 1,
      seo: seo(service.seo, heroImage),
    });
  }

  for (const member of teamMembers) {
    const education =
      member.slug === "pedro-paulo-seabra"
        ? ["Engenharia Civil", "Marketing", "Especialização em Sistemas de Segurança"]
        : [
            "Engenharia Civil",
            "Técnico de Segurança",
            "Especialização em Patologia das Construções",
            "MBA em Planejamento e Controle de Obras",
          ];
    documents.push({
      _id: `team.${member.slug}`,
      _type: "teamMember",
      name: member.name,
      role: member.role,
      education,
      bio: member.bio,
      photo: await sanityImage(member.photo),
      order: member.order,
    });
  }

  for (const partner of partners) {
    documents.push({
      _id: `partner.${partner.slug}`,
      _type: "partner",
      name: partner.name,
      category: partner.category,
      logo: await sanityImage(partner.logo),
      ...(partner.url ? {website: partner.url} : {}),
      order: partner.order,
    });
  }

  for (const category of caseCategories) {
    const gallery = await Promise.all(category.gallery.map(sanityImage));
    for (const [caseIndex, item] of category.cases.entries()) {
      const related = serviceReferences(item.activities);
      documents.push({
        _id: `case.${item.slug}`,
        _type: "caseStudy",
        client: item.client,
        category: category.key,
        summary: item.summary,
        servicesPerformed: related.map((slug, index) =>
          reference(serviceIds.get(slug)!, `service${index + 1}`),
        ),
        result: category.result,
        gallery: gallery.map((image, index) => imageKey(image, `gallery${index + 1}`)),
        featured: caseIndex === 0,
        order: caseIndex + 1,
      });
    }
  }

  for (const page of legalPages) {
    documents.push({
      _id: `legal.${page.slug}`,
      _type: "legalPage",
      title: page.title,
      slug: {_type: "slug", current: page.slug},
      content: legalBlocks(page),
      reviewedAt,
      seo: seo(page.seo),
    });
  }

  const logo = await sanityImage({
    src: "/assets/brand/logo-nautica.png",
    alt: "Náutica Engenharia",
  });
  documents.push({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: siteSettings.businessName,
    legalName: siteSettings.legalName,
    description: siteSettings.description,
    logo,
    email: siteSettings.email,
    whatsapp: new URL(siteSettings.whatsapp.baseUrl).pathname.replace(/\D/g, ""),
    phones: siteSettings.phones.map((phone, index) => ({
      _type: "phone",
      _key: `phone${index + 1}`,
      label: phone.label,
      number: phone.value,
    })),
    address: {
      _type: "object",
      street: `${siteSettings.address.street}, ${siteSettings.address.number}`,
      city: siteSettings.address.city,
      state: siteSettings.address.state,
    },
    serviceStates: siteSettings.states.map(({name}) => name),
    socialLinks: siteSettings.socialLinks
      .filter((link) => link.url)
      .map((link, index) => ({
        _type: "socialLink",
        _key: `social${index + 1}`,
        platform: link.platform,
        url: link.url,
      })),
    defaultSeo: seo(siteSettings.defaultSeo, await sanityImage(homePage.hero.image)),
  });

  documents.push({
    _id: "homePage",
    _type: "homePage",
    hero: {
      eyebrow: homePage.hero.eyebrow,
      title: homePage.hero.title,
      summary: homePage.hero.description,
      image: await sanityImage(homePage.hero.image),
      ctaLabel: homePage.hero.primaryCta.label,
      ctaHref: homePage.hero.primaryCta.href,
    },
    indicators: homePage.stats.map((stat, index) => ({
      _type: "indicator",
      _key: `indicator${index + 1}`,
      ...stat,
    })),
    about: {
      heading: homePage.about.title,
      body: homePage.about.paragraphs.map((paragraph) => block(paragraph)),
      image: await sanityImage(homePage.about.image),
    },
    teamMembers: teamMembers.map((member, index) =>
      reference(`team.${member.slug}`, `team${index + 1}`),
    ),
    services: services.map((service, index) =>
      reference(serviceIds.get(service.slug)!, `service${index + 1}`),
    ),
    caseCategoryCards: await Promise.all(
      caseCategories.map(async (category, index) => ({
        _type: "caseCategoryCard",
        _key: `caseCategory${index + 1}`,
        category: category.key,
        title: category.title,
        summary: category.description,
        image: await sanityImage(category.heroImage),
      })),
    ),
    partnersHeading: homePage.partners.title,
    coverage: {
      heading: homePage.coverage.title,
      summary: homePage.coverage.description,
      states: siteSettings.states.map(({name}) => name),
    },
    finalCta: {
      title: homePage.finalCta.title,
      summary: homePage.finalCta.description,
      buttonLabel: homePage.finalCta.cta.label,
      whatsappMessage: whatsappMessage(
        homePage.finalCta.cta.href,
        "Olá! Gostaria de conversar sobre uma necessidade de engenharia.",
      ),
    },
    sectionOrder: [
      "indicators",
      "about",
      "team",
      "services",
      "cases",
      "partners",
      "coverage",
      "finalCta",
    ],
    seo: seo(homePage.seo, await sanityImage(homePage.hero.image)),
  });

  return documents;
}

async function commitInBatches(
  sanityClient: SanityClient,
  documents: SanityDocument[],
): Promise<void> {
  const batchSize = 40;
  for (let index = 0; index < documents.length; index += batchSize) {
    const batch = documents.slice(index, index + batchSize);
    let transaction = sanityClient.transaction();
    for (const document of batch) transaction = transaction.createOrReplace(document);
    await transaction.commit({visibility: "sync"});
    console.info(`Documentos gravados: ${Math.min(index + batch.length, documents.length)}/${documents.length}`);
  }
}

const documents = await buildDocuments();
await commitInBatches(client, documents);
console.info(
  `Seed concluído: ${documents.length} documentos em ${projectId}/${dataset}. Nenhum rascunho foi criado.`,
);
