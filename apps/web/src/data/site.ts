import type {
  CaseCategory,
  ImageAsset,
  LegalPage,
  Partner,
  PartnerCategoryDefinition,
  Service,
  ServiceSlug,
  SiteSettings,
  StateCoverage,
  TeamMember,
  HomePageContent,
} from "./types";
import { caseAssets, serviceAssets } from "./assets-manifest";

const WHATSAPP_BASE_URL = "https://wa.me/5581987762029";

export function getWhatsAppUrl(message: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

function serviceHero(slug: ServiceSlug, alt: string): ImageAsset {
  return {
    src: serviceAssets[slug].hero,
    alt,
  };
}

function serviceGallery(slug: ServiceSlug, alt: string, _count: number): ImageAsset[] {
  return serviceAssets[slug].gallery.map((src, index) => ({
    src,
    alt: `${alt} — registro ${index + 1}`,
  }));
}

function caseGallery(
  key: keyof typeof caseAssets,
  alt: string,
  _count = 4,
): ImageAsset[] {
  return caseAssets[key].gallery.map((src, index) => ({
    src,
    alt: `${alt} — registro ${index + 1}`,
  }));
}

export const states = [
  { code: "AL", name: "Alagoas", isHeadquarters: false },
  { code: "CE", name: "Ceará", isHeadquarters: false },
  { code: "PB", name: "Paraíba", isHeadquarters: false },
  { code: "PE", name: "Pernambuco", isHeadquarters: true },
  { code: "RN", name: "Rio Grande do Norte", isHeadquarters: false },
] satisfies StateCoverage[];

export const siteSettings = {
  businessName: "Náutica Engenharia",
  legalName: "Náutica Engenharia & Serviços",
  siteUrl: "https://www.nauticaengenharia.com",
  locale: "pt-BR",
  tagline: "Soluções em engenharia",
  description:
    "Empresa de Recife especializada em reformas, manutenção e infraestrutura para operações prediais e industriais no Nordeste.",
  email: "nautica@nauticaengenharia.com",
  phones: [
    {
      label: "Contato comercial 1",
      value: "(81) 98510-0105",
      href: "tel:+5581985100105",
    },
    {
      label: "Contato comercial 2",
      value: "(81) 98379-6337",
      href: "tel:+5581983796337",
    },
  ],
  whatsapp: {
    label: "WhatsApp",
    number: "(81) 98776-2029",
    baseUrl: WHATSAPP_BASE_URL,
  },
  address: {
    street: "Rua São Joaquim do Monte",
    number: "193",
    city: "Recife",
    state: "PE",
    country: "Brasil",
    formatted: "Rua São Joaquim do Monte, 193 — Recife, PE",
  },
  states,
  socialLinks: [
    {
      platform: "facebook",
      label: "Náutica Engenharia",
      handle: "Náutica Engenharia",
      url: null,
    },
    {
      platform: "instagram",
      label: "Instagram",
      handle: "@nauticaengenharia",
      url: null,
    },
    {
      platform: "youtube",
      label: "YouTube",
      handle: "/@NauticaEngenharia",
      url: null,
    },
  ],
  defaultSeo: {
    title: "Náutica Engenharia | Soluções em Engenharia no Nordeste",
    description:
      "Reformas, manutenção, infraestrutura e serviços especializados de engenharia em Pernambuco, Alagoas, Ceará, Paraíba e Rio Grande do Norte.",
    image: "/assets/home/hero.jpg",
  },
} satisfies SiteSettings;

const homeWhatsAppMessage =
  "Olá! Gostaria de conversar sobre uma necessidade de engenharia para a minha empresa.";

export const homePage = {
  seo: siteSettings.defaultSeo,
  hero: {
    eyebrow: "Engenharia sólida. Presença regional.",
    title: "Soluções em engenharia para operações que não podem parar.",
    highlightedText: "Construindo confiança há mais de 10 anos.",
    description:
      "Planejamento, execução e manutenção para estruturas prediais e industriais em cinco estados do Nordeste.",
    image: {
      src: "/assets/home/hero.jpg",
      alt: "Equipe da Náutica Engenharia acompanhando uma obra",
    },
    primaryCta: {
      label: "Falar com a Náutica",
      href: getWhatsAppUrl(homeWhatsAppMessage),
    },
    secondaryCta: {
      label: "Conhecer os serviços",
      href: "#servicos",
    },
  },
  stats: [
    { value: "+10 anos", label: "de atuação no mercado" },
    { value: "5 estados", label: "atendidos no Nordeste" },
    { value: "9 frentes", label: "de serviços especializados" },
  ],
  about: {
    eyebrow: "Quem somos",
    title: "Experiência técnica a serviço de estruturas mais seguras.",
    paragraphs: [
      "Com sede em Recife, a Náutica Engenharia atua há mais de 10 anos nos principais estados do Nordeste: Pernambuco, Alagoas, Rio Grande do Norte, Paraíba e Ceará.",
      "A empresa é especializada em reformas e manutenção no setor de infraestrutura, com atuação em portos, hospitais, varejo e outros segmentos estratégicos.",
    ],
    image: {
      src: serviceAssets["recuperacao-e-reforco-estrutural"].gallery[0],
      alt: "Profissional acompanhando uma frente de serviço da Náutica Engenharia",
    },
  },
  team: {
    eyebrow: "Responsáveis técnicos",
    title: "Engenharia conduzida por profissionais experientes.",
    description:
      "Conheça os profissionais apresentados pela Náutica Engenharia e suas áreas de especialização.",
  },
  services: {
    eyebrow: "Áreas de atuação",
    title: "Serviços para preservar, adequar e transformar estruturas.",
    description:
      "Nove frentes especializadas para demandas prediais, industriais, hospitalares e comerciais.",
  },
  cases: {
    eyebrow: "Cases de sucesso",
    title: "Execução comprovada em diferentes ambientes de operação.",
    description:
      "Conheça parte dos serviços realizados em condomínios, hospitais, indústrias e operações de varejo.",
  },
  partners: {
    eyebrow: "Confiança de grandes parceiros",
    title: "Empresas e instituições atendidas pela Náutica.",
    description:
      "Organizações dos setores hospitalar, comercial, industrial, bancário e varejista presentes na trajetória da empresa.",
  },
  coverage: {
    eyebrow: "Presença regional",
    title: "Atuação em cinco estados do Nordeste.",
    description:
      "Com sede em Pernambuco, a Náutica também atende Alagoas, Ceará, Paraíba e Rio Grande do Norte.",
  },
  finalCta: {
    eyebrow: "Vamos conversar?",
    title: "Sua demanda precisa de uma solução de engenharia bem executada.",
    description:
      "Conte o contexto da sua operação para a equipe da Náutica Engenharia.",
    cta: {
      label: "Chamar no WhatsApp",
      href: getWhatsAppUrl(homeWhatsAppMessage),
    },
  },
} satisfies HomePageContent;

export const teamMembers = [
  {
    slug: "pedro-paulo-seabra",
    name: "Pedro Paulo Seabra",
    role: "Engenheiro civil",
    bio: "Engenheiro civil, com formação em Marketing e especialização em Sistemas de Segurança.",
    photo: {
      src: "/assets/team/pedro-paulo-seabra.jpg",
      alt: "Pedro Paulo Seabra, engenheiro civil da Náutica Engenharia",
    },
    order: 1,
  },
  {
    slug: "edson-rodrigues",
    name: "Edson Rodrigues",
    role: "Engenheiro civil",
    bio: "Engenheiro civil, especialista em Patologia das Construções e com MBA em Planejamento e Controle de Obras.",
    photo: {
      src: "/assets/team/edson-rodrigues.jpg",
      alt: "Edson Rodrigues, engenheiro civil da Náutica Engenharia",
    },
    order: 2,
  },
] satisfies TeamMember[];

export const services = [
  {
    slug: "recuperacao-e-reforco-estrutural",
    title: "Recuperação e Reforço Estrutural",
    navTitle: "Recuperação e Reforço Estrutural",
    eyebrow: "Integridade estrutural",
    summary:
      "Soluções para recuperar e fortalecer estruturas comprometidas, com foco em segurança, durabilidade e desempenho.",
    introduction: [
      "A Náutica Engenharia executa serviços especializados de recuperação e reforço estrutural para estruturas de concreto que apresentam fissuras, deterioração ou necessidade de aumento de capacidade.",
      "Cada frente é conduzida por equipe especializada, com técnicas e materiais adequados às necessidades identificadas no projeto.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Tratamento de trincas e fissuras",
        description: "Tratamento dos pontos identificados na estrutura.",
      },
      {
        title: "Reforço de pilares, vigas e lajes",
        description: "Intervenções nos principais elementos estruturais.",
      },
      {
        title: "Recuperação de concreto deteriorado",
        description: "Recomposição de estruturas de concreto comprometidas.",
      },
      {
        title: "Fibras de carbono e materiais compostos",
        description:
          "Aplicação de materiais de reforço conforme a necessidade da estrutura.",
      },
      {
        title: "Impermeabilização e proteção estrutural",
        description:
          "Proteção complementar para preservar os elementos recuperados.",
      },
    ],
    closing:
      "Uma execução técnica cuidadosa contribui para restabelecer o desempenho e ampliar a durabilidade da estrutura.",
    icon: "lucide:landmark",
    heroImage: serviceHero(
      "recuperacao-e-reforco-estrutural",
      "Serviço de recuperação e reforço em uma estrutura de concreto",
    ),
    gallery: serviceGallery(
      "recuperacao-e-reforco-estrutural",
      "Recuperação e reforço estrutural executados pela Náutica Engenharia",
      5,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre recuperação ou reforço estrutural.",
    relatedSlugs: ["laudos-e-projetos", "obras", "impermeabilizacao"],
    seo: {
      title: "Recuperação e Reforço Estrutural | Náutica Engenharia",
      description:
        "Tratamento de fissuras, recuperação de concreto, reforço de pilares, vigas e lajes e aplicação de fibras de carbono.",
      image:
        "/assets/services/recuperacao-e-reforco-estrutural/hero.jpg",
    },
  },
  {
    slug: "impermeabilizacao",
    title: "Impermeabilização",
    navTitle: "Impermeabilização",
    eyebrow: "Proteção contra infiltrações",
    summary:
      "Sistemas de impermeabilização para proteger estruturas prediais e industriais e ampliar sua durabilidade.",
    introduction: [
      "A Náutica Engenharia realiza impermeabilização de lajes, reservatórios, áreas molhadas, piscinas, subsolos, fachadas e outras superfícies expostas à água e às intempéries.",
      "Os serviços combinam técnicas e materiais definidos conforme as condições e a finalidade de cada área.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Impermeabilização de lajes",
        details: ["Lajes expostas", "Lajes de cobertura"],
      },
      {
        title: "Impermeabilização de reservatórios",
        details: ["Tanques de água potável", "Cisternas"],
      },
      {
        title: "Impermeabilização de áreas molhadas",
        details: ["Cozinhas", "Áreas de serviço", "Banheiros"],
      },
      {
        title: "Impermeabilização de piscinas",
        details: ["Revestimento de piscinas", "Áreas de lazer"],
      },
      {
        title: "Impermeabilização de subsolos",
        description:
          "Proteção contra infiltrações em garagens e fundações.",
      },
      {
        title: "Impermeabilização de fachadas",
        description:
          "Tratamento de paredes externas contra infiltrações.",
      },
      {
        title: "Mantas asfálticas",
        details: [
          "Aplicação em coberturas",
          "Aplicação em áreas sujeitas às intempéries",
        ],
      },
      {
        title: "Sistemas de poliuretano e epóxi",
        description:
          "Soluções de alto desempenho para pisos e superfícies críticas.",
      },
    ],
    closing:
      "Técnicas adequadas e materiais de qualidade ajudam a preservar as estruturas contra umidade e infiltrações.",
    icon: "lucide:droplets",
    heroImage: serviceHero(
      "impermeabilizacao",
      "Aplicação de sistema de impermeabilização em uma estrutura",
    ),
    gallery: serviceGallery(
      "impermeabilizacao",
      "Serviço de impermeabilização executado pela Náutica Engenharia",
      4,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre um serviço de impermeabilização.",
    relatedSlugs: [
      "recuperacao-e-reforco-estrutural",
      "trabalhos-em-altura",
      "obras",
    ],
    seo: {
      title: "Impermeabilização Predial e Industrial | Náutica Engenharia",
      description:
        "Impermeabilização de lajes, reservatórios, fachadas, piscinas, subsolos e áreas molhadas para estruturas prediais e industriais.",
      image: "/assets/services/impermeabilizacao/hero.jpg",
    },
  },
  {
    slug: "trabalhos-em-altura",
    title: "Trabalhos em Altura",
    navTitle: "Trabalhos em Altura",
    eyebrow: "Intervenções em fachadas",
    summary:
      "Serviços especializados em altura para recuperação, proteção, limpeza e revitalização de fachadas.",
    introduction: [
      "A Náutica Engenharia executa trabalhos em altura em fachadas e estruturas que exigem sistemas específicos de acesso.",
      "A atuação reúne equipe especializada e materiais adequados a cada serviço, com atenção à execução segura e à durabilidade das intervenções.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Reforço e recuperação estrutural",
        description: "Soluções para estruturas comprometidas.",
      },
      {
        title: "Impermeabilização de fachadas",
        description: "Proteção contra infiltração e umidade.",
      },
      {
        title: "Lavagem e limpeza técnica",
        description: "Remoção de sujeira, fungos e poluição.",
      },
      {
        title: "Rejuntamento e recuperação de revestimentos",
        description: "Substituição de peças soltas ou danificadas.",
      },
      {
        title: "Tratamento de fissuras e trincas",
        description: "Prevenção de infiltrações e danos estruturais.",
      },
      {
        title: "Pintura e revitalização",
        description: "Aplicação de revestimentos e pinturas especiais.",
      },
      {
        title: "Instalação de sistemas de acesso",
        details: [
          "Andaimes",
          "Cadeiras suspensas",
          "Plataformas para execução dos serviços",
        ],
      },
    ],
    closing:
      "O planejamento de acesso e a execução especializada permitem atender fachadas e pontos elevados com precisão.",
    icon: "lucide:hard-hat",
    heroImage: serviceHero(
      "trabalhos-em-altura",
      "Profissional executando manutenção de fachada em altura",
    ),
    gallery: serviceGallery(
      "trabalhos-em-altura",
      "Trabalho em altura executado pela Náutica Engenharia",
      6,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre um serviço de trabalho em altura.",
    relatedSlugs: ["impermeabilizacao", "laudos-e-projetos", "obras"],
    seo: {
      title: "Trabalhos em Altura e Fachadas | Náutica Engenharia",
      description:
        "Recuperação, impermeabilização, limpeza, pintura e revitalização de fachadas com sistemas de acesso em altura.",
      image: "/assets/services/trabalhos-em-altura/hero.jpg",
    },
  },
  {
    slug: "obras",
    title: "Obras e Manutenção Industrial",
    navTitle: "Obras e Manutenção Industrial",
    eyebrow: "Infraestrutura civil",
    summary:
      "Obras, reparos e manutenção para conservar estruturas civis e apoiar a continuidade das operações.",
    introduction: [
      "A Náutica Engenharia realiza obras e serviços de manutenção civil industrial voltados à conservação, recuperação e adequação de estruturas.",
      "A equipe atende intervenções em concreto, pisos, revestimentos, alvenaria, drenagem e infraestrutura para instalação de equipamentos.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Reparos em estruturas de concreto",
        description: "Recuperação de pisos, vigas, pilares e bases de máquinas.",
      },
      {
        title: "Reforço estrutural",
        details: [
          "Aplicação de fibras de carbono",
          "Técnicas para aumento de capacidade estrutural",
        ],
      },
      {
        title: "Tratamento de fissuras e trincas",
        description:
          "Correção de danos para evitar comprometimentos estruturais.",
      },
      {
        title: "Revestimentos técnicos",
        description:
          "Aplicação de pisos industriais em epóxi, poliuretano e materiais de alta resistência.",
      },
      {
        title: "Impermeabilização de estruturas",
        description: "Proteção de pisos, tanques, lajes e áreas críticas.",
      },
      {
        title: "Reparos em alvenaria e revestimentos",
        description:
          "Manutenção de paredes, divisórias e acabamentos industriais.",
      },
      {
        title: "Adequação civil para instalações industriais",
        description:
          "Obras civis para instalação de equipamentos e infraestrutura fabril.",
      },
      {
        title: "Construção e manutenção de drenagens",
        description: "Redes de drenagem pluvial e contenção de água.",
      },
    ],
    closing:
      "Uma frente de manutenção bem coordenada preserva a infraestrutura e atende às exigências da operação.",
    icon: "lucide:factory",
    heroImage: serviceHero(
      "obras",
      "Equipe em uma frente de obras e manutenção industrial",
    ),
    gallery: serviceGallery(
      "obras",
      "Obra e manutenção industrial executadas pela Náutica Engenharia",
      4,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre uma obra ou manutenção industrial.",
    relatedSlugs: [
      "instalacao-predial-e-industrial",
      "recuperacao-e-reforco-estrutural",
      "estrutura-metalica",
    ],
    seo: {
      title: "Obras e Manutenção Industrial | Náutica Engenharia",
      description:
        "Reparos em concreto, reforço estrutural, pisos industriais, impermeabilização, alvenaria, adequações civis e drenagem.",
      image: "/assets/services/obras/hero.jpg",
    },
  },
  {
    slug: "instalacao-predial-e-industrial",
    title: "Instalações Prediais e Industriais",
    navTitle: "Instalações Prediais e Industriais",
    eyebrow: "Sistemas e adequações",
    summary:
      "Instalação, manutenção e adequação de sistemas prediais e industriais com execução técnica coordenada.",
    introduction: [
      "A Náutica Engenharia executa instalações e adequações para ambientes prediais e industriais, reunindo diferentes especialidades em uma mesma frente de serviço.",
      "O escopo inclui acabamentos técnicos, combate a incêndio, infraestrutura elétrica, redes hidráulicas e instalações especiais.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Drywall e forros",
        description: "Montagem de divisórias, forros e acabamentos técnicos.",
      },
      {
        title: "Sistema de combate a incêndio",
        description: "Instalação de sprinklers, hidrantes e alarmes.",
      },
      {
        title: "Instalações elétricas",
        description: "Infraestrutura elétrica de baixa e média tensão.",
      },
      {
        title: "Sistemas hidráulicos",
        description: "Redes de água, esgoto e drenagem.",
      },
      {
        title: "Outras instalações",
        details: ["Automação", "Ventilação", "Instalações especiais"],
      },
    ],
    closing:
      "A integração entre especialidades favorece uma execução eficiente e alinhada às exigências técnicas de cada ambiente.",
    icon: "lucide:building-2",
    heroImage: serviceHero(
      "instalacao-predial-e-industrial",
      "Profissional executando uma instalação predial ou industrial",
    ),
    gallery: serviceGallery(
      "instalacao-predial-e-industrial",
      "Instalação predial e industrial executada pela Náutica Engenharia",
      4,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre instalações prediais ou industriais.",
    relatedSlugs: ["obras", "sistemas-de-seguranca", "estrutura-metalica"],
    seo: {
      title: "Instalações Prediais e Industriais | Náutica Engenharia",
      description:
        "Drywall, forros, combate a incêndio, instalações elétricas, sistemas hidráulicos, automação, ventilação e instalações especiais.",
      image:
        "/assets/services/instalacao-predial-e-industrial/hero.jpg",
    },
  },
  {
    slug: "estrutura-metalica",
    title: "Estrutura Metálica",
    navTitle: "Estrutura Metálica",
    eyebrow: "Construção e manutenção",
    summary:
      "Construção, montagem, manutenção e reforço de estruturas metálicas para aplicações prediais e industriais.",
    introduction: [
      "A Náutica Engenharia oferece soluções para construir, manter e reforçar estruturas metálicas, considerando as necessidades de resistência, durabilidade e uso de cada instalação.",
      "Os serviços abrangem desde montagem e soldagem até inspeção, tratamento de corrosão, pintura e realocação de estruturas.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Montagem de estruturas metálicas",
        description:
          "Construção e instalação de suportes, galpões, coberturas e outros elementos metálicos.",
      },
      {
        title: "Reforço de estruturas metálicas",
        description:
          "Aumento de capacidade de carga e resistência com técnicas de reforço.",
      },
      {
        title: "Manutenção preventiva e corretiva",
        description:
          "Inspeção, reparo e substituição de componentes metálicos danificados.",
      },
      {
        title: "Soldagem e reparos em aço",
        description:
          "Soldagens e ajustes em vigas, pilares e suportes metálicos.",
      },
      {
        title: "Tratamento de corrosão",
        description:
          "Proteção contra ferrugem e desgaste com aplicação de revestimentos especiais.",
      },
      {
        title: "Pintura de estruturas metálicas",
        description: "Pintura anticorrosiva e acabamento estético.",
      },
      {
        title: "Análise e inspeção estrutural",
        description:
          "Verificação das condições das estruturas metálicas para avaliar sua segurança.",
      },
      {
        title: "Desmontagem e realocação",
        description:
          "Desmontagem segura e reestruturação dos elementos metálicos em novos locais.",
      },
    ],
    closing:
      "Da inspeção à montagem, o serviço é planejado para preservar o desempenho e a segurança da estrutura metálica.",
    icon: "lucide:warehouse",
    heroImage: serviceHero(
      "estrutura-metalica",
      "Estrutura metálica construída ou mantida pela Náutica Engenharia",
    ),
    gallery: serviceGallery(
      "estrutura-metalica",
      "Serviço em estrutura metálica executado pela Náutica Engenharia",
      6,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre construção ou manutenção de estrutura metálica.",
    relatedSlugs: ["obras", "laudos-e-projetos", "trabalhos-em-altura"],
    seo: {
      title: "Estruturas Metálicas | Náutica Engenharia",
      description:
        "Montagem, reforço, manutenção, soldagem, tratamento de corrosão, pintura, inspeção e realocação de estruturas metálicas.",
      image: "/assets/services/estrutura-metalica/hero.jpg",
    },
  },
  {
    slug: "sistemas-de-seguranca",
    title: "Sistemas de Segurança",
    navTitle: "Sistemas de Segurança",
    eyebrow: "Proteção eletrônica e perimetral",
    summary:
      "Instalação, manutenção e fornecimento de sistemas de segurança para proteção e monitoramento de ambientes.",
    introduction: [
      "A Náutica Engenharia trabalha com soluções de segurança eletrônica e proteção perimetral para diferentes tipos de instalações.",
      "O escopo publicado pela empresa contempla cercas elétricas, concertinas e sistemas de circuito fechado de televisão.",
    ],
    technicalHeading: "Principais sistemas",
    technicalItems: [
      {
        title: "Cerca elétrica",
        description: "Sistema com alarme, nobreak e conexão Wi-Fi.",
      },
      {
        title: "Cerca concertina",
        details: [
          "Modelos simples, dupla e flat",
          "Rede laminada",
          "Opções de 30 cm ou 45 cm",
        ],
      },
      {
        title: "CFTV — Circuito Fechado de Televisão",
        description: "Monitoramento com câmeras de alta definição.",
      },
    ],
    closing:
      "A solução é definida de acordo com o ambiente e a necessidade de proteção ou monitoramento apresentada pelo cliente.",
    icon: "lucide:cctv",
    heroImage: serviceHero(
      "sistemas-de-seguranca",
      "Câmera instalada em um sistema de segurança",
    ),
    gallery: serviceGallery(
      "sistemas-de-seguranca",
      "Sistema de segurança fornecido ou instalado pela Náutica Engenharia",
      6,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre instalação ou manutenção de sistemas de segurança.",
    relatedSlugs: [
      "instalacao-predial-e-industrial",
      "laudos-e-projetos",
      "terceirizacao-mao-de-obra",
    ],
    seo: {
      title: "Sistemas de Segurança | Náutica Engenharia",
      description:
        "Instalação, manutenção e fornecimento de cerca elétrica, concertina e CFTV para proteção e monitoramento de ambientes.",
      image: "/assets/services/sistemas-de-seguranca/hero.jpg",
    },
  },
  {
    slug: "terceirizacao-mao-de-obra",
    title: "Terceirização de Mão de Obra",
    navTitle: "Terceirização de Mão de Obra",
    eyebrow: "Equipes especializadas",
    summary:
      "Profissionais para demandas de manutenção, reforma, construção, limpeza técnica, conservação e apoio operacional.",
    introduction: [
      "A Náutica Engenharia disponibiliza profissionais para demandas dos setores industrial, varejista, hospitalar e predial.",
      "A equipe apresentada pela empresa inclui técnicos, engenheiros civis e engenheiros de segurança, com atuação alinhada às necessidades de cada cliente.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Manutenção predial e industrial",
        description:
          "Técnicos especializados para serviços corretivos e preventivos.",
      },
      {
        title: "Serviços de reforma e construção",
        description:
          "Mão de obra para alvenaria, pintura, revestimentos e acabamentos.",
      },
      {
        title: "Limpeza técnica e conservação",
        description:
          "Profissionais treinados para áreas operacionais, industriais e comerciais.",
      },
      {
        title: "Segurança e apoio operacional",
        description:
          "Engenheiros e técnicos de segurança do trabalho para supervisão e orientação das atividades.",
      },
      {
        title: "Trabalhos por hora",
        description:
          "Serviços especializados para demandas pontuais de manutenção, reparos ou assistência técnica.",
      },
    ],
    closing:
      "A composição da equipe é ajustada ao contexto e às necessidades específicas de cada operação.",
    icon: "lucide:users-round",
    heroImage: serviceHero(
      "terceirizacao-mao-de-obra",
      "Profissionais reunidos para uma frente de serviço de engenharia",
    ),
    gallery: serviceGallery(
      "terceirizacao-mao-de-obra",
      "Equipe terceirizada pela Náutica Engenharia em atividade",
      4,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre terceirização de mão de obra especializada.",
    relatedSlugs: [
      "obras",
      "instalacao-predial-e-industrial",
      "trabalhos-em-altura",
    ],
    seo: {
      title: "Terceirização de Mão de Obra | Náutica Engenharia",
      description:
        "Profissionais para manutenção predial e industrial, reformas, limpeza técnica, conservação, segurança e apoio operacional.",
      image: "/assets/services/terceirizacao-mao-de-obra/hero.jpg",
    },
  },
  {
    slug: "laudos-e-projetos",
    title: "Laudos e Projetos",
    navTitle: "Laudos e Projetos",
    eyebrow: "Diagnóstico e planejamento técnico",
    summary:
      "Laudos técnicos e projetos voltados à segurança, à conformidade e à eficiência das edificações.",
    introduction: [
      "A Náutica Engenharia elabora laudos e projetos para avaliar condições existentes, orientar intervenções e planejar novas soluções.",
      "O escopo contempla estruturas, ancoragens, impermeabilização, arquitetura e segurança contra incêndio.",
    ],
    technicalHeading: "Principais serviços",
    technicalItems: [
      {
        title: "Laudos técnicos estruturais",
        description:
          "Avaliação das condições estruturais com recomendações corretivas.",
      },
      {
        title: "Laudos de ancoragem",
        description:
          "Certificação de sistemas para trabalhos em altura, conforme normas regulamentadoras.",
      },
      {
        title: "Laudos de impermeabilização",
        description:
          "Análise e diagnóstico de problemas relacionados a infiltrações.",
      },
      {
        title: "Projetos estruturais",
        description: "Dimensionamento e planejamento técnico de estruturas.",
      },
      {
        title: "Projetos arquitetônicos",
        description:
          "Soluções funcionais e estéticas para reformas e construções.",
      },
      {
        title: "Projetos de segurança contra incêndio",
        description: "Adequação de edificações às normas de segurança.",
      },
    ],
    closing:
      "O diagnóstico técnico e o planejamento documentado ajudam a orientar decisões e intervenções nas edificações.",
    icon: "lucide:file-check-2",
    heroImage: serviceHero(
      "laudos-e-projetos",
      "Profissional analisando documentos técnicos de engenharia",
    ),
    gallery: serviceGallery(
      "laudos-e-projetos",
      "Elaboração de laudo ou projeto pela Náutica Engenharia",
      3,
    ),
    whatsappMessage:
      "Olá! Gostaria de conversar sobre a elaboração de um laudo ou projeto.",
    relatedSlugs: [
      "recuperacao-e-reforco-estrutural",
      "trabalhos-em-altura",
      "instalacao-predial-e-industrial",
    ],
    seo: {
      title: "Laudos e Projetos de Engenharia | Náutica Engenharia",
      description:
        "Laudos estruturais, de ancoragem e impermeabilização, além de projetos estruturais, arquitetônicos e de segurança contra incêndio.",
      image: "/assets/services/laudos-e-projetos/hero.jpg",
    },
  },
] satisfies Service[];

export const serviceBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service]),
) as unknown as Record<ServiceSlug, Service>;

