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
      name: 'imageScroller', // Add this new group
      title: 'Image Scroller',
    },
    {
      name: 'stats',
      title: 'Statistics & Selling Points',
    },
    {
      name: 'events',
      title: 'Events Page',
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
          { title: 'Events', value: 'events' }, // Add this option
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

    // Add this field right before the introText field in the Services Section
    
    // Services Section
    defineField({
      name: 'statementTitle',
      title: 'Statement Title',
      type: 'string',
      description: 'A brief statement or headline about your services',
      hidden: ({ parent }) => parent?.pageType !== 'services',
      group: 'content',
    }),
    defineField({
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      description: 'Introductory paragraph shown below the statement title',
      hidden: ({ parent }) => parent?.pageType !== 'services',
      group: 'content',
      rows: 4,
    }),
    // ... rest of your schema
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
            // Add this new image field
            defineField({
              name: 'image',
              title: 'Service Image',
              type: 'image',
              options: {
                hotspot: true, // Enables the hotspot tool for more precise cropping
              },
              description: 'Image to display for this service (ideal ratio 16:9)',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image'
            },
          },
        },
      ],
    }),

    // Events Section
    defineField({
      name: 'eventsTitle',
      title: 'Events Page Title',
      type: 'string',
      description: 'Main headline for the events page',
      hidden: ({ parent }) => parent?.pageType !== 'events',
      group: 'events',
    }),
    defineField({
      name: 'eventsDescription',
      title: 'Events Description',
      type: 'text',
      rows: 3,
      description: 'Description text that appears below the title',
      hidden: ({ parent }) => parent?.pageType !== 'events',
      group: 'events',
    }),
    defineField({
      name: 'eventsServices',
      title: 'Events Services',
      description: 'Services shown in the accordion section',
      type: 'array',
      hidden: ({ parent }) => parent?.pageType !== 'events',
      group: 'events',
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
              rows: 3,
            }),
          ],
        },
      ],
    }),

    // Image Scroller Section - Updated to use its own group
    defineField({
      name: 'imageScroller',
      title: 'Image Scroller',
      type: 'object',
      group: 'imageScroller', // Changed from 'hero' to 'imageScroller'
      hidden: ({ parent }) => parent?.pageType !== 'homepage',
      fields: [
        defineField({
          name: 'enabled',  // Added an enable/disable toggle
          title: 'Enable Image Scroller',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Heading for the image scroller section',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'body',
          title: 'Section Body',
          type: 'text',
          rows: 3,
          description: 'Optional descriptive text that appears below the title',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'topRowImages',
          title: 'Top Row Images (Scrolling Left)',
          type: 'array',
          hidden: ({ parent }) => !parent?.enabled,  // Only show when enabled
          validation: Rule => Rule.min(8).error('At least 8 images are required for the top row'),
          of: [
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  description: 'Alternative text for accessibility',
                },
                {
                  name: 'ratio',
                  title: 'Aspect Ratio',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Square (1:1)', value: '1/1' },
                      { title: 'Landscape (16:9)', value: '16/9' },
                      { title: 'Landscape (4:3)', value: '4/3' },
                      { title: 'Landscape (3:2)', value: '3/2' },
                      { title: 'Portrait (1:2)', value: '1/2' },
                    ],
                  },
                  initialValue: '3/2',
                }
              ]
            },
          ],
        }),
        defineField({
          name: 'bottomRowImages',
          title: 'Bottom Row Images (Scrolling Right)',
          type: 'array',
          hidden: ({ parent }) => !parent?.enabled,  // Only show when enabled
          validation: Rule => Rule.min(8).error('At least 8 images are required for the bottom row'),
          of: [
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  description: 'Alternative text for accessibility',
                },
                {
                  name: 'ratio',
                  title: 'Aspect Ratio',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Square (1:1)', value: '1/1' },
                      { title: 'Landscape (16:9)', value: '16/9' },
                      { title: 'Landscape (4:3)', value: '4/3' },
                      { title: 'Landscape (3:2)', value: '3/2' },
                      { title: 'Portrait (1:2)', value: '1/2' },
                    ],
                  },
                  initialValue: '3/2',
                }
              ]
            },
          ],
        }),
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
    }),
  ]
})
