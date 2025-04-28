'use client'

import { PortableText } from '@portabletext/react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Instagram, Youtube } from "lucide-react"
import { TikTokIcon } from "@/components/ui/TikTokIcon"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { client } from "@/sanity/lib/client"
import { allInfluencersQuery } from "@/sanity/lib/queries"

interface Influencer {
  _id: string
  name: string
  handle: string
  about?: any
  description?: string
  imageUrl: string
  instagramFollowers: number
  tiktokFollowers: number
  youtubeFollowers: number
}

function formatFollowers(num: number) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K'
  return num.toString()
}

export function TalentProfile({ influencer }: { influencer: Influencer }) {
  const [otherInfluencers, setOtherInfluencers] = useState<Influencer[]>([])

  useEffect(() => {
    async function fetchOthers() {
      const data = await client.fetch(allInfluencersQuery)
      const filtered = data.filter((inf: Influencer) => inf.handle !== influencer.handle)
      setOtherInfluencers(filtered)
    }
    fetchOthers()
  }, [influencer.handle])

  return (
    <div className="pb-0">

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-30 md:pt-50 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Feature Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden"
        >
          <Image 
            src={influencer.imageUrl} 
            alt={influencer.name} 
            fill 
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Text Content */}
        <div className="flex flex-col">

          {/* Username and About */}
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">@{influencer.handle}</h1>

                    {/* Follower Stats */}
                    <div className="flex gap-1 mb-6 flex-wrap">
            {influencer.instagramFollowers > 0 && (
              <div className="flex items-center gap-2 bg-black dark:bg-white/10 text-white text-xs font-semibold rounded-full px-4 py-2">
                <Instagram className="w-4 h-4" />
                {formatFollowers(influencer.instagramFollowers)}
              </div>
            )}
            {influencer.tiktokFollowers > 0 && (
              <div className="flex items-center gap-2 bg-black dark:bg-white/10 text-white text-xs font-semibold rounded-full px-4 py-2">
                <TikTokIcon className="w-4 h-4" />
                {formatFollowers(influencer.tiktokFollowers)}
              </div>
            )}
            {influencer.youtubeFollowers > 0 && (
              <div className="flex items-center gap-2 bg-black dark:bg-white/10 text-white text-xs font-semibold rounded-full px-4 py-2">
                <Youtube className="w-4 h-4" />
                {formatFollowers(influencer.youtubeFollowers)}
              </div>
            )}
          </div>

          <div className="text-gray-700 dark:text-gray-400 text-base leading-relaxed">
            {influencer.about && <PortableText value={influencer.about} />}
          </div>
        </div>

      </section>

      {/* Other Influencers Section */}
      <section className="pt-16 w-full">

{/* Title inside container */}
<div className="max-w-7xl mx-auto px-4 md:px-6">
  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
    Other Influencers
  </h2>
</div>

{/* Desktop: grid, Mobile: scroll */}
<div className="max-w-7xl mx-auto px-4 md:px-6">
  <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
    {otherInfluencers.slice(0, 4).map((inf) => (
      <Link
        key={inf._id}
        href={`/talent-directory/${inf.handle}`}
        className="rounded-xl overflow-hidden bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-700"
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="relative w-full aspect-[4/5]">
            <Image src={inf.imageUrl} alt={inf.name} fill className="object-cover" />
          </div>
          <div className="p-3">
            <div className="text-xs font-bold text-black dark:text-white">@{inf.handle}</div>
            <div className="flex gap-2 mt-1 flex-wrap">
              {inf.instagramFollowers > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <Instagram className="w-3 h-3" />
                  {formatFollowers(inf.instagramFollowers)}
                </div>
              )}
              {inf.tiktokFollowers > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <TikTokIcon className="w-3 h-3" />
                  {formatFollowers(inf.tiktokFollowers)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    ))}
  </div>

  {/* Mobile Scroll Area */}
  <div className="md:hidden -mx-4">
    <ScrollArea className="pl-4 pr-4">
      <div className="flex gap-4 pb-4">
        {otherInfluencers.map((inf) => (
          <Link
            key={inf._id}
            href={`/talent-directory/${inf.handle}`}
            className="flex-none w-55 shrink-0"
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="rounded-xl overflow-hidden bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-700">
                <div className="relative w-full aspect-[4/5]">
                  <Image src={inf.imageUrl} alt={inf.name} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-xs font-bold text-black dark:text-white">@{inf.handle}</div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {inf.instagramFollowers > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <Instagram className="w-3 h-3" />
                        {formatFollowers(inf.instagramFollowers)}
                      </div>
                    )}
                    {inf.tiktokFollowers > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <TikTokIcon className="w-3 h-3" />
                        {formatFollowers(inf.tiktokFollowers)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>

</div>

</section>


    </div>
  )
}
