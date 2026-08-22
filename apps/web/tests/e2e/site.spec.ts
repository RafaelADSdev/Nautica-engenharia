import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { caseCategories, legalPages, services } from '../../src/data/site';

const productionOrigin = 'https://www.nauticaengenharia.com';
const routes = [
  '/',
  ...services.map(({ slug }) => `/${slug}`),
  ...caseCategories.map(({ slug }) => `/${slug}`),
  ...legalPages.map(({ slug }) => `/${slug}`),
];

const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  expect(dimensions.document, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.viewport + 1,
  );
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.viewport + 1,
  );
}

test.describe('rotas preservadas e SEO', () => {
  for (const route of routes) {
    test(`${route} responde 200, possui h1 e canonical`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();

      const canonical = route === '/' ? `${productionOrigin}/` : `${productionOrigin}${route}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    });
  }
});

for (const viewport of viewports) {
  test.describe(`${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('navegação, filtros, CTA e ausência de overflow', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const menuButton = page.locator('[data-menu-button]');
      const navigation = page.locator('[data-nav]');

      if (viewport.width <= 1020) {
        await expect(menuButton).toBeVisible();
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        await expect(navigation).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      } else {
        await expect(navigation).toBeVisible();
      }

      const whatsappCta = page.locator('a[href^="https://wa.me/5581987762029"]:visible').first();
      await expect(whatsappCta).toBeVisible();

      const partnerCards = page.locator('[data-partner-card]');
      await expect(partnerCards).toHaveCount(25);
      await page.getByRole('button', { name: /^Varejo$/i }).click();

      const visibleCategories = await partnerCards.evaluateAll((cards) =>
        cards
          .filter((card) => !card.hasAttribute('hidden') && getComputedStyle(card).display !== 'none')
          .map((card) => card.getAttribute('data-category')),
      );

      expect(visibleCategories).toHaveLength(7);
      expect(new Set(visibleCategories)).toEqual(new Set(['varejo']));
      await expect(page.getByRole('button', { name: /^Varejo$/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await expectNoHorizontalOverflow(page);
    });

    test('lightbox opera por teclado e restaura o foco', async ({ page }) => {
      await page.goto('/recuperacao-e-reforco-estrutural', {
        waitUntil: 'domcontentloaded',
      });

      const trigger = page.locator('[data-lightbox-open]').first();
      await expect(trigger).toBeVisible();
      await trigger.click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      await expectNoHorizontalOverflow(page);
    });

    test('não possui violações axe sérias ou críticas nas telas representativas', async ({
      page,
    }) => {
      for (const route of [
        '/',
        '/recuperacao-e-reforco-estrutural',
        '/cases-industria',
      ]) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const seriousViolations = results.violations.filter(
          ({ impact }) => impact === 'serious' || impact === 'critical',
        );

        expect(
          seriousViolations,
          `${route}: ${JSON.stringify(seriousViolations, null, 2)}`,
        ).toEqual([]);
      }
    });
  });
}

test.describe('overflow em todas as URLs', () => {
  for (const viewport of viewports) {
    for (const route of routes) {
      test(`${viewport.width}px — ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await expectNoHorizontalOverflow(page);
      });
    }
  }
});
