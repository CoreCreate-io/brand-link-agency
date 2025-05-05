"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { eventsPageQuery, eventsListQuery } from '@/sanity/lib/queries';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { formatDate } from '@/lib/utils';
import imageUrlBuilder from '@sanity/image-url';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext as PaginationNextComponent,
  PaginationPrevious as PaginationPreviousComponent,
} from "@/components/ui/pagination";
import useEmblaCarousel from 'embla-carousel-react';

// Create a local image URL builder function
const builder = imageUrlBuilder(client);
function getEventImageUrl(source: any) {
  if (!source) return "/images/event-placeholder.jpg";
  try {
    return builder.image(source).width(1200).height(1200).url();
  } catch (error) {
    console.error("Error generating image URL:", error);
    return "/images/event-placeholder.jpg";
  }
}

// First, update the helper function to show 3 events per row on desktop
const getCarouselItemClass = (totalEvents: number): string => {
  if (totalEvents === 1) return "basis-full"; 
  if (totalEvents === 2) return "basis-full sm:basis-1/2";
  if (totalEvents === 3 || totalEvents > 3) return "basis-full sm:basis-1/2 lg:basis-1/3"; // 3+ events show 3 per row
  return "basis-full"; // Default fallback
};

export default function EventsPage() {
  const [pageData, setPageData] = useState({
    title: "",
    description: "",
    services: []
  });

  type EventStat = {
    value: string;
    label: string;
  };

  type Event = {
    _id: string;
    title: string;
    slug?: {
      current: string;
    };
    mainImage: any;
    eventDate: string;
    location: string;
    description: string;
    stats?: EventStat[];
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 'auto'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch page data
        const pageContent = await client.fetch(eventsPageQuery);
        
        // Fetch events data
        const eventsData = await client.fetch(eventsListQuery);
        
        setPageData({
          title: pageContent?.eventsTitle || "We craft experiences that move people",
          description: pageContent?.eventsDescription || "From intimate VIP dinners and creator meetups to large-scale brand campaigns and national talent tours, we handle every detail from start to finish.",
          services: pageContent?.eventsServices || []
        });
        
        setEvents(eventsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate the carousel item class based on total events
  const carouselItemClass = getCarouselItemClass(events.length);

  // Update the eventsPerView function to match
  const eventsPerView = (): number => {
    if (typeof window === 'undefined') return 1; // Server-side default
    
    // First check the total number of events
    const totalEvents = events.length;
    if (totalEvents === 1) return 1;
    if (totalEvents === 2) return Math.min(2, getDeviceMaxEvents());
    
    // For 3 or more events, use responsive breakpoints
    return getDeviceMaxEvents();
  };

  // Add this helper function to detect device capability
  const getDeviceMaxEvents = (): number => {
    const width = window.innerWidth;
    if (width >= 1024) return 3; // lg: 3 items (max)
    if (width >= 640) return 2;  // sm: 2 items
    return 1; // mobile: 1 item
  };
  
  const totalPages = Math.ceil(events.length / eventsPerView());

  // Add a resize listener to update pagination correctly
  useEffect(() => {
    // Update pagination when window resizes
    const handleResize = () => {
      // Recalculate total pages whenever window size changes
      const newTotalPages = Math.ceil(events.length / eventsPerView());
      
      // Adjust current page if needed when resizing
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [events.length, currentPage]);

  // Add effect to handle API initialization
  useEffect(() => {
    if (emblaApi) {
      // Do an initial check to make sure pagination is correct
      const slidesPerView = eventsPerView();
      const newTotalPages = Math.ceil(events.length / slidesPerView);
      if (currentPage > newTotalPages) {
        setCurrentPage(1);
      }
    }
  }, [emblaApi, events.length]);
  
  // Add effect to handle scroll syncing with pagination
  useEffect(() => {
    if (!emblaApi || typeof window === 'undefined') return;
    
    const onScroll = () => {
      // Only update pagination on mobile
      if (window.innerWidth < 640) {
        // Get the current slide index from Embla
        const index = emblaApi.selectedScrollSnap();
        // Calculate which page this corresponds to
        const itemsPerPage = eventsPerView();
        const newPage = Math.floor(index / itemsPerPage) + 1;
        
        // Update pagination if it doesn't match
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
        }
      }
    };
    
    // Subscribe to scroll events
    emblaApi.on('scroll', onScroll);
    emblaApi.on('settle', onScroll);
    
    return () => {
      emblaApi.off('scroll', onScroll);
      emblaApi.off('settle', onScroll);
    };
  }, [emblaApi, currentPage, eventsPerView]);

  // Update your handlePageChange function to use the emblaApi directly
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Calculate the item index to scroll to
    const itemIndex = (page - 1) * eventsPerView();
    
    console.log('Changing to page:', page, 'Item index:', itemIndex);
    
    // Use the API directly instead of DOM queries
    if (emblaApi) {
      emblaApi.scrollTo(itemIndex);
    }
  };

  // Update the carousel item class to use more specific logic
  const getCardClassForEvent = (totalEvents: number, index: number): string => {
    // Base classes for spacing and flexibility
    const baseClass = "pl-4 min-w-0 flex-shrink-0 ";
    
    // Add width classes based on total events
    if (totalEvents === 1) {
      return baseClass + "basis-full"; // Single event takes full width
    } else if (totalEvents === 2) {
      return baseClass + "basis-full sm:basis-1/2"; // Two events take half width each (on sm+)
    } else {
      return baseClass + "basis-full sm:basis-1/2 lg:basis-1/3"; // Three+ events show 3 per row max
    }
  };

  return (
    <main className="pt-30 bg-background">
      {/* Hero Statement Section - Centered big statement */}
      <section className="py-10 md:py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-left md:text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-medium mb-8 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {pageData.title}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {pageData.description}
          </motion.p>
        </div>
      </section>

      {/* Dynamic Events Highlights Section with Carousel */}
      <section className="py-10 md:py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-left md:text-center text-foreground">
            Event Highlights
          </h2>
          
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="relative">
              {/* Direct Embla implementation */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                  {events.map((event, index) => (
                    <div 
                      key={event._id} 
                      className={getCardClassForEvent(events.length, index)}
                    >
                      <Card className="border border-border bg-card rounded-lg overflow-hidden shadow-md h-full p-0 gap-0">
                        {/* Perfect square image with object-cover to fill properly */}
                        <div className="aspect-[5/4] relative overflow-hidden">
                          <Image 
                            src={getEventImageUrl(event.mainImage)}
                            alt={event.title || "Event"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3} // Load first visible images with priority
                            style={{ objectFit: 'cover', objectPosition: 'center center' }}
                          />
                        
                          {/* Overlay with title and location */}  
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent flex items-end">
                            <div className="p-6">
                              <h3 className="text-xl md:text-2xl font-bold text-white">
                                {event.title}
                              </h3>
                              <p className="text-gray-200 text-sm">{event.location}, {formatDate(event.eventDate)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          {/* Description - Now the main focus */}
                          <div className="text-sm text-muted-foreground mb-4 line-clamp-5">
                            {event.description}
                          </div>
                          
                          {/* Stats as pills */}
                          {event.stats && event.stats.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {event.stats.map((stat, idx) => (
                                <div key={idx} className="inline-flex items-center bg-background/80 border border-border rounded-full px-3 py-1">
                                  <span className="text-primary font-semibold mr-1">{stat.value}</span>
                                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Only show pagination when we have more events than can be displayed at once */}
              {events.length > eventsPerView() && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPreviousComponent 
                          onClick={() => {
                            if (currentPage > 1) {
                              const newPage = currentPage - 1;
                              setCurrentPage(newPage);
                              handlePageChange(newPage);
                            }
                          }}
                          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {totalPages <= 5 ? (
                        // For 5 or fewer pages, show all page numbers
                        Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              href="#" 
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))
                      ) : (
                        // For more than 5 pages, show a limited set with ellipsis
                        <>
                          {/* First page */}
                          <PaginationItem>
                            <PaginationLink 
                              href="#" 
                              isActive={1 === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(1);
                              }}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          
                          {/* Ellipsis if needed */}
                          {currentPage > 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          
                          {/* Pages around current */}
                          {Array.from(
                            { length: Math.min(3, totalPages - 2) },
                            (_, i) => {
                              const pageNum = currentPage > 2 ? 
                                (currentPage + i - 1 <= totalPages - 1 ? currentPage + i - 1 : totalPages - 3 + i) : 
                                i + 2;
                              return pageNum <= totalPages - 1 && pageNum > 1 ? (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink 
                                    href="#" 
                                    isActive={pageNum === currentPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handlePageChange(pageNum);
                                    }}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              ) : null;
                            }
                          )}
                          
                          {/* Ellipsis if needed */}
                          {currentPage < totalPages - 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          
                          {/* Last page if not already shown */}
                          {totalPages > 1 && (
                            <PaginationItem>
                              <PaginationLink 
                                href="#" 
                                isActive={totalPages === currentPage}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(totalPages);
                                }}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                        </>
                      )}
                      
                      <PaginationItem>
                        <PaginationNextComponent 
                          onClick={() => {
                            if (currentPage < totalPages) {
                              const newPage = currentPage + 1;
                              setCurrentPage(newPage);
                              handlePageChange(newPage);
                            }
                          }}
                          className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">No events to display.</p>
            </div>
          )}
        </div>
      </section>

      {/* What We Do Section - Accordion services - Now moved below events */}
      <section className="py-10 md:py-24 bg-background px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left column - Section title */}
            <div className="md:sticky md:top-24">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-0 text-foreground">What We Do</h2>
            </div>
            
            {/* Right column - Accordions */}
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {pageData.services.map((service, index) => (
                  <AccordionItem key={index} value={`item-${index+1}`} className="border-border">
                    <AccordionTrigger className="text-2xl font-semibold py-4 hover:no-underline hover:text-primary text-foreground">
                      {service.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-lg pb-6">
                      {service.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}