import {defineArrayMember, defineField, defineType} from 'sanity'

const legacyServiceSlugs = [
  'recuperacao-e-reforco-estrutural',
  'impermeabilizacao',
  'trabalhos-em-altura',
  'obras',
  'instalacao-predial-e-industrial',
  'estrutura-metalica',
  'sistemas-de-seguranca',
  'terceirizacao-mao-de-obra',
  'laudos-e-projetos',
]

const isPublished = (documentId?: string) =>
  Boolean(documentId && !documentId.startsWith('drafts.'))

export const service = defineType({
  name: 'service',
  title: 'Serviço',
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
          !value?.current || legacyServiceSlugs.includes(value.current)
            ? true
            : 'Use uma das nove rotas legadas aprovadas.',
        ),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Resumo para cards',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(30).max(220),
    }),
    defineField({
      name: 'intro',
      title: 'Introdução comercial',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(60).max(700),
    }),
    defineField({
      name: 'content',
      title: 'Conteúdo técnico',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'imageWithAlt'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'technicalItems',
      title: 'Escopo e itens técnicos',
      type: 'array',
      of: [defineArrayMember({type: 'serviceItem'})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagem principal',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria',
      type: 'array',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'icon',
      title: 'Ícone',
      type: 'string',
      options: {
        list: [
          {title: 'Recuperação estrutural', value: 'structural-recovery'},
          {title: 'Impermeabilização', value: 'waterproofing'},
          {title: 'Trabalho em altura', value: 'work-at-height'},
          {title: 'Obras e manutenção', value: 'construction'},
          {title: 'Instalações', value: 'installations'},
          {title: 'Estrutura metálica', value: 'steel-structure'},
          {title: 'Sistemas de segurança', value: 'security-systems'},
          {title: 'Mão de obra', value: 'workforce'},
          {title: 'Laudos e projetos', value: 'reports-projects'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'proof',
      title: 'Prova social',
      type: 'text',
      rows: 3,
      description: 'Use somente informação já aprovada e comprovável.',
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: 'relatedServices',
      title: 'Serviços relacionados',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'service'}],
          options: {disableNew: true},
        }),
      ],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'Mensagem inicial do WhatsApp',
      type: 'string',
      validation: (Rule) => Rule.required().min(15).max(240),
    }),
    defineField({
      name: 'order',
      title: 'Ordem de exibição',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(99),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (Rule) => Rule.required(),
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
      title: 'title',
      subtitle: 'slug.current',
      media: 'heroImage',
    },
  },
})
