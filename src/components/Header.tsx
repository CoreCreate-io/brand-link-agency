"use client";

import { useEffect, useState } from "react";
import { menuQuery, featuredInfluencersQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import BrandLinkLogo from '@/app/logo.svg';
import { FormattedBudgetInput } from "@/components/FormattedBudgetInput";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

interface MenuLink {
  label: string;
  href: string;
}

interface Influencer {
  _id: string;
  name: string;
  handle: string;
  imageUrl: string;
}


export default function Header() {
  const { theme, setTheme } = useTheme();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) return;
  
    const controlNavbar = () => {
      const threshold = 2;
      if (window.scrollY <= threshold) setShow(true);
      else if (window.scrollY > lastScrollY) setShow(false);
      else setShow(true);
      setLastScrollY(window.scrollY);
    };
  
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [mounted, lastScrollY]);
  

  useEffect(() => {
    async function fetchData() {
      const menuData = await client.fetch(menuQuery);
      const influencerData = await client.fetch(featuredInfluencersQuery);
      const settingsData = await client.fetch(siteSettingsQuery);

      setMenuLinks(menuData?.links || []);
      setInfluencers(influencerData || []);
    }
    fetchData();
  }, []);
  

  return (
    <header className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 ${show ? "translate-y-2 md:translate-y-5" : "-translate-y-full"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogContent className="w-full h-dvh max-w-none rounded-none bg-white dark:bg-[#111111] p-6 overflow-y-auto flex flex-col items-center justify-center md:h-auto md:max-w-md md:rounded-2xl md:p-8">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-4 right-4" />
            </DialogClose>
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-3xl font-bold text-center">Contact Us</DialogTitle>
              <DialogDescription className="text-center text-gray-500 dark:text-gray-400 pb-5">
                Fill out the form and we’ll get back to you soon.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-2">
                <Input type="text" placeholder="First Name*" required />
                <Input type="text" placeholder="Last Name*" required />
              </div>
              <Input type="email" placeholder="Email Address*" required />
              <div className="flex flex-row gap-2">
                <Input type="tel" placeholder="Phone Number*" required />
                <FormattedBudgetInput />
              </div>
              <textarea placeholder="Your Message" required rows={4}
                className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white resize-none"
              />
              <div className="flex items-start space-x-2 mt-2">
                <input id="terms" type="checkbox" required className="mt-1 w-5 h-5 rounded-md border-gray-300 dark:border-gray-700" />
                <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the terms and conditions
                </label>
              </div>
              <Button type="submit" className="w-full py-7 mt-4">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between rounded-full px-6 py-4 md:py-6 backdrop-blur-md bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10">

        <div className="flex items-center text-black dark:text-white transition-colors duration-300">
  <Link href="/" className="block relative w-32 md:w-36 h-10">
    <BrandLinkLogo className="object-contain w-full h-full" />
  </Link>
</div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium relative">
            <NavigationMenu>
              <NavigationMenuList>
              <NavigationMenuItem>
  {/* TRIGGER (single element, not link) */}
  <NavigationMenuTrigger
  className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent data-[state=open]:bg-transparent data-[state=active]:bg-transparent transition-none p-3"
>
  Influencers
</NavigationMenuTrigger>

  {/* CONTENT */}
  <NavigationMenuContent>
  <ScrollArea className="max-h-80 w-[320px] overflow-y-auto p-4 bg-white dark:bg-[#111111] rounded-md shadow-lg border border-border">


      <div className="flex flex-col gap-4">
        {influencers.map((inf) => (
          <Link
            key={inf._id}
            href={`/talent-directory/${inf.handle}`}
            className="flex items-center gap-4 hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
              <Image src={inf.imageUrl} alt={inf.name} fill className="object-cover" />
            </div>
            <div className="text-sm font-semibold">
              @{inf.handle}
            </div>
          </Link>
        ))}

        {/* ADD "View All" link at the bottom if you want */}
        <Link
          href="/talent-directory"
          className="flex items-center justify-center gap-2 mt-4 text-sm font-semibold hover:underline"
        >
          View All Influencers →
        </Link>
      </div>
    </ScrollArea>
  </NavigationMenuContent>
</NavigationMenuItem>


              </NavigationMenuList>
            </NavigationMenu>

            {menuLinks.filter(link => link.label.toLowerCase() !== "influencers").map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}

            <Button onClick={() => setIsContactDialogOpen(true)} className="h-9 px-4 py-2">Contact Us</Button>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </nav>

                    {/* Right: Mobile Nav */}
                    <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full max-w-full bg-white dark:bg-[#111111] p-0 flex flex-col">
  
  {/* Add hidden DialogTitle for accessibility */}
  <div className="p-4">
    <DialogTitle className="sr-only">Mobile Navigation Menu</DialogTitle>
  </div>

  <div className="flex-1 flex items-center justify-center">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      className="flex flex-col divide-y divide-gray-300 dark:divide-gray-700 w-full"
    >

<div className="flex items-left justify-left p-6">
  <Link href="/" onClick={() => setIsMenuOpen(false)} className="block w-32 h-10 relative">
    <BrandLinkLogo className="object-contain w-full h-full" />
  </Link>
</div>

      {menuLinks.map((link, index) => (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.3 }}
        >
          <Link
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-5xl font-bold tracking-wide text-black dark:text-white px-8 py-6 text-left"
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  </div>

{/* Sticky Mobile Contact + Join Buttons */}
<div className="sticky bottom-4 px-8 flex flex-col gap-4">

  {/* Join Brand Link Button */}
  <Button
    onClick={() => setIsContactDialogOpen(true)}
    className="w-full py-7 text-lg font-semibold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
  >
    Join Brand Link
  </Button>

  {/* Contact Us Button */}
  <Button
    onClick={() => setIsContactDialogOpen(true)}
    variant="outline"
    className="w-full py-7 text-lg font-semibold border-gray-300 dark:border-gray-700"
  >
    Contact Us
  </Button>

</div>

</SheetContent>

            </Sheet>
          </div>

        </div>
      </div>
    </header>
  )
}