export const caseCategories = [
  {
    key: "condominios",
    slug: "cases-condominios",
    title: "Cases de sucesso em condomínios",
    shortTitle: "Condomínios",
    eyebrow: "Cases de sucesso",
    description:
      "Obras voltadas à segurança, à modernização e à valorização dos espaços comuns de edifícios residenciais.",
    result:
      "Ambientes seguros, modernizados e visualmente valorizados para os moradores.",
    icon: "lucide:building",
    heroImage: {
      src: "/assets/cases/condominios/hero.jpg",
      alt: "Edifício residencial atendido pela Náutica Engenharia",
    },
    gallery: caseGallery(
      "condominios",
      "Obra realizada em condomínio pela Náutica Engenharia",
      4,
    ),
    cases: [
      {
        slug: "edificio-santa-clara",
        client: "Edifício Santa Clara",
        summary: "Modernização da guarita e do fechamento externo.",
        activities: [
          "Demolição de guarita e gradil para construção de uma guarita moderna e funcional",
          "Instalação de gradil em alumínio branco",
        ],
        images: [],
      },
      {
        slug: "edificio-flamingo",
        client: "Edifício Flamingo",
        summary:
          "Recuperação do reservatório elevado e revitalização da fachada.",
        activities: [
          "Recuperação estrutural de pilares, vigas e lajes do reservatório elevado",
          "Reboco e pintura da fachada",
        ],
        images: [],
      },
      {
        slug: "edificio-pery",
        client: "Edifício Pery",
        summary: "Revitalização das fachadas do edifício.",
        activities: ["Revitalização geral das fachadas"],
        images: [],
      },
      {
        slug: "edificio-cidade-de-frankfurt",
        client: "Edifício Cidade de Frankfurt",
        summary: "Renovação visual e proteção da fachada.",
        activities: ["Revitalização e pintura da fachada"],
        images: [],
      },
    ],
    whatsappMessage:
      "Olá! Gostaria de conversar sobre um serviço de engenharia para condomínio.",
    seo: {
      title: "Cases em Condomínios | Náutica Engenharia",
      description:
        "Obras de recuperação estrutural, revitalização de fachadas e modernização de áreas comuns em condomínios.",
      image: "/assets/cases/condominios/hero.jpg",
    },
  },
  {
    key: "hospitais",
    slug: "cases-hospitais",
    title: "Cases de sucesso em hospitais",
    shortTitle: "Hospitais",
    eyebrow: "Cases de sucesso",
    description:
      "Serviços realizados em ambientes hospitalares, com atenção à segurança, à qualidade e aos prazos de execução.",
    result:
      "Ambientes hospitalares revitalizados, seguros e em conformidade com padrões técnicos rigorosos.",
    icon: "lucide:hospital",
    heroImage: {
      src: "/assets/cases/hospitais/hero.jpg",
      alt: "Edifício hospitalar atendido pela Náutica Engenharia",
    },
    gallery: caseGallery(
      "hospitais",
      "Serviço realizado em hospital pela Náutica Engenharia",
      4,
    ),
    cases: [
      {
        slug: "hospital-memorial-de-jaboatao",
        client: "Hospital Memorial de Jaboatão",
        summary: "Revitalização das fachadas e proteção da cobertura.",
        activities: [
          "Pintura completa das fachadas",
          "Impermeabilização da cobertura",
        ],
        images: [],
      },
      {
        slug: "real-hospital-portugues",
        client: "Real Hospital Português",
        summary:
          "Serviços de fachada, proteção perimetral, drywall e ancoragem.",
        activities: [
          "Revitalização das fachadas",
          "Instalação de cerca concertina",
          "Instalação de forros e paredes em drywall",
          "Instalação de sistema de ancoragem para trabalhos em altura",
          "Emissão de laudo de ancoragem",
        ],
        images: [],
      },
      {
        slug: "hospital-santa-joana",
        client: "Hospital Santa Joana",
        summary:
          "Intervenções em cobertura, estrutura metálica e ambiente de diagnóstico.",
        activities: [
          "Execução de coberturas com telhas de policarbonato",
          "Recuperação e reforço estrutural da estrutura metálica do chiller",
          "Reforma da sala de ultrassom",
        ],
        images: [],
      },
      {
        slug: "hospital-da-mulher-do-recife",
        client: "Hospital da Mulher do Recife",
        summary:
          "Limpeza técnica de reservatório por meio de trabalho em altura.",
        activities: [
          "Limpeza de reservatório metálico de água potável por alpinismo industrial",
        ],
        images: [],
      },
    ],
    whatsappMessage:
      "Olá! Gostaria de conversar sobre um serviço de engenharia para ambiente hospitalar.",
    seo: {
      title: "Cases em Hospitais | Náutica Engenharia",
      description:
        "Serviços de fachadas, impermeabilização, estruturas metálicas, drywall, ancoragem e reformas em ambientes hospitalares.",
      image: "/assets/cases/hospitais/hero.jpg",
    },
  },
  {
    key: "industria",
    slug: "cases-industria",
    title: "Cases de sucesso na indústria",
    shortTitle: "Indústria",
    eyebrow: "Cases de sucesso",
    description:
      "Obras executadas para Tecon Suape, Copa Energia e Petrobras em diferentes ambientes de operação industrial.",
    result:
      "Segurança, durabilidade e adequação estrutural para operações industriais críticas.",
    icon: "lucide:factory",
    heroImage: {
      src: "/assets/cases/industria/hero.jpg",
      alt: "Ambiente industrial atendido pela Náutica Engenharia",
    },
    gallery: caseGallery(
      "industria",
      "Serviço industrial executado pela Náutica Engenharia",
      4,
    ),
    cases: [
      {
        slug: "tecon-suape",
        client: "Tecon Suape",
        summary:
          "Obras civis, coberturas, reformas, limpeza técnica e estrutura metálica no complexo portuário.",
        activities: [
          "Construção de muro de concreto armado de 25 m no cais",
          "Troca de mais de 4.000 m² de cobertura metálica no CFS, no prédio administrativo, no prédio de RH, na cozinha e no refeitório",
          "Reforma completa, com troca de piso, forro, vidros, pintura, instalações elétricas e hidráulicas e granito nos prédios administrativo, de RH e da cozinha industrial",
          "Limpeza da casaria de navio cargueiro por alpinismo industrial",
          "Construção de estrutura metálica para Gate In",
          "Sondagem de terreno para implantação de asfalto",
        ],
        images: [],
      },
      {
        slug: "copa-energia",
        client: "Copa Energia",
        summary:
          "Recuperação estrutural, impermeabilização e obras civis em instalações de GLP e sistemas de água e incêndio.",
        activities: [
          "Recuperação estrutural em bases de tanques de GLP, em área classificada",
          "Recuperação de vigas, pilares e concreto armado",
          "Impermeabilização de reservatórios semienterrados e elevados, em espaço confinado",
          "Reforço estrutural do reservatório de combate a incêndio",
          "Construção de muro em alvenaria estrutural",
        ],
        images: [],
      },
      {
        slug: "petrobras",
        client: "Petrobras",
        summary: "Reforço da proteção perimetral de uma instalação.",
        activities: [
          "Instalação de cerca concertina em gradil de proteção e tela expandida",
        ],
        images: [],
      },
    ],
    whatsappMessage:
      "Olá! Gostaria de conversar sobre uma obra ou serviço de engenharia industrial.",
    seo: {
      title: "Cases na Indústria | Náutica Engenharia",
      description:
        "Obras civis, estruturas metálicas, recuperação estrutural, impermeabilização e proteção perimetral em operações industriais.",
      image: "/assets/cases/industria/hero.jpg",
    },
  },
  {
    key: "varejo",
    slug: "cases-varejo",
    title: "Cases de sucesso no varejo",
    shortTitle: "Varejo",
    eyebrow: "Cases de sucesso",
    description:
      "Projetos para redes varejistas e centros comerciais, abrangendo construção, retrofit, manutenção e acabamentos.",
    result:
      "Espaços comerciais funcionais, modernos e preparados para atender clientes e operações.",
    icon: "lucide:store",
    heroImage: {
      src: "/assets/cases/varejo/hero.jpg",
      alt: "Espaço comercial atendido pela Náutica Engenharia",
    },
    gallery: caseGallery(
      "varejo",
      "Serviço em operação de varejo executado pela Náutica Engenharia",
      4,
    ),
    cases: [
      {
        slug: "novo-atacarejo-escritorio-matriz",
        client: "Novo Atacarejo — Escritório Matriz",
        summary: "Acabamentos, pintura, comunicação de fachada e marcenaria.",
        activities: [
          "Instalação de piso e revestimentos cerâmicos",
          "Pintura geral",
          "Instalação de ACM",
          "Fabricação e instalação de portas de marcenaria",
          "Demarcação de piso",
        ],
        images: [],
      },
      {
        slug: "novo-atacarejo-cd-ipojuca",
        client: "Novo Atacarejo — CD Ipojuca",
        summary: "Obras de alvenaria, revestimentos, drywall e pintura.",
        activities: [
          "Construção de muro de alvenaria estrutural",
          "Revestimento cerâmico em pisos e paredes",
          "Instalação de paredes e forro em drywall",
          "Pintura geral interna e externa",
        ],
        images: [],
      },
      {
        slug: "farmacias-independente",
        client: "Rede de Farmácias Independente",
        summary: "Manutenção e retrofit de unidades da rede.",
        activities: [
          "Manutenção e retrofit em 68 lojas",
          "Troca de telhados, pinturas e mudanças de layout",
          "Troca de pisos e forros",
          "Recuperação de estruturas de concreto armado",
        ],
        images: [],
      },
      {
        slug: "plaza-shopping",
        client: "Plaza Shopping",
        summary: "Intervenção em piso e avaliação estrutural do forro.",
        activities: [
          "Instalação de piso vinílico",
          "Laudo de avaliação estrutural do forro",
        ],
        images: [],
      },
      {
        slug: "drogapharmacys",
        client: "Drogapharmacys",
        summary: "Construção e manutenção de lojas da rede.",
        activities: [
          "Construção da loja da unidade Paulista",
          "Manutenção da loja da unidade Avenida Recife",
        ],
        images: [],
      },
    ],
    whatsappMessage:
      "Olá! Gostaria de conversar sobre uma obra ou manutenção para uma operação de varejo.",
    seo: {
      title: "Cases no Varejo | Náutica Engenharia",
      description:
        "Obras, retrofit, manutenção, revestimentos, drywall, pintura e avaliações estruturais para redes e centros comerciais.",
      image: "/assets/cases/varejo/hero.jpg",
    },
  },
] satisfies CaseCategory[];

