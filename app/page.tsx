'use client'

import { MotionCard, MotionButton, animations } from '../components/Motion'
import { Card, CardHeader } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Optimized animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] } }
}

export default function HomePage() {
  return (
    <section className="min-h-[calc(100vh-4rem)] space-y-8 py-12 px-4 flex flex-col justify-center relative overflow-hidden">
      <div className="animated-bg" />
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={staggerContainer}
        className="max-w-4xl mx-auto w-full relative z-10"
      >
        <motion.h1 
          variants={item} 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-gradient floating"
        >
          Welcome to SSPM's COE Mess
        </motion.h1>
        
        <motion.p 
          variants={item} 
          className="text-lg md:text-xl text-center text-muted-foreground mb-8"
        >
          Don’t waste food — someone else is sleeping hungry !!
        </motion.p>
        
        <MotionCard animation="scale" className="mb-8 w-full">
          <Card className="glass-card p-8">
            <CardHeader title="Quick Access" subtitle="Everything you need, right at your fingertips" />
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              {[
                { title: "View Menu", href: "/menu", icon: "🍽️", color: "from-blue-500 to-cyan-500" },
                { title: "Book Meals", href: "/booking", icon: "📅", color: "from-purple-500 to-pink-500" },
                { title: "Check-in", href: "/checkin", icon: "✅", color: "from-green-500 to-emerald-500" },
                { title: "Billing", href: "/billing", icon: "💰", color: "from-amber-500 to-orange-500" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={animations.fadeIn} 
                  whileHover={{ scale: 1.03 }} 
                  className="h-full"
                  layout
                >
                  <Link 
                    href={item.href} 
                    className="flex items-center p-6 h-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium text-lg backdrop-blur-sm bg-gradient-to-r hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, hsl(var(--${item.color.split('-')[1]}-500)), hsl(var(--${item.color.split('-')[3]}-500)))` 
                    }}
                  >
                    <span className="text-2xl mr-3">{item.icon}</span>
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </Card>
        </MotionCard>
      </motion.div>
    </section>
  )
}


