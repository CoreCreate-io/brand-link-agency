"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, animate, useAnimate, MotionValue, useSpring } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { ChevronDown } from "lucide-react";

// Add these type interfaces at the top of your file, below imports
interface AnimatedWordProps {
  word: string;
  index: number;
  style: React.CSSProperties;
  scrollYProgress: MotionValue<number>;
  startRange: number;
  wordsPerScrollUnit: number;
}

interface ScrollAnimatedTextProps {
  text: string;
  style: React.CSSProperties;
  className: string;
  scrollYProgress: MotionValue<number>;
  startRange: number;
  endRange: number;
}

// Update your AnimatedWord component with TypeScript types
const AnimatedWord = ({ word, index, style, scrollYProgress, startRange, wordsPerScrollUnit }: AnimatedWordProps) => {
  const revealPoint = startRange + (index / wordsPerScrollUnit);
  const min = Math.max(0, revealPoint - 0.01);
  
  // Each instance of this component has its own hooks - which is fine
  const opacity = useTransform(scrollYProgress, [min, revealPoint], [0.4, 1]);
  const blur = useTransform(scrollYProgress, [min, revealPoint], ["3px", "0px"]);
  const scale = useTransform(scrollYProgress, [min, revealPoint], [-0.2, 1]);
  
  return (
    <React.Fragment>
      <motion.span
        style={{
          ...style,
          opacity,
          filter: `blur(${blur})`,
          scale,
          display: 'inline-block',
          transformOrigin: 'center',
        }}
        className="inline-block px-[0.5px]"
      >
        {word}
      </motion.span>
      {/* Add space between words */}
      <span> </span>
    </React.Fragment>
  );
};

// Update ScrollAnimatedText component to significantly slow down the reveal
const ScrollAnimatedText = ({ text, style, className, scrollYProgress, startRange, endRange }: ScrollAnimatedTextProps) => {
  // Split text into words
  const words = text.split(" ");
  const MAX_WORDS = 500;
  const safeWordCount = Math.min(words.length, MAX_WORDS);
  
  // SLOW DOWN: Change the multiplier from 1.5 to 0.75 (half the speed)
  const wordsPerScrollUnit = words.length / (endRange - startRange) * 0.75;
  
  return (
    <p className={className}>
      {words.slice(0, safeWordCount).map((word, i) => (
        <AnimatedWord
          key={i}
          word={word}
          index={i}
          style={style}
          scrollYProgress={scrollYProgress}
          startRange={startRange}
          wordsPerScrollUnit={wordsPerScrollUnit}
        />
      ))}
    </p>
  );
};

// New scroll indicator component with bounce animation - add proper type annotations
const ScrollIndicator = () => {
  // Animate fade out on scroll
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 150], [1, 0]);
  
  return (
    <motion.div 
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none"
      style={{ opacity }}
      initial={{ y: 0 }}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut" 
      }}
    >
      <p className="text-foreground/80 font-medium mb-2 text-sm">Scroll to reveal</p>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <ChevronDown className="w-6 h-6 text-foreground/80" />
      </motion.div>
    </motion.div>
  );
};

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aboutText, setAboutText] = useState<string>("");
  
  // Fetch content from Sanity on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Type cast or define a proper interface for aboutData
        const aboutData = await client.fetch(aboutPageQuery);
        
        if (aboutData?.content && aboutData.content.length > 0) {
          // Extract text from portable text blocks
          let extractedText = "";
          aboutData.content.forEach((block: any) => {
            if (block._type === 'block' && block.children) {
              block.children.forEach((child: any) => {
                if (child._type === 'span' && child.text) {
                  extractedText += child.text + " ";
                }
              });
            }
          });
          
          // Update state with the extracted text if not empty
          if (extractedText.trim()) {
            setAboutText(extractedText.trim());
          } else {
            // If no content is found, set a fallback message or empty string
            setAboutText("Loading content...");
          }
        } else {
          // Handle case when no content blocks exist
          setAboutText("Loading content...");
        }
      } catch (error) {
        console.error("Error fetching about page content:", error);
        // Set an error message or fallback text
        setAboutText("Unable to load content. Please try again later.");
      }
    };
    
    fetchContent();
  }, []);
  
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Create a smoothed version of the scroll progress
  const scrollYProgress = useSpring(rawScrollYProgress, { 
    stiffness: 80, 
    damping: 20, 
    restDelta: 0.001 
  });
  
  const [currentSection, setCurrentSection] = useState<number>(0);
  
  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const newSection = Math.floor(latest * 4);
    if (newSection !== currentSection) {
      setCurrentSection(newSection);
    }
  });

  // Simple text color transition - starts as gray, ends as white
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.2],
    [
      "var(--muted-foreground)", 
      "var(--foreground)"
    ]
  );

  // Add a transform for vertical movement as user scrolls
  const textPositionY = useTransform(
    scrollYProgress,
    [0, 0.3],
    ['0%', '-15%']  // Start at normal position, move up 15% as scrolling progresses
  );
  
  // Reduce the spacer height and adjust margins to fix the large gap
  
  return (
    <main ref={containerRef} className="bg-background text-foreground relative min-h-[250vh] md:min-h-[200vh]">
      {/* Fixed position section that stays in view while you scroll */}
      <section className="sticky top-50 md:top-40 h-[50vh] md:h-[80vh] flex flex-col justify-center md:items-center pt-100 pb-70 md:pb-0 md:pt-0 px-6 md:px-12 lg:px-24">
        {/* Wrap in motion.div to apply the vertical movement */}
        <motion.div 
          className="w-full"
          style={{ y: textPositionY }}
        >
          <div className="max-w-3xl mx-auto w-full">
            <ScrollAnimatedText 
              text={aboutText}
              style={{ color: "" }}
              className="text-xl md:text-3xl md:text-center text-left leading-relaxed pb-20 md:pb-0"
              scrollYProgress={scrollYProgress}
              startRange={0}
              endRange={0.35}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Add the scroll indicator */}
      <ScrollIndicator />
      
      {/* Adjust only the spacer height - reduce it significantly */}
      <section className="h-[30vh] mb-0"></section>
    </main>
  );
}