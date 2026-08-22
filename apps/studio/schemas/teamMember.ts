import {defineArrayMember, defineField, defineType} from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Integrante da equipe',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'role',
      title: 'Cargo',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'education',
      title: 'Formação',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'bio',
      title: 'Biografia',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(40).max(800),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordem de exibição',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(99),
    }),
  ],
  orderings: [
    {
      title: 'Ordem do site',
      name: 'siteOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
})
