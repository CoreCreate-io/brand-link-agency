// /schemas/pages.ts
import { defineField, defineType } from 'sanity'

export const pages = defineType({
  name: 'pages',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'Privacy Policy', value: 'privacy' },
          { title: 'Terms & Conditions', value: 'terms' },
          { title: 'About Page', value: 'about' },
          { title: 'Services', value: 'services' }, // ✅ NEW
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // Homepage-specific fields
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
    }),
    defineField({
      name: 'heroButtonText',
      title: 'Hero Button Text',
      type: 'string',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
    }),
    defineField({
      name: 'heroButtonUrl',
      title: 'Hero Button URL',
      type: 'url',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
    }),

    // General content (for all except homepage)
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ parent }) => parent?.pageType === 'homepage' || parent?.pageType === 'services',
    }),

    // ✅ Services Section
    defineField({
      name: 'servicesList',
      title: 'Services List',
      type: 'array',
      hidden: ({ parent }) => parent?.pageType !== 'services',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Service Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Service Description',
              type: 'text',
              rows: 4, // Optional starting height
            }),
            defineField({
              name: 'icon',
              title: 'Lucide Icon Name',
              type: 'string',
              description: 'Enter the name of the Lucide icon (e.g. "users", "star", "camera")',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
})
