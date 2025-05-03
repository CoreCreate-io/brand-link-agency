"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"

interface StatProps {
  number: number
  label: string
  suffix?: string
  icon: string // Changed to string for icon name
}

// This function dynamically renders Lucide icons based on their name
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <Icon className={className} strokeWidth={1.5} />;
};

function Stat({ number, label, suffix = "", index, icon }: StatProps & { index: number }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Function to check if element is in viewport
    const checkVisibility = () => {
      if (!ref.current || hasAnimated) return
      
      const rect = ref.current.getBoundingClientRect()
      // Only consider visible when element is at least 100px into the viewport
      const isVisible = 
        rect.top >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.7
      
      if (isVisible && !hasAnimated) {
        animateValue()
        setHasAnimated(true)
      }
    }

    // Animation function
    const animateValue = () => {
      let startTimestamp: number | null = null
      const duration = 2000
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        setCount(Math.floor(progress * number))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }

    // Add scroll event listener
    window.addEventListener('scroll', checkVisibility)
    
    return () => window.removeEventListener('scroll', checkVisibility)
  }, [number, hasAnimated])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: hasAnimated ? 1 : 0, 
        y: hasAnimated ? 0 : 50 
      }}
      transition={{ 
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      className="text-left md:text-center flex flex-col items-start md:items-center"
    >
      <DynamicIcon name={icon} className="h-8 w-8 mb-4 text-primary" />
      <h3 className="text-4xl md:text-5xl font-bold mb-2">
        <span className="tabular-nums">{count}</span>{suffix}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground">
        {label}
      </p>
    </motion.div>
  )
}

// Default stats if no data is provided from CMS
const defaultStats: StatProps[] = [
  { 
    number: 500, 
    label: "Events Held", 
    suffix: "+", 
    icon: "Calendar" 
  },
  { 
    number: 25, 
    label: "Million Followers", 
    suffix: "M+", 
    icon: "Users" 
  },
  { 
    number: 350, 
    label: "Deals Closed", 
    suffix: "+", 
    icon: "Handshake" 
  },
  { 
    number: 98, 
    label: "Client Satisfaction", 
    suffix: "%", 
    icon: "BarChart" 
  }
]

interface SellingPointsProps {
  stats?: StatProps[];
  title?: string;
}

export default function SellingPoints({ stats = defaultStats, title }: SellingPointsProps) {
  // Add debugging to see what's coming in
  console.log('SellingPoints received:', { title, stats });
  
  return (
    <section className="w-full max-w-7xl mx-auto px-8 md:px-6 py-16 md:py-24">
      {/* Show the title if provided */}
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
      )}
      
      <div className="flex flex-col items-start md:flex-row md:flex-wrap md:justify-between gap-y-12">
        {stats.map((stat, index) => (
          <Stat key={`${stat.label}-${index}`} {...stat} index={index} />
        ))}
      </div>
    </section>
  );
}