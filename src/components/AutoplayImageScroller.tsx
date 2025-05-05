'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { homePageQuery } from '@/sanity/lib/queries';
import { motion, useInView } from 'framer-motion';

type ScrollerImage = {
  url: string;
  alt?: string;
  ratio?: '1/1' | '16/9' | '4/3' | '3/2' | '1/2';
};

const IMAGES_PER_ROW = 8;

const AutoplayImageScroller = () => {
  // Add these new states for visibility management
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalExpectedImages = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Keep your existing states
  const [topImages, setTopImages] = useState<ScrollerImage[]>([]);
  const [bottomImages, setBottomImages] = useState<ScrollerImage[]>([]);
  const [sectionTitle, setSectionTitle] = useState<string | null>(null);
  const [sectionBody, setSectionBody] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  
  const scrollerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  
  // Use Framer Motion's useInView hook with more precise settings
  const isScrollerInView = useInView(scrollerRef, { 
    once: true,
    amount: 0.1,
    margin: "0px 0px -200px 0px" // Trigger earlier
  });
  
  const isTitleInView = useInView(titleRef, { 
    once: true, 
    amount: 0.1,  // Match the image threshold for consistency
    margin: "0px 0px -100px 0px"  // Add margin to trigger earlier like images
  });
  
  const areImagesInView = useInView(imagesRef, { 
    once: true,
    amount: 0.1,
    margin: "0px 0px -100px 0px" // Trigger earlier
  });

  // Debug effect to track view states
  useEffect(() => {
    console.log("Title in view:", isTitleInView);
    console.log("Images in view:", areImagesInView);
  }, [isTitleInView, areImagesInView]);

  // Add this function to handle image loading
  const handleImageLoaded = () => {
    setLoadedCount(prev => {
      const newCount = prev + 1;
      // Consider loaded when at least 60% of images have loaded
      if (totalExpectedImages.current > 0 && newCount >= totalExpectedImages.current * 0.6) {
        setImagesLoaded(true);
      }
      return newCount;
    });
  };
  
  // Add this effect for initial visibility handling
  useEffect(() => {
    // Start with visibility hidden, but ensure content is rendered
    if (scrollerRef.current) {
      scrollerRef.current.style.visibility = 'hidden';
    }
  }, []);
  
  // Add this effect to handle intersection and force reflow
  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log("⚡ Scroller is intersecting viewport");
          
          // Force a reflow before showing the element
          if (scrollerRef.current) {
            // Force a reflow with this sequence
            scrollerRef.current.style.display = 'none';
            // Access offsetHeight to force reflow
            void scrollerRef.current.offsetHeight;
            scrollerRef.current.style.display = 'block';
            
            // Make it visible after reflow
            setTimeout(() => {
              if (scrollerRef.current) {
                scrollerRef.current.style.visibility = 'visible';
                setIsVisible(true);
              }
            }, 50);
          }
          
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    });
    
    observer.observe(scrollerRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(homePageQuery);
        
        if (!data?.showImageScroller) {
          console.log("Image scroller is disabled");
          setIsLoading(false);
          return;
        }
        
        // Force title and body to be set
        setSectionTitle(data?.imageScrollerTitle || "Our Featured Projects");
        setSectionBody(data?.imageScrollerBody || "Explore some of our recent work and creative projects.");
        
        // Count total expected images to help loading logic
        let imageCount = 0;
        if (data?.topRowImages?.length > 0) {
          imageCount += data.topRowImages.length * 3; // Triple because of the repeated images
          setTopImages(data.topRowImages);
          
          if (data?.bottomRowImages?.length > 0) {
            imageCount += data.bottomRowImages.length * 3;
            setBottomImages(data.bottomRowImages);
          }
        }
        
        totalExpectedImages.current = imageCount;
        console.log(`Need to load approximately ${imageCount} images`);
        
        // Mark data as fetched and loading complete
        setDataFetched(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching image scroller data:", error);
        setIsLoading(false);
        
        // Set fallback data to ensure something displays
        setSectionTitle("Our Featured Projects");
        setSectionBody("Explore some of our recent work and creative projects.");
      }
    };
    
    fetchData();
  }, []);

  // Don't render anything if disabled or no images and we're not loading
  if (!isLoading && topImages.length === 0) return null;

  const getAspectRatioClass = (ratio?: string) => {
    switch (ratio) {
      case '1/1': return 'aspect-square';
      case '16/9': return 'aspect-video';
      case '4/3': return 'aspect-[4/3]';
      case '3/2': return 'aspect-[3/2]';
      case '1/2': return 'aspect-[1/2]';
      default: return 'aspect-[3/2]';
    }
  };

  return (
    <div 
      ref={scrollerRef}
      className="relative w-full bg-background pt-16 overflow-hidden"
      // Use the visibility classes to ensure iOS renders it properly
      style={{ 
        willChange: 'transform, opacity'
      }}
    >
      {/* Title and description */}
      <div 
        ref={titleRef}
        className="max-w-4xl mx-auto text-center mb-12 px-6"
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 will-change-transform"
          initial={{ opacity: 0, y: 30, visibility: 'hidden' }}
          animate={isTitleInView && isVisible ? 
            { opacity: 1, y: 0, visibility: 'visible' } : 
            { opacity: 0, y: 30, visibility: 'hidden' }
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {sectionTitle || "Our Featured Projects"}
        </motion.h2>
        
        <motion.p 
          className="text-muted-foreground text-lg max-w-2xl mx-auto will-change-transform"
          initial={{ opacity: 0, y: 30, visibility: 'hidden' }}
          animate={isTitleInView && isVisible ? 
            { opacity: 1, y: 0, visibility: 'visible' } : 
            { opacity: 0, y: 30, visibility: 'hidden' }
          }
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {sectionBody || "Explore some of our recent work and creative projects."}
        </motion.p>
      </div>
      
      {/* Image scroller section */}
      <motion.div 
        ref={imagesRef}
        className="relative w-full space-y-0.5"
        initial={{ opacity: 0, y: 30, visibility: 'hidden' }}
        animate={areImagesInView && isVisible ? 
          { opacity: 1, y: 0, visibility: 'visible' } : 
          { opacity: 0, y: 30, visibility: 'hidden' }
        }
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      >
        {/* Gradient overlays */}


        {/* Top row - scrolling left */}
        {topImages.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            <div className="img-scroller">
              <div className="img-track img-left"> 
                {[...topImages, ...topImages, ...topImages].map((image, index) => (
                  <div 
                    key={`top-${index}`} 
                    className="img-item"
                  >
                    <div className={`relative w-full overflow-hidden rounded-lg border border-border/20 ${getAspectRatioClass(image.ratio)}`}>
                      <Image
                        src={image.url}
                        alt={image.alt || 'Image'}
                        fill
                        priority={true} // Force priority loading for all images
                        onLoadingComplete={handleImageLoaded}
                        sizes="(max-width: 768px) 300px, 400px"
                        className="object-cover transform-gpu hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Loading images...</p>
          </div>
        )}

        {/* Bottom row - scrolling right */}
        {bottomImages.length > 0 && (
          <div className="relative w-full overflow-hidden">
            <div className="img-scroller">
              <div className="img-track img-right">
                {[...bottomImages, ...bottomImages, ...bottomImages].map((image, index) => (
                  <div 
                    key={`bottom-${index}`} 
                    className="img-item"
                  >
                    <div className={`relative w-full overflow-hidden rounded-lg border border-border/20 ${getAspectRatioClass(image.ratio)}`}>
                      <Image
                        src={image.url}
                        alt={image.alt || 'Image'}
                        fill
                        priority={true} // Force priority loading for all images
                        onLoadingComplete={handleImageLoaded}
                        sizes="(max-width: 768px) 300px, 400px"
                        className="object-cover transform-gpu hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AutoplayImageScroller;