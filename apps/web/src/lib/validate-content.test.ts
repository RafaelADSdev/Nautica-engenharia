import {describe, expect, it} from "vitest";
import {
  caseCategories,
  legalPages,
  partners,
  services,
  teamMembers,
} from "../data/site";
import {
  ContentValidationError,
  validateSiteContent,
  type SiteContentInventory,
} from "./validate-content";

function inventory(): SiteContentInventory {
  return structuredClone({
    services,
    caseCategories,
    partners,
    teamMembers,
    legalPages,
  });
}

describe("validateSiteContent", () => {
  it("aceita o inventário migrado completo", () => {
    expect(() => validateSiteContent(inventory())).not.toThrow();
  });

  it("bloqueia a publicação quando uma rota legada desaparece", () => {
    const content = inventory();
    content.services = content.services.slice(1);

    expect(() => validateSiteContent(content)).toThrow(ContentValidationError);
    expect(() => validateSiteContent(content)).toThrow(/rotas legadas ausentes/);
  });

  it("bloqueia galerias sem URL ou texto alternativo", () => {
    const content = inventory();
    content.services[0].gallery[0] = {src: "", alt: ""};

    expect(() => validateSiteContent(content)).toThrow(/imagem sem URL\/caminho/);
    expect(() => validateSiteContent(content)).toThrow(/imagem sem texto alternativo/);
  });
});

