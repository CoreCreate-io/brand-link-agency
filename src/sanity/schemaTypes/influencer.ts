import { defineType, defineField } from 'sanity'
import NumberInputWithSeparators from '../components/NumberInputWithSeparators'
import CharacterCountInput from '../components/CharacterCountInput'

export default defineType({
  name: 'influencer',
  title: 'Influencer',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
    }
  ],
  fields: [
    defineField({
      name: 'featured',
      title: 'Featured Influencer',
      type: 'boolean',
      description: 'Check this if you want the influencer to appear on the homepage.',
    }),    
    defineField({
        name: 'image',
        title: 'Profile Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule) => Rule.required(),
      }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'string',
      description: 'Keep it short! Maximum 160 characters.',
      validation: (Rule) => Rule.max(160).warning('Must be 160 characters or less.'),
      components: {
        input: CharacterCountInput
      }
    }),
        // 🎯 About Section
        defineField({
            name: 'about',
            title: 'About',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Detailed bio or story section for the influencer',
          }),
    defineField({
      name: 'handle',
      title: 'Social Handle (@)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 🎯 Follower Counts
    defineField({
      name: 'facebookFollowers',
      title: 'Facebook Followers',
      type: 'number',
      components: {
        input: NumberInputWithSeparators,
      },
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'instagramFollowers',
      title: 'Instagram Followers',
      type: 'number',
      components: {
        input: NumberInputWithSeparators,
      },
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'tiktokFollowers',
      title: 'TikTok Followers',
      type: 'number',
      components: {
        input: NumberInputWithSeparators,
      },
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'youtubeFollowers',
      title: 'YouTube Subscribers',
      type: 'number',
      components: {
        input: NumberInputWithSeparators,
      },
      validation: (Rule) => Rule.min(0),
    }),

    // 🎯 Social Links
    defineField({
      name: 'facebookLink',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramLink',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktokLink',
      title: 'TikTok URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeLink',
      title: 'YouTube URL',
      type: 'url',
    }),

    // SEO Fields
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
          description: 'Default to influencer name if left empty',
          validation: Rule => Rule.max(60).warning('Should be under 60 characters')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Default to short description if left empty',
          rows: 3,
          validation: Rule => Rule.max(160).warning('Should be under 160 characters')
        }),
        defineField({
          name: 'shareImage',
          title: 'Social Share Image',
          type: 'image',
          description: 'Default to profile image if left empty. Ideal size: 1200x630px',
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'handle',
      media: 'image'
    }
  }
})
