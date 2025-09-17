&apos;use client&apos;

import { motion } from &apos;framer-motion&apos;
import { PageTransition } from &apos;@/components/Motion&apos;
import { ReactNode } from &apos;react&apos;
import Link from &apos;next/link&apos;

interface AnimatedLayoutProps {
  children: ReactNode
}

const navItems = [
  { name: &apos;Home&apos;, href: &apos;/&apos; },
  { name: &apos;Menu&apos;, href: &apos;/menu&apos; },
  { name: &apos;Bookings&apos;, href: &apos;/booking&apos; },
  { name: &apos;Check-in&apos;, href: &apos;/checkin&apos; },
  { name: &apos;Billing&apos;, href: &apos;/billing&apos; },
]

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-background/80">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gradient font-poppins">MESS</h1>
          </motion.div>
          
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex space-x-6"
          >
            {navItems.map((item, i) => (
              <Link 
                href={item.href} 
                key={item.name} 
                className="nav-link font-medium"
              >
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: &apos;inline-block&apos; }}
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}
          </motion.nav>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:hidden"
          >
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <PageTransition animation="fadeIn">
          {children}
        </PageTransition>
      </main>
      
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            © {new Date().getFullYear()} MESS - Mess Management System
          </motion.div>
        </div>
      </footer>
    </div>
  )
}