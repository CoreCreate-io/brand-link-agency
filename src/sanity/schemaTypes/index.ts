import { type SchemaTypeDefinition } from 'sanity'
import { pages } from './pages'
import influencer from './influencer'
import footer from './footer'
import menu from './menu'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    pages,
    influencer,
    footer,
    menu,
  ],
}
