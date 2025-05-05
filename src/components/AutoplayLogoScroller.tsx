'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { homePageQuery } from '@/sanity/lib/queries';

type Logo = {
  url: string;
  alt?: string;
};

const LOGOS_PER_ROW = 10;

const AutoplayLogoScroller = () => {
  const [topLogos, setTopLogos] = useState<Logo[]>([]);
  const [bottomLogos, setBottomLogos] = useState<Logo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedLogosCount, setLoadedLogosCount] = useState(0);
  const totalLogosToLoad = useRef(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Force refresh for iOS when the element becomes visible
  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Force a reflow when the scroller comes into view
          if (scrollerRef.current) {
            scrollerRef.current.style.display = 'none';
            // Force a reflow
            void scrollerRef.current.offsetHeight;
            scrollerRef.current.style.display = 'block';
          }
        }
      });
    }, {
      threshold: 0.1
    });
    
    observer.observe(scrollerRef.current);
    
    return () => {
      if (scrollerRef.current) observer.unobserve(scrollerRef.current);
    };
  }, [isLoaded]);

  // Handle logo loading
  const handleLogoLoad = () => {
    setLoadedLogosCount(prev => {
      const newCount = prev + 1;
      // Only mark as loaded once 75% of logos have loaded
      if (totalLogosToLoad.current > 0 && newCount >= totalLogosToLoad.current * 0.75) {
        setTimeout(() => setIsLoaded(true), 100);
      }
      return newCount;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(homePageQuery);
        
        // Check if we have logos
        if (data?.topRowLogos?.length === LOGOS_PER_ROW) {
          setTopLogos(data.topRowLogos);
          
          // Calculate how many logos we need to load
          let totalCount = LOGOS_PER_ROW * 2; // Just load first 2 sets for tracking purposes
          
          if (data?.bottomRowLogos?.length === LOGOS_PER_ROW) {
            setBottomLogos(data.bottomRowLogos);
            totalCount += LOGOS_PER_ROW * 2;
          }
          
          // Set total logos we expect to load
          totalLogosToLoad.current = totalCount;
        } else {
          console.log("Missing logo data or incorrect count:", {
            topRowCount: data?.topRowLogos?.length,
            bottomRowCount: data?.bottomRowLogos?.length,
          });
        }
      } catch (error) {
        console.error("Error fetching logo data:", error);
      }
    };
    
    fetchData();
  }, []);

  // Only render when we have exactly 10 logos for the top row
  if (topLogos.length !== LOGOS_PER_ROW) return null;

  return (
    <div 
      ref={scrollerRef}
      className="relative w-full bg-background py-10 overflow-hidden"
      style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
    >
      <div className="relative w-full space-y-10">
        {/* Gradient overlays - updated to use theme colors */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        {/* Top row - scrolling left */}
        <div className="relative w-full overflow-hidden">
          <div className="scroller-wrapper">
            <div className="scroller-track scroller-left"> 
              {[...topLogos, ...topLogos, ...topLogos, ...topLogos, ...topLogos].map((logo, index) => (
                <div 
                  key={`top-${index}`} 
                  className="scroller-item w-[120px] h-[50px] md:w-[180px] md:h-[80px] flex items-center justify-center px-4"
                >
                  <Image
                    src={logo.url}
                    alt={logo.alt || 'Logo'}
                    width={100}
                    height={50}
                    priority={true}
                    onLoadingComplete={handleLogoLoad}
                    className="w-[100px] h-[40px] md:w-[150px] md:h-[60px] object-contain dark:invert transform-gpu"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row - scrolling right (only if logos exist) */}
        {bottomLogos.length === LOGOS_PER_ROW && (
          <div className="relative w-full overflow-hidden">
            <div className="scroller-wrapper">
              <div className="scroller-track scroller-right">
                {[...bottomLogos, ...bottomLogos, ...bottomLogos, ...bottomLogos, ...bottomLogos].map((logo, index) => (
                  <div 
                    key={`bottom-${index}`} 
                    className="scroller-item w-[120px] h-[50px] md:w-[180px] md:h-[80px] flex items-center justify-center px-4"
                  >
                    <Image
                      src={logo.url}
                      alt={logo.alt || 'Logo'}
                      width={100}
                      height={40}
                      priority={true}
                      onLoadingComplete={handleLogoLoad}
                      className="w-[100px] h-[40px] md:w-[150px] md:h-[60px] object-contain dark:invert transform-gpu"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoplayLogoScroller;