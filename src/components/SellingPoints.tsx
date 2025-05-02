"use client"

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface SellingPoint {
  number: number
  label: string
  suffix?: string
}

const sellingPoints: SellingPoint[] = [
  { number: 500, label: "Events Held", suffix: "+" },
  { number: 1000, label: "Creators", suffix: "+" },
  { number: 25, label: "Million Followers", suffix: "M+" },
  { number: 98, label: "Client Satisfaction", suffix: "%" },
]

function Counter({ number, suffix = "", shouldStart }: { number: number; suffix?: string; shouldStart: boolean }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    if (shouldStart) {
      animate(count, number, {
        duration: 2,
        ease: [0.215, 0.61, 0.355, 1],
        delay: 1.8 // Increased initial delay before counting starts
      })
    }
  }, [count, number, shouldStart])

  return (
    <motion.span className="tabular-nums inline-block">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}

function StatItem({ point, index }: { point: SellingPoint; index: number }) {
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
    margin: "-100px 0px"
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      // Increased initial delay before animation starts
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, 1000) // 1 second initial delay
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 1,
        delay: 1 + (index * 0.3), // 1 second base delay plus stagger
        ease: [0.215, 0.61, 0.355, 1]
      }}
      className="w-[45%] md:w-auto text-center"
    >
      <div className="text-4xl md:text-5xl font-bold mb-2">
        <Counter 
          number={point.number} 
          suffix={point.suffix} 
          shouldStart={hasAnimated}
        />
      </div>
      <div className="text-sm md:text-base text-muted-foreground">
        {point.label}
      </div>
    </motion.div>
  )
}

export default function SellingPoints() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="flex flex-wrap justify-between gap-y-12">
        {sellingPoints.map((point, index) => (
          <StatItem key={point.label} point={point} index={index} />
        ))}
      </div>
    </div>
  )
}