import {defineField, defineType} from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Imagem com acessibilidade',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      description: 'Descreva o conteúdo e a finalidade da imagem sem usar “imagem de”.',
      validation: (Rule) => Rule.required().min(3).max(160),
    }),
    defineField({
      name: 'caption',
      title: 'Legenda',
      type: 'string',
      validation: (Rule) => Rule.max(220),
    }),
  ],
})
