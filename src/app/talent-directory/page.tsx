'use client'

import { client } from '@/sanity/lib/client'
import { allInfluencersQuery } from '@/sanity/lib/queries'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { TikTokIcon } from '@/components/ui/TikTokIcon'
import { Instagram, Youtube } from 'lucide-react'
import { motion, useAnimation, useInView } from 'framer-motion'
import Link from "next/link"

function formatFollowers(num: number) {
  if (num >= 1_000_000) {
    const value = num / 1_000_000;
    return (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)) + 'M';
  }
  if (num >= 1_000) {
    const value = num / 1_000;
    return (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)) + 'K';
  }
  return num.toString();
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

export default function TalentDirectory() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])

  useEffect(() => {
    async function fetchInfluencers() {
      const data = await client.fetch(allInfluencersQuery)

      const sortedData = data.sort((a: Influencer, b: Influencer) => 
        (b.instagramFollowers || 0) - (a.instagramFollowers || 0)
      );

      setInfluencers(sortedData)
    }

    fetchInfluencers()
  }, [])

  return (
<section className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-35 pb-12 md:pt-50 md:pb-20">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {influencers.map((inf, index) => (
      <AnimatedCard key={inf._id} influencer={inf} index={index} />
    ))}
  </div>
</section>
  )
}

function AnimatedCard({ influencer, index }: { influencer: Influencer, index: number }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: 'easeOut', delay: index * 0.1 }
      })
    }
  }, [isInView, controls, index])

  return (
    <Link href={`/talent-directory/${influencer.handle}`} className="block">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={controls}
        whileHover={{ scale: 1.03, boxShadow: '0px 8px 24px rgba(0,0,0,0.15)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative group overflow-hidden w-full h-auto rounded-2xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-700 p-4 flex flex-col"
      >

        {/* Image */}
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
          <Image
            src={influencer.imageUrl}
            alt={influencer.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Username */}
        <div className="mt-4 text-black dark:text-white text-lg font-bold">
          @{influencer.handle}
        </div>

        {/* Followers */}
        <div className="mt-2 flex flex-wrap gap-2">
          {influencer.instagramFollowers !== undefined && influencer.instagramFollowers !== null && (
            <div className="flex items-center gap-1 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
              <Instagram className="w-4 h-4" />
              {formatFollowers(influencer.instagramFollowers)}
            </div>
          )}
          {influencer.tiktokFollowers !== undefined && influencer.tiktokFollowers !== null && (
            <div className="flex items-center gap-1 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
              <TikTokIcon className="w-4 h-4" />
              {formatFollowers(influencer.tiktokFollowers)}
            </div>
          )}
          {influencer.youtubeFollowers !== undefined && influencer.youtubeFollowers !== null && (
            <div className="flex items-center gap-1 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
              <Youtube className="w-4 h-4" />
              {formatFollowers(influencer.youtubeFollowers)}
            </div>
          )}
        </div>

        {/* Description */}
        {influencer.description && (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            {influencer.description}
          </p>
        )}
      </motion.div>
    </Link>
  )
}
