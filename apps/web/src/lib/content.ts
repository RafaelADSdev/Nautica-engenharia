import {createClient} from "@sanity/client";
import {
  caseCategories as localCaseCategories,
  getWhatsAppUrl,
  homePage as localHomePage,
  legalPages as localLegalPages,
  partners as localPartners,
  services as localServices,
  siteSettings as localSiteSettings,
  teamMembers as localTeamMembers,
} from "../data/site";
import type {
  CaseCategory,
  CaseCategoryKey,
  HomePageContent,
  ImageAsset,
  LegalPage,
  LegalSection,
  Partner,
  PartnerCategory,
  SeoData,
  Service,
  ServiceSlug,
  SiteSettings,
  SocialLink,
  StateCoverage,
  TeamMember,
  TechnicalItem,
} from "../data/types";
import {validateSiteContent} from "./validate-content";

export interface SiteContent {
  siteSettings: SiteSettings;
  homePage: HomePageContent;
  services: Service[];
  caseCategories: CaseCategory[];
  partners: Partner[];
  teamMembers: TeamMember[];
  legalPages: LegalPage[];
}

type RawImage = {
  src?: string;
  alt?: string;
  caption?: string;
};

type RawSpan = {text?: string};
type RawBlock = {
  _type?: string;
  style?: string;
  listItem?: string;
  children?: RawSpan[];
};

type RawSeo = {
  metaTitle?: string;
  metaDescription?: string;
  openGraphImage?: RawImage;
  noIndex?: boolean;
};

type RawService = {
  _id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  intro?: string;
  content?: RawBlock[];
  technicalItems?: TechnicalItem[];
  heroImage?: RawImage;
  gallery?: RawImage[];
  icon?: string;
  proof?: string;
  relatedSlugs?: string[];
  whatsappMessage?: string;
  seo?: RawSeo;
};

type RawCase = {
  _id?: string;
  client?: string;
  category?: string;
  summary?: string;
  servicesPerformed?: Array<{title?: string; slug?: string}>;
  result?: string;
  gallery?: RawImage[];
  featured?: boolean;
  order?: number;
};

type RawPartner = {
  _id?: string;
  name?: string;
  category?: string;
  logo?: RawImage;
  website?: string;
  order?: number;
};

type RawTeamMember = {
  _id?: string;
  name?: string;
  role?: string;
  education?: string[];
  bio?: string;
  photo?: RawImage;
  order?: number;
};

type RawLegalPage = {
  title?: string;
  slug?: string;
  content?: RawBlock[];
  seo?: RawSeo;
};

