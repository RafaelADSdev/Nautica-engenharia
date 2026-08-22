export type ServiceSlug =
  | "recuperacao-e-reforco-estrutural"
  | "impermeabilizacao"
  | "trabalhos-em-altura"
  | "obras"
  | "instalacao-predial-e-industrial"
  | "estrutura-metalica"
  | "sistemas-de-seguranca"
  | "terceirizacao-mao-de-obra"
  | "laudos-e-projetos";

export type CaseCategoryKey =
  | "condominios"
  | "hospitais"
  | "industria"
  | "varejo";

export type CaseCategorySlug =
  | "cases-condominios"
  | "cases-hospitais"
  | "cases-industria"
  | "cases-varejo";

export type PartnerCategory =
  | "hospitais"
  | "shoppings"
  | "industria"
  | "bancos"
  | "varejo";

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}

export interface ImageAsset {
  src: string;
  alt: string;
  caption?: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface StateCoverage {
  code: "AL" | "CE" | "PB" | "PE" | "RN";
  name: string;
  isHeadquarters: boolean;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube";
  label: string;
  handle: string;
  /** Mantido nulo até o destino oficial ser aprovado pelo cliente. */
  url: string | null;
}

export interface SiteSettings {
  businessName: string;
  legalName: string;
  siteUrl: string;
  locale: "pt-BR";
  tagline: string;
  description: string;
  email: string;
  phones: Array<{
    label: string;
    value: string;
    href: string;
  }>;
  whatsapp: {
    label: string;
    number: string;
    baseUrl: string;
  };
  address: {
    street: string;
    number: string;
    city: string;
    state: "PE";
    country: "Brasil";
    formatted: string;
  };
  states: StateCoverage[];
  socialLinks: SocialLink[];
  defaultSeo: SeoData;
}

export interface HomePageContent {
  seo: SeoData;
  hero: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    image: ImageAsset;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  stats: Array<{
    value: string;
    label: string;
  }>;
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: ImageAsset;
  };
  team: {
    eyebrow: string;
    title: string;
    description: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cases: {
    eyebrow: string;
    title: string;
    description: string;
  };
  partners: {
    eyebrow: string;
    title: string;
    description: string;
  };
  coverage: {
    eyebrow: string;
    title: string;
    description: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    cta: CtaLink;
  };
}

export interface TechnicalItem {
  title: string;
  description?: string;
  details?: string[];
}

export interface Service {
  slug: ServiceSlug;
  title: string;
  navTitle: string;
  eyebrow: string;
  summary: string;
  introduction: string[];
  technicalHeading: string;
  technicalItems: TechnicalItem[];
  closing: string;
  /** Nome do ícone no conjunto Iconify Lucide. */
  icon: `lucide:${string}`;
  heroImage: ImageAsset;
  gallery: ImageAsset[];
  whatsappMessage: string;
  relatedSlugs: ServiceSlug[];
  seo: SeoData;
}

export interface CaseStudy {
  slug: string;
  client: string;
  summary: string;
  activities: string[];
  images: ImageAsset[];
}

export interface CaseCategory {
  key: CaseCategoryKey;
  slug: CaseCategorySlug;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  result: string;
  icon: `lucide:${string}`;
  heroImage: ImageAsset;
  gallery: ImageAsset[];
  cases: CaseStudy[];
  whatsappMessage: string;
  seo: SeoData;
}

export interface PartnerCategoryDefinition {
  key: PartnerCategory;
  label: string;
  icon: `lucide:${string}`;
  order: number;
}

export interface Partner {
  slug: string;
  name: string;
  category: PartnerCategory;
  logo: ImageAsset;
  /** O site institucional não informa os destinos oficiais dos parceiros. */
  url: string | null;
  order: number;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: ImageAsset;
  order: number;
}

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  items?: string[];
}

export interface LegalPage {
  slug: "terms-and-conditions" | "privacy-policy";
  title: string;
  introduction: string;
  sections: LegalSection[];
  seo: SeoData;
}
