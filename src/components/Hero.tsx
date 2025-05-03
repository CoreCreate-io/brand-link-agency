'use client'

import { client } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/lib/queries' // Use the central query
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Updated type to match the new schema structure
interface PageData {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroButtonUrl: string
  heroImageUrl: string // Changed from nested structure to direct URL
}

export default function Hero() {
  const [data, setData] = useState<PageData | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await client.fetch(homePageQuery)
      console.log("Hero data from Sanity:", res);
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

      {/* Hero Image - Updated to use heroImageUrl directly */}
      {data.heroImageUrl && (
        <div className="relative w-full md:w-[850px] aspect-[16/14] overflow-hidden bg-gray-200 dark:bg-gray-800 md:rounded-3xl rounded-none">
          <Image 
            src={data.heroImageUrl}
            alt="Hero Image"
            fill
            className="object-cover"
          />
        </div>
      )}
    </section>
  )
}
