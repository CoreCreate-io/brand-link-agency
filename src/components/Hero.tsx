'use client'

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Correct types (this is where the problem was!)
interface PageData {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroButtonUrl: string
  heroImage: {
    asset: {
      url: string
    }
  }
}

const homePageQuery = groq`
  *[_type == "pages" && pageType == "homepage"][0] {
    heroTitle,
    heroSubtitle,
    heroButtonText,
    heroButtonUrl,
    heroImage {
      asset -> {
        url
      }
    }
  }
`

export default function Hero() {
  const [data, setData] = useState<PageData | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await client.fetch(homePageQuery)
      setData(res)
    }
    fetchData()
  }, [])

  if (!data) return null

  return (
<section className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between gap-12">


{/* Text Content */}
<div className="w-full md:w-1/2 px-6">
  <h1 className="text-4xl md:text-4xl font-bold leading-tight">
    {data.heroTitle}
  </h1>
  <p className="text-muted-foreground mt-4 text-sm">
    {data.heroSubtitle}
  </p>

  {data.heroButtonUrl && data.heroButtonText && (
    <Button asChild className="mt-6 w-full md:w-auto p-7">
      <Link href={data.heroButtonUrl}>
        {data.heroButtonText}
      </Link>
    </Button>
  )}
</div>

{/* Hero Image */}
{data.heroImage?.asset?.url && (
  <div className="relative w-full md:w-[850px] aspect-[16/14] overflow-hidden bg-gray-200 dark:bg-gray-800 md:rounded-3xl rounded-none">
    <Image 
      src={data.heroImage.asset.url}
      alt="Hero Image"
      fill
      className="object-cover"
    />
  </div>
)}

</section>


  )
}
