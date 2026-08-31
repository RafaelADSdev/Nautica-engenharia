import { describe, expect, it } from 'vitest';
import {
  caseCategories,
  getWhatsAppUrl,
  legalPages,
  partners,
  services,
  states,
  teamMembers,
} from './site';

const expectedServiceSlugs = [
  'recuperacao-e-reforco-estrutural',
  'impermeabilizacao',
  'trabalhos-em-altura',
  'obras',
  'instalacao-predial-e-industrial',
  'estrutura-metalica',
  'sistemas-de-seguranca',
  'terceirizacao-mao-de-obra',
  'laudos-e-projetos',
];

const expectedCaseSlugs = [
  'cases-condominios',
  'cases-hospitais',
  'cases-industria',
  'cases-varejo',
];

const expectedLegalSlugs = ['terms-and-conditions', 'privacy-policy'];

describe('inventário editorial', () => {
  it('mantém os nove serviços nas rotas legadas', () => {
    expect(services).toHaveLength(9);
    expect(services.map(({ slug }) => slug)).toEqual(expectedServiceSlugs);
  });

  it('mantém as quatro categorias de cases', () => {
    expect(caseCategories).toHaveLength(4);
    expect(caseCategories.map(({ slug }) => slug)).toEqual(expectedCaseSlugs);
  });

  it('mantém 25 parceiros e dois integrantes da equipe', () => {
    expect(partners).toHaveLength(25);
    expect(teamMembers).toHaveLength(2);
    expect(teamMembers[1]?.bio.toLocaleLowerCase('pt-BR')).toContain('técnico de segurança');
  });

  it('lista Pernambuco primeiro na cobertura regional', () => {
    expect(states[0]).toMatchObject({ code: 'PE', isHeadquarters: true });
  });

  it('mantém as duas páginas legais', () => {
    expect(legalPages.map(({ slug }) => slug)).toEqual(expectedLegalSlugs);
  });

  it('gera exatamente as 16 URLs indexadas sem duplicatas', () => {
    const routes = [
      '/',
      ...services.map(({ slug }) => `/${slug}`),
      ...caseCategories.map(({ slug }) => `/${slug}`),
      ...legalPages.map(({ slug }) => `/${slug}`),
    ];

    expect(routes).toHaveLength(16);
    expect(new Set(routes).size).toBe(16);
    expect(routes.every((route) => route === '/' || !route.endsWith('/'))).toBe(true);
  });

  it('gera links de WhatsApp no número comercial com mensagem codificada', () => {
    const url = new URL(getWhatsAppUrl('Olá! Teste de orçamento.'));

    expect(`${url.origin}${url.pathname}`).toBe('https://wa.me/5581987762029');
    expect(url.searchParams.get('text')).toBe('Olá! Teste de orçamento.');
  });
});
