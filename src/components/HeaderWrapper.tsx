'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer' // if you have one

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudioRoute = pathname.startsWith('/studio')

  return (
    <>
      {!isStudioRoute && <Header />}
      {children}
      {!isStudioRoute && <Footer />}
    </>
  )
}