export const caseStudies = caseCategories.flatMap((category) =>
  category.cases.map((caseStudy) => ({
    ...caseStudy,
    category: category.key,
    categorySlug: category.slug,
  })),
);

export const partnerCategories = [
  { key: "hospitais", label: "Hospitais", icon: "lucide:hospital", order: 1 },
  { key: "shoppings", label: "Shoppings", icon: "lucide:shopping-bag", order: 2 },
  { key: "industria", label: "Indústria", icon: "lucide:factory", order: 3 },
  { key: "bancos", label: "Bancos", icon: "lucide:landmark", order: 4 },
  { key: "varejo", label: "Varejo", icon: "lucide:store", order: 5 },
] satisfies PartnerCategoryDefinition[];

function partnerLogo(slug: string, name: string): ImageAsset {
  return {
    src: `/assets/partners/${slug}.png`,
    alt: `Logotipo ${name}`,
  };
}

export const partners = [
  {
    slug: "real-hospital-portugues",
    name: "Real Hospital Português",
    category: "hospitais",
    logo: partnerLogo("real-hospital-portugues", "Real Hospital Português"),
    url: null,
    order: 1,
  },
  {
    slug: "santa-joana",
    name: "Hospital Santa Joana",
    category: "hospitais",
    logo: partnerLogo("santa-joana", "Hospital Santa Joana"),
    url: null,
    order: 2,
  },
  {
    slug: "imip",
    name: "IMIP",
    category: "hospitais",
    logo: partnerLogo("imip", "IMIP"),
    url: null,
    order: 3,
  },
  {
    slug: "unimed",
    name: "Unimed",
    category: "hospitais",
    logo: partnerLogo("unimed", "Unimed"),
    url: null,
    order: 4,
  },
  {
    slug: "hapvida",
    name: "Hapvida",
    category: "hospitais",
    logo: partnerLogo("hapvida", "Hapvida"),
    url: null,
    order: 5,
  },
  {
    slug: "plaza-shopping",
    name: "Plaza Shopping",
    category: "shoppings",
    logo: partnerLogo("plaza-shopping", "Plaza Shopping"),
    url: null,
    order: 6,
  },
  {
    slug: "shopping-igarassu",
    name: "Shopping Igarassu",
    category: "shoppings",
    logo: partnerLogo("shopping-igarassu", "Shopping Igarassu"),
    url: null,
    order: 7,
  },
  {
    slug: "roca",
    name: "Roca",
    category: "industria",
    logo: partnerLogo("roca", "Roca"),
    url: null,
    order: 8,
  },
  {
    slug: "tony",
    name: "Tony",
    category: "industria",
    logo: partnerLogo("tony", "Tony"),
    url: null,
    order: 9,
  },
  {
    slug: "copa-energia",
    name: "Copa Energia",
    category: "industria",
    logo: partnerLogo("copa-energia", "Copa Energia"),
    url: null,
    order: 10,
  },
  {
    slug: "alpha-plast",
    name: "Alpha Plast",
    category: "industria",
    logo: partnerLogo("alpha-plast", "Alpha Plast"),
    url: null,
    order: 11,
  },
  {
    slug: "ambipar",
    name: "Ambipar",
    category: "industria",
    logo: partnerLogo("ambipar", "Ambipar"),
    url: null,
    order: 12,
  },
  {
    slug: "tecon-suape",
    name: "Tecon Suape",
    category: "industria",
    logo: partnerLogo("tecon-suape", "Tecon Suape"),
    url: null,
    order: 13,
  },
  {
    slug: "bunge",
    name: "Bunge",
    category: "industria",
    logo: partnerLogo("bunge", "Bunge"),
    url: null,
    order: 14,
  },
  {
    slug: "itau",
    name: "Itaú",
    category: "bancos",
    logo: partnerLogo("itau", "Itaú"),
    url: null,
    order: 15,
  },
  {
    slug: "santander",
    name: "Santander",
    category: "bancos",
    logo: partnerLogo("santander", "Santander"),
    url: null,
    order: 16,
  },
  {
    slug: "banco-do-nordeste",
    name: "Banco do Nordeste",
    category: "bancos",
    logo: partnerLogo("banco-do-nordeste", "Banco do Nordeste"),
    url: null,
    order: 17,
  },
  {
    slug: "bradesco",
    name: "Bradesco",
    category: "bancos",
    logo: partnerLogo("bradesco", "Bradesco"),
    url: null,
    order: 18,
  },
  {
    slug: "pharmapele",
    name: "Pharmapele",
    category: "varejo",
    logo: partnerLogo("pharmapele", "Pharmapele"),
    url: null,
    order: 19,
  },
  {
    slug: "pague-menos",
    name: "Pague Menos",
    category: "varejo",
    logo: partnerLogo("pague-menos", "Pague Menos"),
    url: null,
    order: 20,
  },
  {
    slug: "millena",
    name: "Millena",
    category: "varejo",
    logo: partnerLogo("millena", "Millena"),
    url: null,
    order: 21,
  },
  {
    slug: "farmacias-independente",
    name: "Farmácias Independente",
    category: "varejo",
    logo: partnerLogo("farmacias-independente", "Farmácias Independente"),
    url: null,
    order: 22,
  },
  {
    slug: "novo-atacarejo",
    name: "Novo Atacarejo",
    category: "varejo",
    logo: partnerLogo("novo-atacarejo", "Novo Atacarejo"),
    url: null,
    order: 23,
  },
  {
    slug: "drogasil",
    name: "Drogasil",
    category: "varejo",
    logo: partnerLogo("drogasil", "Drogasil"),
    url: null,
    order: 24,
  },
  {
    slug: "imperio",
    name: "Império",
    category: "varejo",
    logo: partnerLogo("imperio", "Império"),
    url: null,
    order: 25,
  },
] satisfies Partner[];

