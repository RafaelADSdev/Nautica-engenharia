import {defineField, defineType} from 'sanity'

export const partner = defineType({
  name: 'partner',
  title: 'Parceiro',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Hospitais', value: 'hospitais'},
          {title: 'Shoppings', value: 'shoppings'},
          {title: 'Indústria', value: 'industria'},
          {title: 'Bancos', value: 'bancos'},
          {title: 'Varejo', value: 'varejo'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo original',
      type: 'imageWithAlt',
      description: 'Não aplique recoloração; envie a marca aprovada pelo parceiro.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Site do parceiro',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
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
      title: 'name',
      subtitle: 'category',
      media: 'logo',
    },
  },
})
