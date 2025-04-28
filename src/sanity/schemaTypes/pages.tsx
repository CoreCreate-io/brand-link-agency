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
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Hero fields (only show for Homepage)
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
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ parent }) => parent?.pageType === 'homepage',
    }),
  ],
})