export const legalPages = [
  {
    slug: "terms-and-conditions",
    title: "Termos e Condições",
    introduction:
      "Os Termos e Condições de Uso estabelecem as regras e diretrizes para a utilização do site da Náutica Engenharia. Ao acessar e navegar neste site, você concorda com os termos aqui descritos.",
    sections: [
      {
        heading: "1. Aceitação dos Termos",
        paragraphs: [
          "Ao utilizar o site da Náutica Engenharia, o usuário declara ter lido, compreendido e aceitado integralmente os presentes Termos e Condições de Uso. Caso não concorde com algum dos termos, recomenda-se que não utilize o site.",
        ],
      },
      {
        heading: "2. Modificações dos Termos",
        paragraphs: [
          "A Náutica Engenharia reserva-se o direito de alterar, modificar ou atualizar estes Termos e Condições de Uso a qualquer momento, sem aviso prévio. É responsabilidade do usuário revisar periodicamente os termos para estar ciente de eventuais mudanças.",
        ],
      },
      {
        heading: "3. Uso do Site",
        paragraphs: [
          "O usuário compromete-se a utilizar o site da Náutica Engenharia de forma ética, respeitando as leis vigentes e os direitos de terceiros. É proibido:",
        ],
        items: [
          "Utilizar o site para fins ilegais ou não autorizados",
          "Interferir ou comprometer a integridade ou o desempenho do site",
          "Tentar obter acesso não autorizado a sistemas ou redes conectados ao site",
        ],
      },
      {
        heading: "4. Propriedade Intelectual",
        paragraphs: [
          "Todo o conteúdo presente no site, incluindo textos, imagens, logotipos e demais materiais, é de propriedade da Náutica Engenharia ou utilizado mediante autorização. É proibida a reprodução, distribuição ou qualquer outro uso do conteúdo sem prévia autorização por escrito da empresa.",
        ],
      },
      {
        heading: "5. Limitação de Responsabilidade",
        paragraphs: [
          "A Náutica Engenharia envida esforços para manter as informações do site precisas e atualizadas. No entanto, não garante a precisão, integridade ou atualidade dos conteúdos. A empresa não se responsabiliza por danos ou prejuízos decorrentes do uso ou da impossibilidade de uso do site.",
        ],
      },
      {
        heading: "6. Links para Terceiros",
        paragraphs: [
          "O site da Náutica Engenharia pode conter links para sites de terceiros. Esses links são fornecidos para conveniência do usuário, e a empresa não endossa nem se responsabiliza pelo conteúdo ou pelas práticas de privacidade desses sites.",
        ],
      },
      {
        heading: "7. Privacidade",
        paragraphs: [
          "A coleta e o uso de informações pessoais dos usuários estão sujeitos à Política de Privacidade disponível neste site.",
        ],
      },
      {
        heading: "8. Disposições Gerais",
        paragraphs: [
          "Caso alguma disposição destes Termos e Condições de Uso seja considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.",
        ],
      },
      {
        heading: "9. Lei Aplicável e Jurisdição",
        paragraphs: [
          "Estes Termos e Condições de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa ou controvérsia decorrente da utilização do site será submetida à jurisdição dos tribunais brasileiros.",
          "Para esclarecimentos ou dúvidas, entre em contato pelos canais disponíveis neste site.",
        ],
      },
    ],
    seo: {
      title: "Termos e Condições | Náutica Engenharia",
      description:
        "Consulte os Termos e Condições de Uso do site da Náutica Engenharia.",
      noIndex: true,
    },
  },
  {
    slug: "privacy-policy",
    title: "Política de Privacidade",
    introduction:
      "A Náutica Engenharia preza pela privacidade e segurança das informações de seus clientes e visitantes. Esta Política de Privacidade descreve como coletamos, utilizamos e protegemos dados pessoais em conformidade com a legislação brasileira, incluindo a Lei Geral de Proteção de Dados (LGPD).",
    sections: [
      {
        heading: "1. Coleta de Informações",
        paragraphs: [
          "Coletamos informações pessoais fornecidas voluntariamente por você ao interagir com nosso site, como nome, e-mail e telefone, por meio de formulários de contato ou cadastros para receber novidades. Além disso, podemos coletar dados automaticamente, como endereço IP, tipo de navegador e páginas acessadas, para aprimorar sua experiência de navegação.",
        ],
      },
      {
        heading: "2. Uso das Informações",
        paragraphs: ["As informações coletadas são utilizadas para:"],
        items: [
          "Responder a solicitações e fornecer informações sobre nossos serviços",
          "Melhorar a qualidade do site e dos serviços oferecidos",
          "Enviar comunicações promocionais, caso você tenha consentido previamente",
          "Cumprir obrigações legais e regulatórias",
        ],
      },
      {
        heading: "3. Compartilhamento de Informações",
        paragraphs: [
          "Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para:",
        ],
        items: [
          "Cumprir obrigações legais ou regulatórias",
          "Proteger nossos direitos, privacidade, segurança ou propriedade",
          "Fornecer serviços em parceria com empresas confiáveis, que também seguem esta Política de Privacidade",
        ],
      },
      {
        heading: "4. Segurança das Informações",
        paragraphs: [
          "Adotamos medidas técnicas e administrativas adequadas para proteger suas informações pessoais contra acessos não autorizados, uso indevido ou divulgação. Utilizamos tecnologias e práticas de segurança para preservar a integridade e a confidencialidade dos dados.",
        ],
      },
      {
        heading: "5. Seus Direitos",
        paragraphs: ["Você tem o direito de:"],
        items: [
          "Acessar, corrigir ou excluir suas informações pessoais",
          "Solicitar a portabilidade dos dados",
          "Revogar seu consentimento para o tratamento de dados",
          "Obter informações sobre o compartilhamento de seus dados",
        ],
      },
      {
        heading: "6. Alterações nesta Política",
        paragraphs: [
          "Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você reveja esta página para estar ciente de eventuais mudanças. O uso contínuo do site após alterações constitui sua concordância com os termos atualizados.",
        ],
      },
      {
        heading: "7. Contato",
        paragraphs: [
          "Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade e o tratamento de informações pessoais, entre em contato pelos canais disponibilizados neste site.",
          "Esta política foi elaborada em conformidade com as leis brasileiras aplicáveis e reflete o compromisso da Náutica Engenharia com a transparência e a proteção dos dados pessoais de clientes e visitantes.",
        ],
      },
    ],
    seo: {
      title: "Política de Privacidade | Náutica Engenharia",
      description:
        "Saiba como a Náutica Engenharia trata e protege os dados pessoais de clientes e visitantes.",
      noIndex: true,
    },
  },
] satisfies LegalPage[];
