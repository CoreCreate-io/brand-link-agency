'use client'

import { client } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/lib/queries'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion, useInView, useAnimation } from 'framer-motion'

interface PageData {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroButtonUrl: string
  heroImageUrl: string
}

export default function Hero() {
  const [data, setData] = useState<PageData | null>(null)
  const [hasRendered, setHasRendered] = useState(false)
  const [isAnimationReady, setIsAnimationReady] = useState(false)
  
  // Animation controls
  const textControls = useAnimation()
  const imageControls = useAnimation()
  
  // Ref for tracking visibility
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { 
    once: true, 
    amount: 0.2,
    margin: "0px 0px -200px 0px"
  })

  // Fetch data from Sanity - do this first
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await client.fetch(homePageQuery)
        setData(res)
        console.log('Hero data fetched successfully')
      } catch (error) {
        console.error("Error fetching hero data:", error)
      }
    }
    fetchData()
  }, [])

  // Set initial visibility AFTER data is loaded to ensure elements exist
  useEffect(() => {
    if (!data) return
    
    // Start with the content rendered but visually hidden
    if (sectionRef.current) {
      // Use opacity instead of visibility for smoother transitions
      sectionRef.current.style.opacity = '0'
      console.log('Initial opacity set to 0')
    }
    
    // After a short delay, mark as animation-ready
    const timer = setTimeout(() => {
      setHasRendered(true)
      setIsAnimationReady(true)
      console.log('Component marked as rendered and ready for animations')
    }, 300)
    
    return () => clearTimeout(timer)
  }, [data]) // Re-run this when data changes

  // Handle animations when section comes into view
  useEffect(() => {
    // Only proceed if rendered and ready for animations
    if (isInView && hasRendered && isAnimationReady && data) {
      console.log('Hero section is in view, triggering animations')
      
      // Make the section visible first
      if (sectionRef.current) {
        // Use opacity for smoother transitions than visibility
        sectionRef.current.style.opacity = '1'
        sectionRef.current.style.transition = 'opacity 0.3s ease-out'
      }
      
      // Then start the animations
      textControls.start({ opacity: 1, y: 0 })
      imageControls.start({ opacity: 1, y: 0 })
    }
  }, [isInView, hasRendered, isAnimationReady, textControls, imageControls, data])

  // If no data, render a placeholder with the same dimensions to prevent layout shift
  if (!data) {
    return (
      <section
        ref={sectionRef}
        className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between gap-12 h-[500px]"
      >
        {/* Empty placeholder with same height */}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between gap-12"
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Text Content - always rendered */}
      <motion.div
        className="w-full md:w-1/2 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={textControls}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-4xl font-bold leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {data.heroTitle || "Title"}
        </motion.h1>
        
        <motion.p
          className="text-muted-foreground mt-4 text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          {data.heroSubtitle || "Subtitle"}
        </motion.p>

        {(data.heroButtonUrl || data.heroButtonText) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={textControls}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Button asChild className="mt-6 w-full md:w-auto p-7">
              <Link href={data.heroButtonUrl || "#"}>
                {data.heroButtonText || "Learn More"}
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Hero Image - always rendered */}
      <motion.div
        className="relative w-full md:w-[850px] aspect-[16/14] overflow-hidden bg-gray-200 dark:bg-gray-800 md:rounded-3xl rounded-none"
        initial={{ opacity: 0, y: 30 }}
        animate={imageControls}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      >
        {data.heroImageUrl ? (
          <Image
            src={data.heroImageUrl}
            alt="Hero Image"
            fill
            priority={true}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </motion.div>
    </section>
  )
}