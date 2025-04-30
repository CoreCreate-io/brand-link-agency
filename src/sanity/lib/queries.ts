export const allInfluencersQuery = `
  *[_type == "influencer"]{
    _id,
    name,
    handle,
    description,
    "imageUrl": image.asset->url,
    instagramFollowers,
    tiktokFollowers,
    youtubeFollowers
  }
`

export const featuredInfluencersQuery = `
  *[_type == "influencer" && featured == true] | order(instagramFollowers desc) {
    _id,
    name,
    handle,
    description,
    "imageUrl": image.asset->url,
    instagramFollowers,
    tiktokFollowers,
    youtubeFollowers,
  }
`;


export const footerQuery = `
  *[_type == "footer"][0] {
    aboutText,
    socialLinks[] {
      platform,
      url
    }
  }
`

export const homePageQuery = `
*[_type == "pages" && slug.current == "homepage"][0]{
  heroTitle,
  heroSubtitle,
  heroButtonText,
  "heroImageUrl": heroImage.asset->url,
  homepageLogos[]{
    "url": asset->url,
    "alt": asset->altText
  }
}
`


export const pageContentQuery = `
  *[_type == "pages" && slug.current == $slug][0] {
    title,
    content
  }
`

// Fetch the Main Menu
export const menuQuery = `*[_type == "menu" && title == "Main Menu"][0] {
  title,
  links[] {
    label,
    href
  }
}`

// Fetch the Footer Menu
export const footerMenuQuery = `*[_type == "menu" && title == "Footer Menu"][0] {
  title,
  links[] {
    label,
    href
  }
}`


import { groq } from "next-sanity"

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "siteLogoUrl": siteLogo.asset->url
  }
`