type RawSiteSettings = {
  companyName?: string;
  legalName?: string;
  description?: string;
  email?: string;
  whatsapp?: string;
  phones?: Array<{label?: string; number?: string}>;
  address?: {
    street?: string;
    district?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  serviceStates?: string[];
  socialLinks?: Array<{platform?: string; url?: string}>;
  defaultSeo?: RawSeo;
};

type RawHomePage = {
  hero?: {
    eyebrow?: string;
    title?: string;
    summary?: string;
    image?: RawImage;
    ctaLabel?: string;
    ctaHref?: string;
  };
  indicators?: Array<{value?: string; label?: string}>;
  about?: {heading?: string; body?: RawBlock[]; image?: RawImage};
  partnersHeading?: string;
  coverage?: {heading?: string; summary?: string; states?: string[]};
  finalCta?: {
    title?: string;
    summary?: string;
    buttonLabel?: string;
    whatsappMessage?: string;
  };
  seo?: RawSeo;
};

interface RawSanityContent {
  siteSettings?: RawSiteSettings;
  homePage?: RawHomePage;
  services?: RawService[];
  cases?: RawCase[];
  partners?: RawPartner[];
  teamMembers?: RawTeamMember[];
  legalPages?: RawLegalPage[];
}

const CONTENT_QUERY = `{
  "siteSettings": *[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{
    companyName, legalName, description, email, whatsapp, phones,
    address, serviceStates, socialLinks,
    "defaultSeo": defaultSeo{
      metaTitle, metaDescription, noIndex,
      "openGraphImage": openGraphImage{"src": asset->url, alt, caption}
    }
  },
  "homePage": *[_type == "homePage" && !(_id in path("drafts.**"))][0]{
    "hero": hero{
      eyebrow, title, summary, ctaLabel, ctaHref,
      "image": image{"src": asset->url, alt, caption}
    },
    indicators,
    "about": about{
      heading, body,
      "image": image{"src": asset->url, alt, caption}
    },
    partnersHeading, coverage, finalCta,
    "seo": seo{
      metaTitle, metaDescription, noIndex,
      "openGraphImage": openGraphImage{"src": asset->url, alt, caption}
    }
  },
  "services": *[_type == "service" && !(_id in path("drafts.**"))] | order(order asc){
    _id, title, "slug": slug.current, shortDescription, intro, content,
    technicalItems, "heroImage": heroImage{"src": asset->url, alt, caption},
    "gallery": gallery[]{"src": asset->url, alt, caption}, icon, proof,
    "relatedSlugs": relatedServices[]->slug.current, whatsappMessage,
    "seo": seo{
      metaTitle, metaDescription, noIndex,
      "openGraphImage": openGraphImage{"src": asset->url, alt, caption}
    }
  },
  "cases": *[_type == "caseStudy" && !(_id in path("drafts.**"))] | order(category asc, order asc){
    _id, client, category, summary, result, featured, order,
    "servicesPerformed": servicesPerformed[]->{title, "slug": slug.current},
    "gallery": gallery[]{"src": asset->url, alt, caption}
  },
  "partners": *[_type == "partner" && !(_id in path("drafts.**"))] | order(order asc){
    _id, name, category, website, order,
    "logo": logo{"src": asset->url, alt, caption}
  },
  "teamMembers": *[_type == "teamMember" && !(_id in path("drafts.**"))] | order(order asc){
    _id, name, role, education, bio, order,
    "photo": photo{"src": asset->url, alt, caption}
  },
  "legalPages": *[_type == "legalPage" && !(_id in path("drafts.**"))]{
    title, "slug": slug.current, content,
    "seo": seo{
      metaTitle, metaDescription, noIndex,
      "openGraphImage": openGraphImage{"src": asset->url, alt, caption}
    }
  }
}`;

const ICONS: Record<string, Service["icon"]> = {
  "structural-recovery": "lucide:landmark",
  waterproofing: "lucide:droplets",
  "work-at-height": "lucide:hard-hat",
  construction: "lucide:building-2",
  installations: "lucide:wrench",
  "steel-structure": "lucide:warehouse",
  "security-systems": "lucide:cctv",
  workforce: "lucide:users",
  "reports-projects": "lucide:file-check-2",
};

const SERVICE_SLUGS = new Set(localServices.map(({slug}) => slug));
const CASE_KEYS = new Set(localCaseCategories.map(({key}) => key));
const PARTNER_CATEGORIES = new Set(localPartners.map(({category}) => category));

function localContent(): SiteContent {
  return {
    siteSettings: localSiteSettings,
    homePage: localHomePage,
    services: [...localServices],
    caseCategories: [...localCaseCategories],
    partners: [...localPartners],
    teamMembers: [...localTeamMembers],
    legalPages: [...localLegalPages],
  };
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function imageOrFallback(
  image: RawImage | undefined,
  fallback: ImageAsset,
): ImageAsset {
  if (!nonEmpty(image?.src) || !nonEmpty(image?.alt)) return fallback;

  return {
    src: image.src,
    alt: image.alt,
    ...(nonEmpty(image.caption)
      ? {caption: image.caption}
      : fallback.caption
        ? {caption: fallback.caption}
        : {}),
  };
}

function validImages(images: RawImage[] | undefined): ImageAsset[] {
  if (!Array.isArray(images)) return [];
  return images
    .filter(
      (image): image is Required<Pick<RawImage, "src" | "alt">> & RawImage =>
        nonEmpty(image?.src) && nonEmpty(image?.alt),
    )
    .map(({src, alt, caption}) => ({
      src,
      alt,
      ...(nonEmpty(caption) ? {caption} : {}),
    }));
}

function seoOrFallback(seo: RawSeo | undefined, fallback: SeoData): SeoData {
  return {
    title: nonEmpty(seo?.metaTitle) ? seo.metaTitle : fallback.title,
    description: nonEmpty(seo?.metaDescription)
      ? seo.metaDescription
      : fallback.description,
    ...(imageOrFallbackIfPresent(seo?.openGraphImage, fallback.image)
      ? {image: imageOrFallbackIfPresent(seo?.openGraphImage, fallback.image)}
      : {}),
    noIndex: typeof seo?.noIndex === "boolean" ? seo.noIndex : fallback.noIndex,
  };
}

function imageOrFallbackIfPresent(
  image: RawImage | undefined,
  fallback: string | undefined,
): string | undefined {
  return nonEmpty(image?.src) ? image.src : fallback;
}

function blockText(block: RawBlock): string {
  return (block.children ?? [])
    .map(({text}) => text ?? "")
    .join("")
    .trim();
}

function portableTextParagraphs(blocks: RawBlock[] | undefined): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter(({_type, listItem}) => _type === "block" && !listItem)
    .map(blockText)
    .filter(nonEmpty);
}

function portableTextToLegal(blocks: RawBlock[] | undefined): {
  introduction?: string;
  sections: LegalSection[];
} {
  if (!Array.isArray(blocks)) return {sections: []};

  let introduction: string | undefined;
  const sections: LegalSection[] = [];
  let active: LegalSection | undefined;

  for (const block of blocks) {
    if (block._type !== "block") continue;
    const text = blockText(block);
    if (!text) continue;

    if (/^h[1-6]$/.test(block.style ?? "")) {
      active = {heading: text, paragraphs: []};
      sections.push(active);
      continue;
    }

    if (!active && !introduction && !block.listItem) {
      introduction = text;
      continue;
    }

    if (!active) {
      active = {heading: "Informações", paragraphs: []};
      sections.push(active);
    }

    if (block.listItem) {
      active.items = [...(active.items ?? []), text];
    } else {
      active.paragraphs.push(text);
    }
  }

  return {introduction, sections};
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function idSlug(id: string | undefined, prefix: string): string | undefined {
  if (!nonEmpty(id)) return undefined;
  return id.startsWith(`${prefix}.`) ? id.slice(prefix.length + 1) : undefined;
}

function mapSiteSettings(raw: RawSiteSettings | undefined): SiteSettings {
  if (!raw) return localSiteSettings;

  const phones = (raw.phones ?? [])
    .filter(
      (phone): phone is {label: string; number: string} =>
        nonEmpty(phone.label) && nonEmpty(phone.number),
    )
    .map(({label, number}) => {
      const digits = number.replace(/\D/g, "");
      const internationalDigits = digits.length <= 11 ? `55${digits}` : digits;
      return {label, value: number, href: `tel:+${internationalDigits}`};
    });

  const socialLinks = (raw.socialLinks ?? [])
    .filter(
      (link): link is {platform: SocialLink["platform"]; url: string} =>
        ["facebook", "instagram", "youtube"].includes(link.platform ?? "") &&
        nonEmpty(link.url),
    )
    .map(({platform, url}) => {
      const fallback = localSiteSettings.socialLinks.find(
        (link) => link.platform === platform,
      );
      return {
        platform,
        label: fallback?.label ?? platform,
        handle: fallback?.handle ?? platform,
        url,
      };
    });

  const stateLookup = new Map<string, StateCoverage>();
  for (const state of localSiteSettings.states) {
    stateLookup.set(state.code.toLowerCase(), state);
    stateLookup.set(slugify(state.name), state);
  }
  const states = (raw.serviceStates ?? [])
    .map((state) => stateLookup.get(slugify(state)))
    .filter((state): state is StateCoverage => state !== undefined);

  const whatsappNumber = nonEmpty(raw.whatsapp)
    ? raw.whatsapp.replace(/\D/g, "")
    : new URL(localSiteSettings.whatsapp.baseUrl).pathname.replace(/\D/g, "");
  const nationalWhatsapp = whatsappNumber.startsWith("55")
    ? whatsappNumber.slice(2)
    : whatsappNumber;
  const formattedWhatsapp = /^\d{11}$/.test(nationalWhatsapp)
    ? `(${nationalWhatsapp.slice(0, 2)}) ${nationalWhatsapp.slice(2, 7)}-${nationalWhatsapp.slice(7)}`
    : localSiteSettings.whatsapp.number;

  const street = nonEmpty(raw.address?.street)
    ? raw.address.street
    : localSiteSettings.address.street;
  const city = nonEmpty(raw.address?.city)
    ? raw.address.city
    : localSiteSettings.address.city;
  const state = raw.address?.state === "PE" ? "PE" : localSiteSettings.address.state;

  return {
    ...localSiteSettings,
    businessName: nonEmpty(raw.companyName)
      ? raw.companyName
      : localSiteSettings.businessName,
    legalName: nonEmpty(raw.legalName) ? raw.legalName : localSiteSettings.legalName,
    description: nonEmpty(raw.description)
      ? raw.description
      : localSiteSettings.description,
    email: nonEmpty(raw.email) ? raw.email : localSiteSettings.email,
    phones: phones.length > 0 ? phones : localSiteSettings.phones,
    whatsapp: {
      ...localSiteSettings.whatsapp,
      number: formattedWhatsapp,
      baseUrl: `https://wa.me/${whatsappNumber}`,
    },
    address: {
      ...localSiteSettings.address,
      street,
      city,
      state,
      formatted: `${street} — ${city}, ${state}`,
    },
    states: (states.length > 0 ? states : localSiteSettings.states)
      .slice()
      .sort((left, right) => Number(right.isHeadquarters) - Number(left.isHeadquarters)),
    socialLinks:
      socialLinks.length > 0 ? socialLinks : localSiteSettings.socialLinks,
    defaultSeo: seoOrFallback(raw.defaultSeo, localSiteSettings.defaultSeo),
  };
}

function mapHomePage(raw: RawHomePage | undefined): HomePageContent {
  if (!raw) return localHomePage;

  const paragraphs = portableTextParagraphs(raw.about?.body);
  const indicators = (raw.indicators ?? []).filter(
    (item): item is {value: string; label: string} =>
      nonEmpty(item.value) && nonEmpty(item.label),
  );

  return {
    ...localHomePage,
    seo: seoOrFallback(raw.seo, localHomePage.seo),
    hero: {
      ...localHomePage.hero,
      eyebrow: nonEmpty(raw.hero?.eyebrow)
        ? raw.hero.eyebrow
        : localHomePage.hero.eyebrow,
      title: nonEmpty(raw.hero?.title) ? raw.hero.title : localHomePage.hero.title,
      description: nonEmpty(raw.hero?.summary)
        ? raw.hero.summary
        : localHomePage.hero.description,
      image: imageOrFallback(raw.hero?.image, localHomePage.hero.image),
      primaryCta: {
        label: nonEmpty(raw.hero?.ctaLabel)
          ? raw.hero.ctaLabel
          : localHomePage.hero.primaryCta.label,
        href: nonEmpty(raw.hero?.ctaHref)
          ? raw.hero.ctaHref
          : localHomePage.hero.primaryCta.href,
      },
    },
    stats: indicators.length > 0 ? indicators : localHomePage.stats,
    about: {
      ...localHomePage.about,
      title: nonEmpty(raw.about?.heading)
        ? raw.about.heading
        : localHomePage.about.title,
      paragraphs:
        paragraphs.length > 0 ? paragraphs : localHomePage.about.paragraphs,
      image: imageOrFallback(raw.about?.image, localHomePage.about.image),
    },
    partners: {
      ...localHomePage.partners,
      title: nonEmpty(raw.partnersHeading)
        ? raw.partnersHeading
        : localHomePage.partners.title,
    },
    coverage: {
      ...localHomePage.coverage,
      title: nonEmpty(raw.coverage?.heading)
        ? raw.coverage.heading
        : localHomePage.coverage.title,
      description: nonEmpty(raw.coverage?.summary)
        ? raw.coverage.summary
        : localHomePage.coverage.description,
    },
    finalCta: {
      ...localHomePage.finalCta,
      title: nonEmpty(raw.finalCta?.title)
        ? raw.finalCta.title
        : localHomePage.finalCta.title,
      description: nonEmpty(raw.finalCta?.summary)
        ? raw.finalCta.summary
        : localHomePage.finalCta.description,
      cta: {
        label: nonEmpty(raw.finalCta?.buttonLabel)
          ? raw.finalCta.buttonLabel
          : localHomePage.finalCta.cta.label,
        href: nonEmpty(raw.finalCta?.whatsappMessage)
          ? getWhatsAppUrl(raw.finalCta.whatsappMessage)
          : localHomePage.finalCta.cta.href,
      },
    },
  };
}

function mapServices(rawServices: RawService[] | undefined): Service[] {
  const bySlug = new Map(
    (rawServices ?? [])
      .filter(
        (service): service is RawService & {slug: ServiceSlug} =>
          nonEmpty(service.slug) && SERVICE_SLUGS.has(service.slug as ServiceSlug),
      )
      .map((service) => [service.slug, service]),
  );

  return localServices.map((fallback) => {
    const raw = bySlug.get(fallback.slug);
    if (!raw) return fallback;

    const gallery = validImages(raw.gallery);
    const relatedSlugs = (raw.relatedSlugs ?? []).filter(
      (slug): slug is ServiceSlug =>
        SERVICE_SLUGS.has(slug as ServiceSlug) && slug !== fallback.slug,
    );
    const contentParagraphs = portableTextParagraphs(raw.content);

    return {
      ...fallback,
      title: nonEmpty(raw.title) ? raw.title : fallback.title,
      navTitle: nonEmpty(raw.title) ? raw.title : fallback.navTitle,
      summary: nonEmpty(raw.shortDescription)
        ? raw.shortDescription
        : fallback.summary,
      introduction: nonEmpty(raw.intro) ? [raw.intro] : fallback.introduction,
      technicalItems:
        Array.isArray(raw.technicalItems) && raw.technicalItems.length > 0
          ? raw.technicalItems
              .filter(({title}) => nonEmpty(title))
              .map(({title, description, details}) => ({
                title,
                ...(nonEmpty(description) ? {description} : {}),
                ...(Array.isArray(details) && details.length > 0 ? {details} : {}),
              }))
          : fallback.technicalItems,
      closing: nonEmpty(raw.proof)
        ? raw.proof
        : contentParagraphs.at(-1) ?? fallback.closing,
      icon: nonEmpty(raw.icon) ? ICONS[raw.icon] ?? fallback.icon : fallback.icon,
      heroImage: imageOrFallback(raw.heroImage, fallback.heroImage),
      gallery: gallery.length > 0 ? gallery : fallback.gallery,
      whatsappMessage: nonEmpty(raw.whatsappMessage)
        ? raw.whatsappMessage
        : fallback.whatsappMessage,
      relatedSlugs:
        relatedSlugs.length > 0 ? relatedSlugs.slice(0, 3) : fallback.relatedSlugs,
      seo: seoOrFallback(raw.seo, fallback.seo),
    };
  });
}

function mapCaseCategories(rawCases: RawCase[] | undefined): CaseCategory[] {
  const validCases = (rawCases ?? []).filter(
    (item): item is RawCase & {category: CaseCategoryKey; client: string} =>
      nonEmpty(item.client) && CASE_KEYS.has(item.category as CaseCategoryKey),
  );

  return localCaseCategories.map((category) => {
    const remoteForCategory = validCases.filter(
      (item) => item.category === category.key,
    );
    if (remoteForCategory.length === 0) return category;

    const mapped = category.cases.map((fallback) => {
      const raw = remoteForCategory.find((item) => {
        const remoteSlug =
          idSlug(item._id, "case") ?? (item.client ? slugify(item.client) : "");
        return remoteSlug === fallback.slug || item.client === fallback.client;
      });
      if (!raw) return fallback;

      const images = validImages(raw.gallery);
      const activities = (raw.servicesPerformed ?? [])
        .map(({title}) => title)
        .filter(nonEmpty);

      return {
        ...fallback,
        client: raw.client,
        summary: nonEmpty(raw.summary) ? raw.summary : fallback.summary,
        activities: activities.length > 0 ? activities : fallback.activities,
        images: images.length > 0 ? images : fallback.images,
      };
    });

    const knownClients = new Set(mapped.map(({client}) => client));
    const additional = remoteForCategory
      .filter(({client}) => !knownClients.has(client))
      .map((raw) => ({
        slug: idSlug(raw._id, "case") ?? slugify(raw.client),
        client: raw.client,
        summary: nonEmpty(raw.summary) ? raw.summary : category.description,
        activities: (raw.servicesPerformed ?? [])
          .map(({title}) => title)
          .filter(nonEmpty),
        images: validImages(raw.gallery),
      }));

    const remoteImages = remoteForCategory.flatMap(({gallery}) =>
      validImages(gallery),
    );

    return {
      ...category,
      heroImage:
        remoteImages.length > 0 ? remoteImages[0] : category.heroImage,
      gallery: remoteImages.length > 0 ? remoteImages : category.gallery,
      cases: [...mapped, ...additional],
    };
  });
}

function mapPartners(rawPartners: RawPartner[] | undefined): Partner[] {
  const valid = (rawPartners ?? []).filter(
    (partner): partner is RawPartner & {
      name: string;
      category: PartnerCategory;
    } =>
      nonEmpty(partner.name) &&
      PARTNER_CATEGORIES.has(partner.category as PartnerCategory),
  );

  return localPartners.map((fallback) => {
    const raw = valid.find((item) => {
      const remoteSlug =
        idSlug(item._id, "partner") ?? slugify(item.name ?? "");
      return remoteSlug === fallback.slug || item.name === fallback.name;
    });
    if (!raw) return fallback;

    return {
      ...fallback,
      name: raw.name,
      category: raw.category,
      logo: imageOrFallback(raw.logo, fallback.logo),
      url: nonEmpty(raw.website) ? raw.website : fallback.url,
      order: Number.isInteger(raw.order) ? (raw.order as number) : fallback.order,
    };
  });
}

function mapTeam(rawMembers: RawTeamMember[] | undefined): TeamMember[] {
  return localTeamMembers.map((fallback) => {
    const raw = (rawMembers ?? []).find((item) => {
      const remoteSlug = idSlug(item._id, "team") ?? slugify(item.name ?? "");
      return remoteSlug === fallback.slug || item.name === fallback.name;
    });
    if (!raw) return fallback;

    return {
      ...fallback,
      name: nonEmpty(raw.name) ? raw.name : fallback.name,
      role: nonEmpty(raw.role) ? raw.role : fallback.role,
      bio: nonEmpty(raw.bio) ? raw.bio : fallback.bio,
      photo: imageOrFallback(raw.photo, fallback.photo),
      order: Number.isInteger(raw.order) ? (raw.order as number) : fallback.order,
    };
  });
}

function mapLegal(rawPages: RawLegalPage[] | undefined): LegalPage[] {
  return localLegalPages.map((fallback) => {
    const raw = (rawPages ?? []).find(({slug}) => slug === fallback.slug);
    if (!raw) return fallback;

    const parsed = portableTextToLegal(raw.content);
    return {
      ...fallback,
      title: nonEmpty(raw.title) ? raw.title : fallback.title,
      introduction: parsed.introduction ?? fallback.introduction,
      sections: parsed.sections.length > 0 ? parsed.sections : fallback.sections,
      seo: seoOrFallback(raw.seo, fallback.seo),
    };
  });
}

function mergeSanityContent(raw: RawSanityContent): SiteContent {
  return {
    siteSettings: mapSiteSettings(raw.siteSettings),
    homePage: mapHomePage(raw.homePage),
    services: mapServices(raw.services),
    caseCategories: mapCaseCategories(raw.cases),
    partners: mapPartners(raw.partners),
    teamMembers: mapTeam(raw.teamMembers),
    legalPages: mapLegal(raw.legalPages),
  };
}

export function isSanityConfigured(): boolean {
  return nonEmpty(process.env.SANITY_PROJECT_ID);
}

/**
 * Fonte única de conteúdo para as páginas Astro.
 *
 * Sem configuração, retorna o inventário versionado. Com Sanity configurado,
 * consulta apenas documentos publicados e mescla cada campo com o fallback local.
 */
async function loadSiteContent(): Promise<SiteContent> {
  const fallback = localContent();
  validateSiteContent(fallback);

  const projectId = process.env.SANITY_PROJECT_ID;
  if (!nonEmpty(projectId)) return fallback;

  try {
    const client = createClient({
      projectId,
      dataset: process.env.SANITY_DATASET ?? "production",
      apiVersion: process.env.SANITY_API_VERSION ?? "2026-08-01",
      useCdn: false,
      perspective: "published",
    });
    const raw = await client.fetch<RawSanityContent>(CONTENT_QUERY, {}, {
      perspective: "published",
    });
    const merged = mergeSanityContent(raw);
    validateSiteContent(merged);
    return merged;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `[conteúdo] Falha ao consultar/validar o Sanity; usando inventário local. ${reason}`,
    );
    return fallback;
  }
}

let cachedContent: Promise<SiteContent> | undefined;

export function getSiteContent(): Promise<SiteContent> {
  cachedContent ??= loadSiteContent();
  return cachedContent;
}
