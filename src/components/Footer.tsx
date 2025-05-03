'use client'

import { useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'
import { footerQuery, menuQuery, footerMenuQuery } from '@/sanity/lib/queries'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import BrandLinkLogo from '@/app/logo.svg'
import { FaTiktok } from 'react-icons/fa'

interface SocialLinks {
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
  linkedin?: string
  youtube?: string
}

interface FooterData {
  aboutText: string
  socialLinks: SocialLinks
  socialLinksHeading: string
  newsletterHeading: string
  newsletterEnabled: boolean
  copyrightText: string
}

interface MenuData {
  title: string
  links: { label: string; href: string }[]
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [mainMenu, setMainMenu] = useState<MenuData | null>(null)
  const [footerMenu, setFooterMenu] = useState<MenuData | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function fetchFooter() {
      const [footerRes, mainMenuRes, footerMenuRes] = await Promise.all([
        client.fetch(footerQuery),
        client.fetch(menuQuery),
        client.fetch(footerMenuQuery),
      ])
      
      console.log('Footer data:', footerRes); // Debug
      setFooterData(footerRes)
      setMainMenu(mainMenuRes)
      setFooterMenu(footerMenuRes)
    }
    fetchFooter()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement newsletter signup logic
    console.log('Subscribe:', email)
    // Clear input
    setEmail('')
    // Show success message
    alert('Thank you for subscribing!')
  }

  // Replace {year} with current year in copyright text
  const copyrightText = footerData?.copyrightText?.replace('{year}', new Date().getFullYear().toString()) || 
    `© ${new Date().getFullYear()} Brand Link Agency. All rights reserved.`

  return (
    <footer className="bg-background text-foreground px-6 py-12 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Logo and About */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="block w-45 md:w-36 h-10 relative">
            <BrandLinkLogo className="object-contain w-full h-full text-black dark:text-white" />
          </Link>
          <p className="text-sm text-muted-foreground">{footerData?.aboutText}</p>
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold">{footerData?.socialLinksHeading || 'Follow Us'}</h4>
          <div className="flex gap-4">
            {footerData?.socialLinks?.instagram && (
              <Link href={footerData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            )}
            {footerData?.socialLinks?.facebook && (
              <Link href={footerData.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            )}
            {footerData?.socialLinks?.twitter && (
              <Link href={footerData.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            )}
            {footerData?.socialLinks?.tiktok && (
              <Link href={footerData.socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
                className="hover:text-primary transition-colors">
                <FaTiktok className="h-5 w-5" />
              </Link>
            )}
            {footerData?.socialLinks?.linkedin && (
              <Link href={footerData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            )}
            {footerData?.socialLinks?.youtube && (
              <Link href={footerData.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Navigation</h4>
          {mainMenu?.links?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Email Signup - Only show if enabled in CMS */}
        {footerData?.newsletterEnabled !== false && (
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold">{footerData?.newsletterHeading || 'Join Our List'}</h4>
            <form className="flex items-center space-x-2 w-full max-w-md" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Email"
                className="flex-1"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        )}

      </div>

      {/* Separation Line */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

      {/* Bottom Section: Footer Menu + Copyright */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
        
        {/* Left: Footer Menu Links */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {footerMenu?.links?.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Copyright */}
        <div className="text-center md:text-right">
          {copyrightText}
        </div>
      </div>
    </footer>
  )
}