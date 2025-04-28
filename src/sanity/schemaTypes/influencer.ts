import { defineType, defineField } from 'sanity'
import NumberInputWithSeparators from '../components/NumberInputWithSeparators'
import CharacterCountInput from '../components/CharacterCountInput'

export default defineType({
  name: 'influencer',
  title: 'Influencer',
  type: 'document',
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
  ],
})
