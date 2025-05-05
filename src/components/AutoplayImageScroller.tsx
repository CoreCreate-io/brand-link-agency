'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { homePageQuery } from '@/sanity/lib/queries';

type ScrollerImage = {
  url: string;
  alt?: string;
  ratio?: '1/1' | '16/9' | '4/3' | '3/2' | '1/2';
};

const IMAGES_PER_ROW = 8;

const AutoplayImageScroller = () => {
  const [topImages, setTopImages] = useState<ScrollerImage[]>([]);
  const [bottomImages, setBottomImages] = useState<ScrollerImage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const totalImagesToLoad = useRef(0);
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

  // Handle image loading
  const handleImageLoad = () => {
    setLoadedImagesCount(prev => {
      const newCount = prev + 1;
      // Only mark as loaded once 75% of images have loaded
      if (totalImagesToLoad.current > 0 && newCount >= totalImagesToLoad.current * 0.75) {
        setTimeout(() => setIsLoaded(true), 100);
      }
      return newCount;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(homePageQuery);
        console.log("Image scroller data:", {
          enabled: data?.showImageScroller,
          topRowCount: data?.topRowImages?.length || 0,
          bottomRowCount: data?.bottomRowImages?.length || 0
        });
        
        if (!data?.showImageScroller) {
          console.log("Image scroller is disabled");
          return;
        }
        
        if (data?.topRowImages?.length >= IMAGES_PER_ROW) {
          // Calculate how many images we need to load (less in production)
          const topCount = Math.min(data.topRowImages.length, IMAGES_PER_ROW * 2);
          setTopImages(data.topRowImages);
          
          let bottomCount = 0;
          if (data?.bottomRowImages?.length >= IMAGES_PER_ROW) {
            bottomCount = Math.min(data.bottomRowImages.length, IMAGES_PER_ROW * 2);
            setBottomImages(data.bottomRowImages);
          }
          
          // Set total images we expect to load
          totalImagesToLoad.current = topCount + bottomCount;
        }
      } catch (error) {
        console.error("Error fetching image scroller data:", error);
      }
    };
    
    fetchData();
  }, []);

  // Don't render anything if disabled or no images
  if (topImages.length === 0) return null;

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
      className="relative w-full bg-background py-12 overflow-hidden"
      style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
    >
      <div className="relative w-full space-y-0">
        {/* Gradient overlays - Using global theme variables */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        {/* Top row - scrolling left */}
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
                      priority={true}
                      onLoadingComplete={handleImageLoad}
                      sizes="(max-width: 768px) 280px, 320px"
                      className="object-cover transform-gpu hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row - scrolling right (only if images exist) */}
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
                        priority={true}
                        onLoadingComplete={handleImageLoad}
                        sizes="(max-width: 768px) 280px, 320px"
                        className="object-cover transform-gpu hover:scale-105 transition-transform duration-700"
                      />
                    </div>
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

export default AutoplayImageScroller;