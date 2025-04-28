'use client'

import { client } from '@/sanity/lib/client'
import { featuredInfluencersQuery } from '@/sanity/lib/queries'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { TikTokIcon } from '@/components/ui/TikTokIcon'
import { Instagram, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from "next/link"

function formatFollowers(num: number | null | undefined) {
  if (num == null) return '0'
  if (num >= 1_000_000) {
    const value = num / 1_000_000
    return (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)) + 'M'
  }
  if (num >= 1_000) {
    const value = num / 1_000
    return (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)) + 'K'
  }
  return num.toString()
}

// ✅ Helper to check >0 followers
function hasFollowers(count: number | null | undefined) {
  return count != null && count > 0
}

interface Influencer {
  _id: string
  name: string
  handle: string
  description: string
  imageUrl: string
  instagramFollowers: number
  tiktokFollowers: number
  youtubeFollowers: number
}

export default function InfluencerGrid() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])

  useEffect(() => {
    async function fetchInfluencers() {
      const data = await client.fetch(featuredInfluencersQuery)

      const sortedData = data.sort((a: Influencer, b: Influencer) => 
        (b.instagramFollowers || 0) - (a.instagramFollowers || 0)
      );

      const featured = sortedData.slice(0, 4)
      setInfluencers(featured)
    }

    fetchInfluencers()
  }, [])

  return (
<section className="w-full px-0 relative -mt-20 md:mt-0 md:pt-0">
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-0 min-h-[calc(45vh-4rem)] md:min-h-[calc(70vh-6rem)] md:-mt-20">
    {influencers.map((inf, index) => (
      <Link 
        key={inf._id} 
        href={`/talent-directory/${inf.handle}`} 
        className="relative group overflow-hidden w-full h-[45vh] md:h-full bg-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
          className="w-full h-full"
        >
          {/* Background Image */}
          <Image
            src={inf.imageUrl}
            alt={inf.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Bottom Fade Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Username + Stats container */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-2 z-10">
            
            {/* MOBILE Username */}
            <div className="block md:hidden">
              <div className="bg-white text-black text-xs font-semibold rounded-full px-3 py-1 w-max mb-2">
                @{inf.handle}
              </div>
              <div className="flex flex-wrap gap-2">
                {hasFollowers(inf.instagramFollowers) && (
                  <div className="flex items-center gap-1 bg-black/60 text-white text-xs font-medium rounded-full px-3 py-1">
                    <Instagram className="w-4 h-4" />
                    {formatFollowers(inf.instagramFollowers)}
                  </div>
                )}
                {hasFollowers(inf.tiktokFollowers) && (
                  <div className="flex items-center gap-1 bg-black/60 text-white text-xs font-medium rounded-full px-3 py-1">
                    <TikTokIcon className="w-4 h-4" />
                    {formatFollowers(inf.tiktokFollowers)}
                  </div>
                )}
                {hasFollowers(inf.youtubeFollowers) && (
                  <div className="flex items-center gap-1 bg-black/60 text-white text-xs font-medium rounded-full px-3 py-1">
                    <Youtube className="w-4 h-4" />
                    {formatFollowers(inf.youtubeFollowers)}
                  </div>
                )}
              </div>
            </div>

            {/* DESKTOP Username */}
            <div className="hidden md:block absolute bottom-2 left-0 transition-all duration-500 group-hover:translate-y-[-20px]">
              <div className="bg-white text-black text-xs font-semibold rounded-full px-3 py-1 w-max">
                @{inf.handle}
              </div>
            </div>

            {/* DESKTOP Follower stats (only show on hover) */}
            <div className="hidden md:flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
              {hasFollowers(inf.instagramFollowers) && (
                <div className="flex items-center gap-1 bg-black/60 text-white text-xs font-medium rounded-full px-3 py-1">
                  <Instagram className="w-4 h-4" />
                  {formatFollowers(inf.instagramFollowers)}
                </div>
              )}
              {hasFollowers(inf.tiktokFollowers) && (
                <div className="flex items-center gap-1 bg-black/60 text-white text-xs font-medium rounded-full px-3 py-1">
                  <TikTokIcon className="w-4 h-4" />
                  {formatFollowers(inf.tiktokFollowers)}
                </div>
              )}
              {hasFollowers(inf.youtubeFollowers) && (
                <div className="flex items-center gap-1 bg-black/60 text-white text-xs font-medium rounded-full px-3 py-1">
                  <Youtube className="w-4 h-4" />
                  {formatFollowers(inf.youtubeFollowers)}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </Link>
    ))}
  </div>
</section>
  )
}
