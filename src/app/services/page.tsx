"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

// ✅ Helper function: convert kebab-case to PascalCase
function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const SERVICES_QUERY = groq`*[_type == "pages" && pageType == "services"][0]{
  title,
  servicesList[] {
    title,
    description,
    icon
  }
}`;

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      const data = await client.fetch(SERVICES_QUERY);
      setServices(data?.servicesList || []);
    }
    fetchServices();
    setIsMounted(true);
  }, []);

  return (
    <main className="flex-col md:flex max-w-7xl mx-auto px-7 pt-10 md:pt-50 pb-12">
      <h1 className="text-4xl invisible md:visible font-bold mb-12 text-left">Our Services</h1>

      <div className="grid md:grid-cols-3 gap-10">
        {isMounted &&
          services.map((service: any, index: number) => {
            const iconName = toPascalCase(service.icon?.trim() || "");
            const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;

            return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    {IconComponent ? (
                      <IconComponent className="w-6 h-6 text-primary shrink-0" />
                    ) : (
                      <LucideIcons.HelpCircle className="w-6 h-6 text-primary shrink-0" />
                    )}
                    <h2 className="text-lg font-bold">{service.title}</h2>
                  </div>
  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
        </div>
      </main>
  );
}
