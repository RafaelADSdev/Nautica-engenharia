import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

if (!projectId) {
  throw new Error('Defina SANITY_STUDIO_PROJECT_ID para usar a CLI do Sanity.')
}

export default defineCliConfig({
  api: {projectId, dataset},
})
