import { client } from '@/sanity/lib/client'
import { pageContentQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PageData {
  title: string
  content: any
}

export const metadata: Metadata = {
  title: 'Terms & Conditions - Brand Link',
  description: 'View our Terms & Conditions at Brand Link.',
}

export default async function TermsConditionsPage() {
  const pageData: PageData = await client.fetch(pageContentQuery, { slug: 'terms-conditions' })

  if (!pageData) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        Terms & Conditions not found.
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto w-full pt-30 md:pt-50 md:pb-20 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">

        {/* Title */}
        <div className="md:w-1/3 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white sticky top-32">
            {pageData.title}
          </h1>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="w-full h-[60vh] rounded-md border p-6 bg-muted">
          <div className="prose dark:prose-invert text-sm md:text-xs leading-relaxed">
            <PortableText value={pageData.content} />
          </div>
        </ScrollArea>

      </div>
    </section>
  )
}