"use client";

import { useEffect, useState } from "react";
import { menuQuery, featuredInfluencersQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Sun, Moon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BrandLinkLogo from '@/app/logo.svg';
import ContactForm from "@/components/ContactForm";
import JoinBrandLinkForm from "@/components/JoinBrandLinkForm"; // Import the new form component
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
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false); // New state for join dialog
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  // Scroll detection using requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    async function fetchData() {
      try {
        const menuData = await client.fetch(menuQuery);
        const influencerData = await client.fetch(featuredInfluencersQuery);
        const settingsData = await client.fetch(siteSettingsQuery);

        setMenuLinks(menuData?.links || []);
        setInfluencers(influencerData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -100 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 pt-5 md:px-6 md:pt-7">

        {/* Contact Dialog */}
        <Dialog 
          open={isContactDialogOpen} 
          onOpenChange={(open) => {
            setIsContactDialogOpen(open);
            // Only close the menu if the dialog is closing and user explicitly clicked close
            // Don't close the menu when opening the dialog
            if (!open) {
              // Optional: close the menu when dialog closes
              // setIsMenuOpen(false);
            }
          }}
        >
          <DialogContent className="w-full h-dvh max-w-none rounded-none bg-white dark:bg-[#111111] p-6 overflow-y-auto flex flex-col items-center justify-center md:h-auto md:max-w-md md:rounded-2xl md:p-8">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            
            <DialogHeader className="space-y-1 w-full">
              <DialogTitle className="text-3xl font-bold text-center">Contact Us</DialogTitle>
              <DialogDescription className="text-center text-gray-500 dark:text-gray-400 pb-5">
                Fill out the form and we'll get back to you soon.
              </DialogDescription>
            </DialogHeader>
            
            <ContactForm onClose={() => setIsContactDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        
        {/* Join Brand Link Dialog */}
        <Dialog 
          open={isJoinDialogOpen} 
          onOpenChange={(open) => {
            setIsJoinDialogOpen(open);
            // Don't close the menu when dialog closes
          }}
        >
          <DialogContent className="w-full h-dvh max-w-none rounded-none bg-white dark:bg-[#111111] p-6 overflow-y-auto flex flex-col items-center justify-center md:h-auto md:max-w-md md:rounded-2xl md:p-8">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            
            <DialogHeader className="space-y-1 w-full">
              <DialogTitle className="text-3xl font-bold text-center">Join Brand Link</DialogTitle>
              <DialogDescription className="text-center text-gray-500 dark:text-gray-400 pb-5">
                Apply to join our influencer network
              </DialogDescription>
            </DialogHeader>
            
            <JoinBrandLinkForm onClose={() => setIsJoinDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between rounded-full px-6 py-4 md:py-6 backdrop-blur-md bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10">

          <div className="flex items-center text-black dark:text-white transition-colors duration-300">
            <Link href="/" className="block relative w-32 md:w-36 h-10">
              <BrandLinkLogo className="object-contain w-full h-full" />
            </Link>
          </div>

          {/* Update the desktop navigation section */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium relative">
            {/* NavigationMenu remains the same */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent data-[state=open]:bg-transparent data-[state=active]:bg-transparent transition-none p-3">
                    Influencers
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ScrollArea className="max-h-80 w-[320px] overflow-y-auto p-4 bg-white dark:bg-[#111111] rounded-md shadow-lg border border-border">
                      <div className="flex flex-col gap-4">
                        {influencers.map((inf) => (
                          <Link key={inf._id} href={`/talent-directory/${inf.handle}`} className="flex items-center gap-4 hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                              <Image
                                src={inf.imageUrl || "/fallback-image.png"}
                                alt={inf.name || "Unknown influencer"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="text-sm font-semibold">@{inf.handle}</div>
                          </Link>
                        ))}
                        <Link href="/talent-directory" className="flex items-center justify-center gap-2 mt-4 text-sm font-semibold hover:underline">
                          View All Influencers →
                        </Link>
                      </div>
                    </ScrollArea>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {menuLinks
              .filter(link => link.label.toLowerCase() !== "influencers")
              .map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="hover:underline px-2" // Add padding for consistent spacing
                >
                  {link.label}
                </Link>
              ))}

            {/* Button group with tighter spacing */}
            <div className="flex items-center gap-2"> {/* Added container with smaller gap */}
              {/* Updated Join Brand Link button with better hover effect */}
              <Button 
                onClick={() => setIsJoinDialogOpen(true)}
                variant="outline" 
                className="h-9 px-4 py-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-colors"
              >
                Join Brand Link
              </Button>
              
              <Button 
                onClick={() => setIsContactDialogOpen(true)} 
                className="h-9 px-4 py-2"
              >
                Contact Us
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="ml-0" // Reduce margin
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </nav>

          {/* Update the mobile buttons section */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="border-2 border-gray-300/70 dark:border-white/20 rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Menu className="w-[18px] h-[18px]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-full bg-white dark:bg-[#111111] p-0 flex flex-col">
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

                <div className="sticky bottom-4 px-8 flex flex-col gap-4">
                  <Button
                    onClick={(e) => {
                      // Prevent default to avoid any automatic closing
                      e.preventDefault();
                      // Open the Join dialog without closing the sheet
                      setIsJoinDialogOpen(true);
                      // We don't call setIsMenuOpen(false) here anymore
                    }}
                    className="w-full py-7 text-lg font-semibold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                  >
                    Join Brand Link
                  </Button>
                  <Button
                    onClick={(e) => {
                      // Prevent default to avoid any automatic closing
                      e.preventDefault();
                      // Open the Contact dialog without closing the sheet
                      setIsContactDialogOpen(true);
                      // We don't call setIsMenuOpen(false) here anymore
                    }}
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
    </motion.header>
  );
}
