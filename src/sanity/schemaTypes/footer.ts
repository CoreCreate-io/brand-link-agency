import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  groups: [
    {
      name: 'about',
      title: 'About Section',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'newsletter',
      title: 'Newsletter',
    },
    {
      name: 'legal',
      title: 'Legal Information',
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Footer Title',
      description: 'Used for organization in the CMS only',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutText',
      title: 'About Text',
      type: 'text',
      group: 'about',
    }),
    defineField({
      name: 'socialLinksHeading',
      title: 'Social Links Heading',
      type: 'string',
      initialValue: 'Follow Us',
      group: 'social',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Leave empty to hide this platform',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Leave empty to hide this platform',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
          description: 'Leave empty to hide this platform',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
          description: 'Leave empty to hide this platform',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          description: 'Leave empty to hide this platform',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          description: 'Leave empty to hide this platform',
        }),
      ],
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter Heading',
      type: 'string',
      initialValue: 'Join Our List',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterEnabled',
      title: 'Enable Newsletter Signup',
      type: 'boolean',
      initialValue: true,
      group: 'newsletter',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      initialValue: '© {year} Brand Link Agency. All rights reserved.',
      description: 'Use {year} to insert the current year automatically',
      group: 'legal',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title || 'Footer',
      };
    },
  },
})