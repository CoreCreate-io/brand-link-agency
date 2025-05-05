import { defineType, defineField } from 'sanity';

// Individual Event Schema (for creating multiple event entries)
export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Displayed prominently at the bottom of the event image',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'The primary image shown in 5:4 aspect ratio',
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
      description: 'Displayed below the title with location',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Displayed below the title with event date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Main content shown in the card body (limited to 5 lines)',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Mark this event as featured to show it prominently',
      initialValue: false,
    }),
    defineField({
      name: 'stats',
      title: 'Event Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The statistic value (e.g., "700+", "9M+")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'The statistic label (e.g., "guests")',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description: 'Displayed as pills below the description',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      date: 'eventDate',
      location: 'location',
    },
    prepare({ title, media, date, location }) {
      return {
        title,
        subtitle: `${date ? new Date(date).toLocaleDateString() : 'No date'} ${location ? `· ${location}` : ''}`,
        media,
      };
    },
  },
});