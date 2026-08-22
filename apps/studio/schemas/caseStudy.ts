import {defineArrayMember, defineField, defineType} from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case',
  type: 'document',
  fields: [
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Condomínios', value: 'condominios'},
          {title: 'Hospitais', value: 'hospitais'},
          {title: 'Indústria', value: 'industria'},
          {title: 'Varejo', value: 'varejo'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Resumo',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(30).max(420),
    }),
    defineField({
      name: 'servicesPerformed',
      title: 'Serviços executados',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'service'}],
          options: {disableNew: true},
        }),
      ],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'result',
      title: 'Resultado',
      type: 'text',
      rows: 4,
      description: 'Não inclua métricas ou alegações que não possam ser comprovadas.',
      validation: (Rule) => Rule.required().min(20).max(700),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria',
      type: 'array',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Destacar na categoria',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordem de exibição',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(999),
    }),
  ],
  orderings: [
    {
      title: 'Categoria e ordem',
      name: 'categoryOrder',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'client',
      subtitle: 'category',
      media: 'gallery.0',
    },
  },
})
