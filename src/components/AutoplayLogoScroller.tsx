'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { homePageQuery } from '@/sanity/lib/queries';

type Logo = {
  url: string;
  alt?: string;
};


const LOGOS_PER_ROW = 10; // Updated from 12 to 10

const AutoplayLogoScroller = () => {
  const [topLogos, setTopLogos] = useState<Logo[]>([]);
  const [bottomLogos, setBottomLogos] = useState<Logo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(homePageQuery);
      
      // Verify we have exactly 10 logos for the top row
      if (data?.topRowLogos?.length === LOGOS_PER_ROW) {
        setTopLogos(data.topRowLogos);
        // Set bottom logos if they exist
        if (data?.bottomRowLogos?.length === LOGOS_PER_ROW) {
          setBottomLogos(data.bottomRowLogos);
        }
        setTimeout(() => setIsLoaded(true), 500);
      }
    };
    fetchData();
  }, []);

  // Only render when we have exactly 10 logos for the top row
  if (topLogos.length !== LOGOS_PER_ROW) return null;


  return (
    <div className="relative w-full bg-background py-10"> {/* Changed from bg-white dark:bg-black */}
      <div className={`relative overflow-hidden w-full space-y-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Gradient overlays - updated to use theme colors */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        {/* Top row - scrolling left */}
        <div className="relative w-full overflow-hidden">
          <div className="scroller-wrapper">
            <div className="scroller-track scroller-left translate-z-0">  {/* Added translate-z-0 */}
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
                    priority={index < LOGOS_PER_ROW}
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
                      priority={index < LOGOS_PER_ROW}
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