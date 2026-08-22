export type AssetGallery = {
  readonly hero: string;
  readonly gallery: readonly string[];
};

export const brandAssets = {
  logo: "/assets/brand/logo-nautica.png",
} as const;

export const homeAssets = {
  hero: "/assets/home/hero.jpg",
} as const;

export const teamAssets = {
  "pedro-paulo-seabra": "/assets/team/pedro-paulo-seabra.jpg",
  "edson-rodrigues": "/assets/team/edson-rodrigues.jpg",
} as const;

export const serviceAssets = {
  "recuperacao-e-reforco-estrutural": {
    hero: "/assets/services/recuperacao-e-reforco-estrutural/hero.jpg",
    gallery: [
      "/assets/services/recuperacao-e-reforco-estrutural/gallery-01.jpg",
      "/assets/services/recuperacao-e-reforco-estrutural/gallery-02.jpg",
      "/assets/services/recuperacao-e-reforco-estrutural/gallery-03.jpg",
      "/assets/services/recuperacao-e-reforco-estrutural/gallery-04.jpg",
      "/assets/services/recuperacao-e-reforco-estrutural/gallery-05.jpg",
    ],
  },
  impermeabilizacao: {
    hero: "/assets/services/impermeabilizacao/hero.jpg",
    gallery: [
      "/assets/services/impermeabilizacao/gallery-01.jpg",
      "/assets/services/impermeabilizacao/gallery-02.jpg",
      "/assets/services/impermeabilizacao/gallery-03.jpg",
      "/assets/services/impermeabilizacao/gallery-04.jpg",
    ],
  },
  "trabalhos-em-altura": {
    hero: "/assets/services/trabalhos-em-altura/hero.jpg",
    gallery: [
      "/assets/services/trabalhos-em-altura/gallery-01.jpg",
      "/assets/services/trabalhos-em-altura/gallery-02.jpg",
      "/assets/services/trabalhos-em-altura/gallery-03.jpg",
      "/assets/services/trabalhos-em-altura/gallery-04.jpg",
      "/assets/services/trabalhos-em-altura/gallery-05.jpg",
      "/assets/services/trabalhos-em-altura/gallery-06.jpg",
    ],
  },
  obras: {
    hero: "/assets/services/obras/hero.jpg",
    gallery: [
      "/assets/services/obras/gallery-01.jpg",
      "/assets/services/obras/gallery-02.jpg",
      "/assets/services/obras/gallery-03.jpg",
      "/assets/services/obras/gallery-04.jpg",
    ],
  },
  "instalacao-predial-e-industrial": {
    hero: "/assets/services/instalacao-predial-e-industrial/hero.jpg",
    gallery: [
      "/assets/services/instalacao-predial-e-industrial/gallery-01.jpg",
      "/assets/services/instalacao-predial-e-industrial/gallery-02.jpg",
      "/assets/services/instalacao-predial-e-industrial/gallery-03.jpg",
      "/assets/services/instalacao-predial-e-industrial/gallery-04.jpg",
    ],
  },
  "estrutura-metalica": {
    hero: "/assets/services/estrutura-metalica/hero.jpg",
    gallery: [
      "/assets/services/estrutura-metalica/gallery-01.jpg",
      "/assets/services/estrutura-metalica/gallery-02.jpg",
      "/assets/services/estrutura-metalica/gallery-03.jpg",
      "/assets/services/estrutura-metalica/gallery-04.jpg",
      "/assets/services/estrutura-metalica/gallery-05.jpg",
      "/assets/services/estrutura-metalica/gallery-06.jpg",
    ],
  },
  "sistemas-de-seguranca": {
    hero: "/assets/services/sistemas-de-seguranca/hero.jpg",
    gallery: [
      "/assets/services/sistemas-de-seguranca/gallery-01.jpg",
      "/assets/services/sistemas-de-seguranca/gallery-02.jpg",
      "/assets/services/sistemas-de-seguranca/gallery-03.jpg",
      "/assets/services/sistemas-de-seguranca/gallery-04.jpg",
      "/assets/services/sistemas-de-seguranca/gallery-05.jpg",
      "/assets/services/sistemas-de-seguranca/gallery-06.jpg",
    ],
  },
  "terceirizacao-mao-de-obra": {
    hero: "/assets/services/terceirizacao-mao-de-obra/hero.jpg",
    gallery: [
      "/assets/services/terceirizacao-mao-de-obra/gallery-01.jpg",
      "/assets/services/terceirizacao-mao-de-obra/gallery-02.jpg",
      "/assets/services/terceirizacao-mao-de-obra/gallery-03.jpg",
      "/assets/services/terceirizacao-mao-de-obra/gallery-04.jpg",
    ],
  },
  "laudos-e-projetos": {
    hero: "/assets/services/laudos-e-projetos/hero.jpg",
    gallery: [
      "/assets/services/laudos-e-projetos/gallery-01.jpg",
      "/assets/services/laudos-e-projetos/gallery-02.jpg",
      "/assets/services/laudos-e-projetos/gallery-03.jpg",
    ],
  },
} as const satisfies Record<string, AssetGallery>;

