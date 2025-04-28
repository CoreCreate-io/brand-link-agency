import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'aboutText',
      title: 'About Text',
      type: 'text',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineField({
          name: 'socialLink',
          title: 'Social Link',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform Name',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'Profile URL',
              type: 'url',
            }),
          ],
        }),
      ],
    }),
  ],
})
