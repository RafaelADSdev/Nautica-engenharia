// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import sanity from '@sanity/astro';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? 'production';

const integrations = [sitemap(), icon()];

if (projectId) {
  integrations.push(
    sanity({
      projectId,
      dataset,
      apiVersion: '2026-08-01',
      useCdn: false,
    }),
  );
}

export default defineConfig({
  site: 'https://www.nauticaengenharia.com',
  trailingSlash: 'never',
  integrations,
  build: {
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
