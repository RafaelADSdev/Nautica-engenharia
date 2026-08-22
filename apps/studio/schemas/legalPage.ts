import {defineArrayMember, defineField, defineType} from 'sanity'

const legalSlugs = ['terms-and-conditions', 'privacy-policy']
const isPublished = (documentId?: string) =>
  Boolean(documentId && !documentId.startsWith('drafts.'))

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Página legal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug legado',
      type: 'slug',
      description: 'A rota é histórica e não pode ser alterada depois da publicação.',
      options: {source: 'title', maxLength: 96},
      readOnly: ({document}) => isPublished(document?._id),
      validation: (Rule) =>
        Rule.required().custom((value) =>
          !value?.current || legalSlugs.includes(value.current)
            ? true
            : 'Use terms-and-conditions ou privacy-policy.',
        ),
    }),
    defineField({
      name: 'content',
      title: 'Conteúdo',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'imageWithAlt'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Data da última revisão',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
