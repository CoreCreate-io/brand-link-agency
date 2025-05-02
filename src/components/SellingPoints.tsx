"use client"

import { motion, useMotionValue, useTransform, animate, useScroll } from "framer-motion"
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

function Counter({ number, suffix = "", progress }: { number: number; suffix?: string; progress: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    const controls = animate(count, progress > 0.5 ? number : 0, {
      duration: 2,
      ease: "easeOut"
    })

    return controls.stop
  }, [count, number, progress])

  return (
    <motion.span className="tabular-nums inline-block">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}

function StatItem({ point, index }: { point: SellingPoint; index: number }) {
  const ref = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollProgress(latest)
    })
  }, [scrollYProgress])

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])

  return (
    <motion.div
      ref={ref}
      style={{ 
        opacity,
        y
      }}
      className="w-[45%] md:w-auto text-center"
    >
      <div className="text-4xl md:text-5xl font-bold mb-2">
        <Counter 
          number={point.number} 
          suffix={point.suffix} 
          progress={scrollProgress}
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
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="flex flex-wrap justify-between gap-y-12">
        {sellingPoints.map((point, index) => (
          <StatItem key={point.label} point={point} index={index} />
        ))}
      </div>
    </section>
  )
}