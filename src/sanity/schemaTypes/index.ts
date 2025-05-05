import { type SchemaTypeDefinition } from 'sanity'
import { pages } from './pages'
import influencer from './influencer'
import footer from './footer'
import menu from './menu'
import { event } from './events'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    pages,
    influencer,
    event,
    footer,
    menu,
  ],
}
