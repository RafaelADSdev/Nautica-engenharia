import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

if (!projectId) {
  throw new Error('Defina SANITY_STUDIO_PROJECT_ID para iniciar o Sanity Studio.')
}

const singletonTypes = new Set(['siteSettings', 'homePage'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Náutica Engenharia',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.listItem()
              .id('siteSettings')
              .title('Configurações do site')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .id('homePage')
              .title('Página inicial')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId() ?? ''),
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previousActions, context) =>
      singletonTypes.has(context.schemaType)
        ? previousActions.filter((action) => singletonActions.has(action.action ?? ''))
        : previousActions,
    newDocumentOptions: (previousOptions) =>
      previousOptions.filter((option) => !singletonTypes.has(option.templateId)),
  },
})
