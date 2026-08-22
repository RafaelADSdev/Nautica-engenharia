import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identidade'},
    {name: 'contact', title: 'Contato'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Nome da empresa',
      type: 'string',
      group: 'identity',
      initialValue: 'Náutica Engenharia',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'legalName',
      title: 'Razão social',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Descrição institucional',
      type: 'text',
      rows: 4,
      group: 'identity',
      validation: (Rule) => Rule.required().min(40).max(500),
    }),
    defineField({
      name: 'logo',
      title: 'Logo principal',
      type: 'imageWithAlt',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp principal',
      type: 'string',
      group: 'contact',
      description: 'Somente DDI, DDD e número. Exemplo: 5581987762029.',
      initialValue: '5581987762029',
      validation: (Rule) =>
        Rule.required().custom((value) =>
          /^\d{12,13}$/.test(value ?? '') ? true : 'Use somente 12 ou 13 dígitos.',
        ),
    }),
    defineField({
      name: 'phones',
      title: 'Telefones secundários',
      type: 'array',
      group: 'contact',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phone',
          fields: [
            defineField({
              name: 'label',
              title: 'Identificação',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'number',
              title: 'Número exibido',
              type: 'string',
              validation: (Rule) => Rule.required().max(30),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'number'},
          },
        }),
      ],
    }),
    defineField({
      name: 'address',
      title: 'Endereço',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'street',
          title: 'Logradouro e número',
          type: 'string',
          validation: (Rule) => Rule.required().max(160),
        }),
        defineField({
          name: 'district',
          title: 'Bairro',
          type: 'string',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'city',
          title: 'Cidade',
          type: 'string',
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: 'state',
          title: 'Estado',
          type: 'string',
          validation: (Rule) => Rule.required().min(2).max(40),
        }),
        defineField({
          name: 'postalCode',
          title: 'CEP',
          type: 'string',
          validation: (Rule) => Rule.max(12),
        }),
      ],
    }),
    defineField({
      name: 'serviceStates',
      title: 'Estados atendidos',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'string'})],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociais',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Rede',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        }),
      ],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'SEO padrão',
      type: 'seo',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Configurações do site'}),
  },
})
