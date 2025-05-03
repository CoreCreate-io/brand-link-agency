// /schemas/pages.ts
import { defineField, defineType } from 'sanity'

export const pages = defineType({
  name: 'pages',
  title: 'Pages',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    // New groups for homepage organization
    {
      name: 'hero',
      title: 'Hero Section',
    },
    {
      name: 'logos',
      title: 'Logos Section',
    },
    {
      name: 'stats',
      title: 'Statistics & Selling Points',
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
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
      group: 'content',
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
          { title: 'Services', value: 'services' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    // Homepage Hero Section - Now grouped
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
      fields: [
        defineField({
          name: 'heroTitle',
          title: 'Hero Title',
          type: 'string',
        }),
        defineField({
          name: 'heroSubtitle',
          title: 'Hero Subtitle',
          type: 'string',
        }),
        defineField({
          name: 'heroButtonText',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'heroButtonUrl',
          title: 'Button URL',
          type: 'url',
        }),
        defineField({
          name: 'heroImage',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),

    // General content (for all except homepage)
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ parent }) => parent?.pageType === 'homepage' || parent?.pageType === 'services',
      group: 'content',
    }),

    // Homepage logos - Now grouped
    defineField({
      name: 'logosSection',
      title: 'Client Logos',
      type: 'object',
      group: 'logos',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
      fields: [
        defineField({
          name: 'topRowLogos',
          title: 'Top Row Logos (Scrolling Left)',
          type: 'array',
          validation: Rule => Rule.length(10).error('Exactly 10 logos are required for the top row'),
          of: [
            {
              type: 'image',
              options: {
                accept: 'image/png',
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  description: 'Alternative text for accessibility',
                }
              ]
            },
          ],
        }),
        defineField({
          name: 'bottomRowLogos',
          title: 'Bottom Row Logos (Scrolling Right)',
          type: 'array',
          validation: Rule => Rule.length(10).error('Exactly 10 logos are required for the bottom row'),
          of: [
            {
              type: 'image',
              options: {
                accept: 'image/png',
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  description: 'Alternative text for accessibility',
                }
              ]
            },
          ],
        }),
      ],
    }),

    // Selling Points section - Already grouped
    defineField({
      name: 'statsSection',
      title: 'Statistics Section',
      type: 'object',
      group: 'stats',
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Optional title for the statistics section',
        }),
        defineField({
          name: 'sellingPoints',
          title: 'Selling Points',
          description: 'Statistics displayed in the selling points section',
          type: 'array',
          validation: Rule => Rule.max(4).warning('Maximum 4 selling points recommended'),
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'number',
                  title: 'Number Value',
                  type: 'number',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'suffix',
                  title: 'Suffix',
                  description: 'Optional suffix like "+", "%", or "M+"',
                  type: 'string',
                }),
                defineField({
                  name: 'icon',
                  title: 'Lucide Icon Name',
                  type: 'string',
                  description: 'Icon name from Lucide icons (e.g., "Calendar", "Users", "Handshake", "BarChart")',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'number',
                  icon: 'icon',
                },
                prepare({ title, subtitle, icon }) {
                  return {
                    title: title || 'Untitled Stat',
                    subtitle: `${subtitle || '0'}${icon ? ` • Icon: ${icon}` : ''}`,
                  };
                },
              },
            },
          ],
        }),
      ],
    }),

    // Services Section
    defineField({
      name: 'servicesList',
      title: 'Services List',
      type: 'array',
      hidden: ({ parent }) => parent?.pageType !== 'services',
      group: 'content',
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
              rows: 4,
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

    // SEO Fields - Already grouped
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Default to page title if left empty',
          validation: Rule => Rule.max(60).warning('Should be under 60 characters')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160).warning('Should be under 160 characters')
        }),
        defineField({
          name: 'shareImage',
          title: 'Social Share Image',
          type: 'image',
          description: 'Ideal size: 1200x630px',
          options: {
            hotspot: true,
          }
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          }
        })
      ]
    })
  ]
})