export const caseAssets = {
  condominios: {
    hero: "/assets/cases/condominios/hero.jpg",
    gallery: [
      "/assets/cases/condominios/gallery-01.jpg",
      "/assets/cases/condominios/gallery-02.jpg",
      "/assets/cases/condominios/gallery-03.jpg",
      "/assets/cases/condominios/gallery-04.jpg",
    ],
  },
  hospitais: {
    hero: "/assets/cases/hospitais/hero.jpg",
    gallery: [
      "/assets/cases/hospitais/gallery-01.jpg",
      "/assets/cases/hospitais/gallery-02.jpg",
      "/assets/cases/hospitais/gallery-03.jpg",
      "/assets/cases/hospitais/gallery-04.jpg",
    ],
  },
  industria: {
    hero: "/assets/cases/industria/hero.jpg",
    gallery: [
      "/assets/cases/industria/gallery-01.jpg",
      "/assets/cases/industria/gallery-02.jpg",
      "/assets/cases/industria/gallery-03.jpg",
      "/assets/cases/industria/gallery-04.jpg",
    ],
  },
  varejo: {
    hero: "/assets/cases/varejo/hero.jpg",
    gallery: [
      "/assets/cases/varejo/gallery-01.jpg",
      "/assets/cases/varejo/gallery-02.jpg",
      "/assets/cases/varejo/gallery-03.jpg",
      "/assets/cases/varejo/gallery-04.jpg",
    ],
  },
} as const satisfies Record<string, AssetGallery>;

export const partnerAssets = {
  "real-hospital-portugues": "/assets/partners/real-hospital-portugues.png",
  "santa-joana": "/assets/partners/santa-joana.png",
  imip: "/assets/partners/imip.png",
  unimed: "/assets/partners/unimed.png",
  hapvida: "/assets/partners/hapvida.png",
  "plaza-shopping": "/assets/partners/plaza-shopping.png",
  "shopping-igarassu": "/assets/partners/shopping-igarassu.png",
  roca: "/assets/partners/roca.png",
  tony: "/assets/partners/tony.png",
  "copa-energia": "/assets/partners/copa-energia.png",
  "alpha-plast": "/assets/partners/alpha-plast.png",
  ambipar: "/assets/partners/ambipar.png",
  "tecon-suape": "/assets/partners/tecon-suape.png",
  bunge: "/assets/partners/bunge.png",
  itau: "/assets/partners/itau.png",
  santander: "/assets/partners/santander.png",
  "banco-do-nordeste": "/assets/partners/banco-do-nordeste.png",
  bradesco: "/assets/partners/bradesco.png",
  pharmapele: "/assets/partners/pharmapele.png",
  "pague-menos": "/assets/partners/pague-menos.png",
  millena: "/assets/partners/millena.png",
  "farmacias-independente": "/assets/partners/farmacias-independente.png",
  "novo-atacarejo": "/assets/partners/novo-atacarejo.png",
  drogasil: "/assets/partners/drogasil.png",
  imperio: "/assets/partners/imperio.png",
} as const;

export type ServiceAssetSlug = keyof typeof serviceAssets;
export type CaseAssetCategory = keyof typeof caseAssets;
export type PartnerAssetSlug = keyof typeof partnerAssets;
