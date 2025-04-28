// schemas/menu.ts
export default {
    name: 'menu',
    title: 'Menus',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Menu Title',
        type: 'string',
      },
      {
        name: 'links',
        title: 'Links',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'label', title: 'Label', type: 'string' },
              { name: 'href', title: 'Link URL', type: 'string' },
            ],
          },
        ],
      },
    ],
  }
  