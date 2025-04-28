import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { TalentProfile } from '@/components/TalentProfile'

interface Params {
  params: {
    handle: string
  }
}

export default async function TalentPage({ params }: Params) {
  const { handle } = params

  const influencer = await client.fetch(
    groq`*[_type == "influencer" && handle == $handle][0]{
      name,
      handle,
      about,
      description,
      "imageUrl": image.asset->url,
      instagramFollowers,
      tiktokFollowers,
      youtubeFollowers
    }`,
    { handle }
  )
  

  if (!influencer || !influencer.handle) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        Influencer not found.
      </div>
    )
  }

  return <TalentProfile influencer={influencer} />
}
