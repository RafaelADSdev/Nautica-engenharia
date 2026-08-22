import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Título para buscadores',
      type: 'string',
      description: 'Idealmente entre 30 e 60 caracteres.',
      validation: (Rule) => Rule.required().min(20).max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Descrição para buscadores',
      type: 'text',
      rows: 3,
      description: 'Idealmente entre 70 e 155 caracteres.',
      validation: (Rule) => Rule.required().min(50).max(160),
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Imagem de compartilhamento',
      type: 'imageWithAlt',
      description: 'Use uma imagem horizontal, preferencialmente 1200 × 630 px.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Ocultar dos buscadores',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
