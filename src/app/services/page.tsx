"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import imageUrlBuilder from '@sanity/image-url';

// Set up the image builder
const builder = imageUrlBuilder(client);

// Helper function to build image URLs
function urlForImage(source) {
  return builder.image(source);
}

// Helper function: convert kebab-case to PascalCase
function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Update the query to include statement title and intro text
const SERVICES_QUERY = groq`*[_type == "pages" && pageType == "services"][0]{
  statementTitle,
  introText,
  servicesList[] {
    title,
    description,
    icon,
    image
  }
}`;

export default function ServicesPage() {
  const [pageData, setPageData] = useState<{
    statementTitle?: string;
    introText?: string;
    servicesList?: any[];
  }>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await client.fetch(SERVICES_QUERY);
        console.log("Services page data:", data);
        setPageData({
          statementTitle: data?.statementTitle || "We provide comprehensive services to elevate your brand",
          introText: data?.introText || "",
          servicesList: data?.servicesList || []
        });
      } catch (error) {
        console.error("Error fetching services data:", error);
      }
    }
    fetchServices();
    setIsMounted(true);
  }, []);

  const services = pageData.servicesList || [];

  return (
    <main className="flex-col max-w-7xl mx-auto px-7 pt-10 md:pt-20 pb-12">
      {/* Header section with statement title and intro text */}
      <motion.div
        className="mb-16 max-w-3xl pt-25"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-medium mb-6 text-foreground leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {pageData.statementTitle}
        </motion.h2>
        
        {pageData.introText && (
          <motion.div
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            dangerouslySetInnerHTML={{ __html: pageData.introText }}
          />
        )}
      </motion.div>
      
      {/* Services grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isMounted &&
          services.map((service: any, index: number) => {
            const iconName = toPascalCase(service.icon?.trim() || "");
            const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
            
            // Try/catch for image URL generation to prevent errors
            let imageUrl = '';
            try {
              if (service.image && service.image._type === 'image') {
                imageUrl = urlForImage(service.image)
                  .width(600)
                  .height(400)
                  .fit('crop')
                  .quality(80)
                  .url();
              } else {
                imageUrl = `https://placehold.co/600x400/3a84f7/ffffff?text=${encodeURIComponent(service.title || 'Service')}`;
              }
            } catch (error) {
              console.error("Error generating image URL:", error);
              imageUrl = `https://placehold.co/600x400/3a84f7/ffffff?text=${encodeURIComponent(service.title || 'Service')}`;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                <Card className="h-full overflow-hidden border border-border hover:shadow-md transition-shadow duration-300 pt-0">
                  {/* Clean image container with proper sizing */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={service.title || "Service"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Content section with clear separation */}
                  <CardHeader className="pt-5 pb-2">
                    <div className="flex items-center gap-3">
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <LucideIcons.HelpCircle className="w-5 h-5 text-primary shrink-0" />
                      )}
                      <h2 className="text-xl font-semibold">{service.title}</h2>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
      </div>
    </main>
  );
}