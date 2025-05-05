import { Metadata } from 'next'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: 'Events | Brand Link Agency',
  description: 'We craft experiences that move people. From intimate VIP dinners to large-scale brand campaigns and talent tours.',
}

export default function EventsPage() {
  return (
    <main className="pt-20">
    {/* Hero Section - Updated for better mobile layout with text first */}
    <section className="py-24 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        {/* Text content card - Always comes first on mobile */}
        <div className="border border-gray-800 rounded-lg overflow-hidden bg-zinc-900/50 backdrop-blur-sm mb-8">
          <div className="space-y-6 p-8 md:p-12">
            <h1 className="text-4xl md:text-6xl font-bold">
              We don't just plan events. 
              <span className="text-primary block mt-2">We craft experiences that move people.</span>
            </h1>
            
            <p className="text-base md:text-base text-gray-400">
              From intimate VIP dinners and creator meetups to large-scale brand campaigns and national talent tours, 
              we handle every detail from start to finish. At Brand Link Agency, events are more than just dates on a calendar. They're culture-driving moments that leave lasting impact. 
              Whether it's a boutique gathering or a major campaign rollout, we work with venues, talent, vendors, and creators to build experiences that don't just show up on the feed, they get talked about. 
              Every touchpoint is considered. Every vibe is intentional. Every outcome is measurable.
            </p>
            
            <div className="pt-4">
              <Button asChild size="lg">
                <Link href="#contact">
                  Let's Create Something Together
                </Link>
              </Button>
            </div>
          </div>
        </div>
    
        {/* Image container - Comes second on mobile, full width with no padding */}
        <div className="md:hidden -mx-6 relative h-[300px]">
          <Image
            src="/images/events-hero-bg.jpg" 
            alt="Brand Link Agency Events"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
    
        {/* Desktop layout - Combined card with text and image side by side */}
        <div className="hidden md:block border border-gray-800 rounded-lg overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
          <div className="grid grid-cols-[1.2fr_0.8fr] items-center">
            {/* Left side - Text content */}
            <div className="space-y-6 p-12">
              <h1 className="text-6xl font-bold">
                We don't just plan events. 
                <span className="text-primary block mt-2">We craft experiences that move people.</span>
              </h1>
              
              <p className="text-base text-gray-400">
                From intimate VIP dinners and creator meetups to large-scale brand campaigns and national talent tours, 
                we handle every detail from start to finish. At Brand Link Agency, events are more than just dates on a calendar. They're culture-driving moments that leave lasting impact. 
                Whether it's a boutique gathering or a major campaign rollout, we work with venues, talent, vendors, and creators to build experiences that don't just show up on the feed, they get talked about. 
                Every touchpoint is considered. Every vibe is intentional. Every outcome is measurable.
              </p>
              
              <div className="pt-4">
                <Button asChild size="lg">
                  <Link href="#contact">
                    Let's Create Something Together
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right side - Image */}
            <div className="relative h-auto aspect-square overflow-hidden">
              <Image
                src="/images/events-hero-bg.jpg" 
                alt="Brand Link Agency Events"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* What We Do Section - Updated with black background */}
      <section className="py-16 md:py-24 bg-black text-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left column - Section title */}
            <div className="md:sticky md:top-24">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-0">What We Do</h2>
            </div>
            
            {/* Right column - Accordions */}
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-800">
                  <AccordionTrigger className="text-2xl font-semibold py-4 hover:no-underline hover:text-primary">
                    Brand Activations
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-lg pb-6">
                    Bring your brand to life through bold, on-brand experiences designed to connect with your audience. 
                    Our activations create memorable moments that resonate with attendees and generate authentic content.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-gray-800">
                  <AccordionTrigger className="text-2xl font-semibold py-4 hover:no-underline hover:text-primary">
                    Influencer & Creator Events
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-lg pb-6">
                    Invite-only events that connect brands with influential creators and drive authentic engagement. 
                    We curate the perfect mix of talent to amplify your message and create content that resonates.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-gray-800">
                  <AccordionTrigger className="text-2xl font-semibold py-4 hover:no-underline hover:text-primary">
                    Launches & Campaign Drops
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-lg pb-6">
                    Product releases and campaign events curated for impact, content, and momentum. 
                    We design experiences that generate excitement, press coverage, and social sharing.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-gray-800">
                  <AccordionTrigger className="text-2xl font-semibold py-4 hover:no-underline hover:text-primary">
                    Private & Community Events
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-lg pb-6">
                    From luxury dinners to grassroots initiatives, we plan with purpose and deliver with precision. 
                    Our team handles every detail to create meaningful connections and memorable experiences.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-gray-800">
                  <AccordionTrigger className="text-2xl font-semibold py-4 hover:no-underline hover:text-primary">
                    Talent Tours & Activations
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-lg pb-6">
                    We organise full-scale tours for influencers and music artists. Managing logistics, bookings, venues, 
                    accommodation, and partnerships across cities. From media runs to regional campaigns, we make sure it moves right.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-gray-800">
                  <AccordionTrigger className="text-2xl font-semibold py-4 hover:no-underline hover:text-primary">
                    Full-Service Event Production
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-lg pb-6">
                    From concept to clean-up — run sheets, vendor coordination, styling, talent management, and content. 
                    We manage it all so you can focus on your objectives while we handle the execution.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Highlight Case Study - Updated with black background */}
      <section className="py-16 md:py-24 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Recent Highlights</h2>
          
          <div className="relative bg-zinc-900 rounded-lg overflow-hidden shadow-md border border-gray-800">
            {/* Case Study Image */}
            <div className="h-64 md:h-96 relative">
              <Image 
                src="/images/parked-up-event.jpg" 
                alt="Parked Up YouTube Launch Party"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end">
                <div className="p-6 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    'Parked Up' YouTube Launch Party
                  </h3>
                  <p className="text-white/80">Brisbane, April 2025</p>
                </div>
              </div>
            </div>
            
            {/* Case Study Content */}
            <div className="p-6 md:p-10 space-y-6">
              <p className="text-lg">
                We hosted the official launch party for Parked Up, a brand-new YouTube series featuring popular Aussie influencers 
                @reesebros, @paulie_roberts_, and @floppyyt_.
              </p>
              
              <p className="text-gray-300">
                The night brought together creators, fans, and media for an exclusive preview of the show, 
                complete with live DJ sets, custom branding, interactive activations, and content rollouts across socials.
              </p>
              
              {/* Stats Grid - With dark borders */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                <div className="text-center p-4 border border-gray-800 rounded-lg">
                  <p className="text-primary text-3xl font-bold">700+</p>
                  <p className="text-sm text-gray-400">guests in attendance</p>
                </div>
                <div className="text-center p-4 border border-gray-800 rounded-lg">
                  <p className="text-primary text-3xl font-bold">20+</p>
                  <p className="text-sm text-gray-400">creators and collaborators</p>
                </div>
                <div className="text-center p-4 border border-gray-800 rounded-lg">
                  <p className="text-primary text-3xl font-bold">9M+</p>
                  <p className="text-sm text-gray-400">combined social reach</p>
                </div>
                <div className="text-center p-4 border border-gray-800 rounded-lg">
                  <p className="text-primary text-3xl font-bold">150+</p>
                  <p className="text-sm text-gray-400">pieces of content posted</p>
                </div>
              </div>
              
              <p className="italic text-gray-400">
                Parked Up is just getting started and Brand Link was there to launch it right.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}