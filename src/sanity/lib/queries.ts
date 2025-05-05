export const allInfluencersQuery = `
  *[_type == "influencer"]{
    _id,
    name,
    handle,
    description,
    "imageUrl": image.asset->url,
    facebookFollowers,
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
    facebookFollowers,
    instagramFollowers,
    tiktokFollowers,
    youtubeFollowers,
  }
`;


// Update the footerQuery
export const footerQuery = `
*[_type == "footer"][0] {
  title,
  aboutText,
  socialLinksHeading,
  socialLinks {
    instagram,
    facebook,
    twitter,
    tiktok,
    linkedin,
    youtube
  },
  newsletterHeading,
  newsletterEnabled,
  copyrightText
}
`;

export const homePageQuery = `
*[_type == "pages" && pageType == "homepage"][0]{
  // Hero section - Flatten nested fields
  "heroTitle": heroSection.heroTitle,
  "heroSubtitle": heroSection.heroSubtitle,
  "heroButtonText": heroSection.heroButtonText,
  "heroButtonUrl": heroSection.heroButtonUrl,
  "heroImageUrl": heroSection.heroImage.asset->url,
  
  // Logos section - Keep as arrays for the scroller
  "topRowLogos": logosSection.topRowLogos[]{
    "url": asset->url,
    "alt": alt
  },
  "bottomRowLogos": logosSection.bottomRowLogos[]{
    "url": asset->url,
    "alt": alt
  },
  
  // Stats section
  "statsTitle": statsSection.sectionTitle,
  "sellingPoints": statsSection.sellingPoints[]{
    number,
    label,
    suffix,
    icon
  },
  
  // SEO
  seo {
    metaTitle,
    metaDescription,
    "shareImage": shareImage.asset->url,
    keywords
  },
  
  // Image Scroller
  "topRowImages": imageScroller.topRowImages[]{
    "url": asset->url,
    "alt": alt,
    ratio
  },
  "bottomRowImages": imageScroller.bottomRowImages[]{
    "url": asset->url,
    "alt": alt,
    ratio
  },
  "imageScrollerTitle": imageScroller.title,
"imageScrollerBody": imageScroller.body,
"showImageScroller": imageScroller.enabled
}
`


export const pageContentQuery = `
  *[_type == "pages" && slug.current == $slug][0] {
    title,
    content
  }
`

export const pageQuery = `*[_type == "pages" && slug.current == $slug][0]{
  title,
  pageType,
  content,
  "slug": slug.current,
  seo {
    metaTitle,
    metaDescription,
    "shareImage": shareImage.asset->{
      "url": url,
      "alt": alt
    },
    keywords
  },
  // ...other fields specific to page type
}`

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


// Add this to your existing file

// Services page query
export const servicesPageQuery = groq`
  *[_type == "pages" && pageType == "services"][0]{
    title,
    servicesList[] {
      title,
      description,
      icon,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    seo {
      metaTitle,
      metaDescription,
      "shareImage": shareImage.asset->url,
      keywords
    }
  }
`


// Query to fetch events page content
export const eventsPageQuery = groq`
  *[_type == "pages" && pageType == "events"][0] {
    eventsTitle,
    eventsDescription,
    eventsServices[] {
      title,
      description
    }
  }
`


// Query to fetch list of events
export const eventsListQuery = groq`
  *[_type == "event"] | order(featured desc, eventDate desc) {
    _id,
    title,
    slug,
    mainImage,
    eventDate,
    location,
    summary,
    description,
    quote,
    stats[] {
      value,
      label
    }
  }
`

// Query for featured events only
export const featuredEventsQuery = groq`
  *[_type == "event" && featured == true] | order(eventDate desc) {
    _id,
    title,
    slug,
    mainImage,
    eventDate,
    location,
    summary
  }
`





