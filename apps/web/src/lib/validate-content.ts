import type {
  CaseCategory,
  ImageAsset,
  LegalPage,
  Partner,
  Service,
  TeamMember,
} from "../data/types";

export interface SiteContentInventory {
  services: Service[];
  caseCategories: CaseCategory[];
  partners: Partner[];
  teamMembers: TeamMember[];
  legalPages: LegalPage[];
}

export class ContentValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Conteúdo inválido:\n- ${issues.join("\n- ")}`);
    this.name = "ContentValidationError";
    this.issues = issues;
  }
}

const EXPECTED_SERVICE_SLUGS = [
  "recuperacao-e-reforco-estrutural",
  "impermeabilizacao",
  "trabalhos-em-altura",
  "obras",
  "instalacao-predial-e-industrial",
  "estrutura-metalica",
  "sistemas-de-seguranca",
  "terceirizacao-mao-de-obra",
  "laudos-e-projetos",
] as const;

const EXPECTED_CASE_SLUGS = [
  "cases-condominios",
  "cases-hospitais",
  "cases-industria",
  "cases-varejo",
] as const;

function validateUnique(
  values: string[],
  label: string,
  issues: string[],
): void {
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index,
  );

  if (duplicates.length > 0) {
    issues.push(`${label}: slugs duplicados (${[...new Set(duplicates)].join(", ")}).`);
  }
}

function validateImage(
  image: ImageAsset | undefined,
  label: string,
  issues: string[],
): void {
  if (!image?.src?.trim()) {
    issues.push(`${label}: imagem sem URL/caminho.`);
  }

  if (!image?.alt?.trim()) {
    issues.push(`${label}: imagem sem texto alternativo.`);
  }
}

/**
 * Impede que um build publique um inventário editorial incompleto.
 * Lança uma exceção com todos os problemas encontrados de uma só vez.
 */
export function validateSiteContent(content: SiteContentInventory): void {
  const issues: string[] = [];
  const serviceSlugs = content.services.map(({slug}) => slug);
  const caseSlugs = content.caseCategories.map(({slug}) => slug);
  const partnerSlugs = content.partners.map(({slug}) => slug);
  const teamSlugs = content.teamMembers.map(({slug}) => slug);
  const legalSlugs = content.legalPages.map(({slug}) => slug);

  if (content.services.length !== 9) {
    issues.push(`Serviços: esperados 9, encontrados ${content.services.length}.`);
  }

  const missingServices = EXPECTED_SERVICE_SLUGS.filter(
    (slug) => !serviceSlugs.includes(slug),
  );
  if (missingServices.length > 0) {
    issues.push(`Serviços: rotas legadas ausentes (${missingServices.join(", ")}).`);
  }

  if (content.caseCategories.length !== 4) {
    issues.push(
      `Categorias de cases: esperadas 4, encontradas ${content.caseCategories.length}.`,
    );
  }

  const missingCases = EXPECTED_CASE_SLUGS.filter(
    (slug) => !caseSlugs.includes(slug),
  );
  if (missingCases.length > 0) {
    issues.push(`Cases: rotas legadas ausentes (${missingCases.join(", ")}).`);
  }

  if (content.partners.length !== 25) {
    issues.push(`Parceiros: esperados 25, encontrados ${content.partners.length}.`);
  }

  if (content.teamMembers.length !== 2) {
    issues.push(
      `Equipe: esperados 2 integrantes, encontrados ${content.teamMembers.length}.`,
    );
  }

  validateUnique(serviceSlugs, "Serviços", issues);
  validateUnique(caseSlugs, "Categorias de cases", issues);
  validateUnique(partnerSlugs, "Parceiros", issues);
  validateUnique(teamSlugs, "Equipe", issues);
  validateUnique(legalSlugs, "Páginas legais", issues);

  for (const service of content.services) {
    validateImage(service.heroImage, `Serviço ${service.slug} / hero`, issues);
    if (service.gallery.length === 0) {
      issues.push(`Serviço ${service.slug}: galeria vazia.`);
    }
    service.gallery.forEach((image, index) =>
      validateImage(image, `Serviço ${service.slug} / galeria ${index + 1}`, issues),
    );
  }

  const nestedCaseSlugs = content.caseCategories.flatMap(({cases}) =>
    cases.map(({slug}) => slug),
  );
  validateUnique(nestedCaseSlugs, "Cases por cliente", issues);

  for (const category of content.caseCategories) {
    validateImage(category.heroImage, `Cases ${category.key} / hero`, issues);
    if (category.gallery.length === 0) {
      issues.push(`Cases ${category.key}: galeria vazia.`);
    }
    category.gallery.forEach((image, index) =>
      validateImage(image, `Cases ${category.key} / galeria ${index + 1}`, issues),
    );
  }

  for (const partner of content.partners) {
    validateImage(partner.logo, `Parceiro ${partner.slug} / logo`, issues);
  }

  for (const member of content.teamMembers) {
    validateImage(member.photo, `Equipe ${member.slug} / foto`, issues);
  }

  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }
}

