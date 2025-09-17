'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingDetails = {
    meal: searchParams.get('meal'),
    date: searchParams.get('date'),
    timeSlot: searchParams.get('timeSlot'),
    portionSize: searchParams.get('portionSize')
  }

  useEffect(() => {
    if (!bookingDetails.meal) {
      router.push('/booking')
    }
  }, [bookingDetails.meal, router])

  return (
    <section className="min-h-screen py-12 max-w-2xl mx-auto px-4 sm:px-6 relative">
      <div className="animated-bg opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-4 text-gradient"
        >
          Booking Successful!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 mb-8 text-left"
        >
          <div className="glass-effect p-4 rounded-lg">
            <h3 className="font-medium mb-2">Booking Details</h3>
            <div className="space-y-2 text-muted-foreground">
              <p><span className="font-medium text-foreground">Meal:</span> {bookingDetails.meal}</p>
              <p><span className="font-medium text-foreground">Date:</span> {new Date(bookingDetails.date || '').toLocaleDateString()}</p>
              <p><span className="font-medium text-foreground">Time Slot:</span> {bookingDetails.timeSlot}</p>
              <p><span className="font-medium text-foreground">Portion Size:</span> {bookingDetails.portionSize}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="btn-primary bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Return Home
          </Link>
          <Link 
            href="/booking"
            className="btn-outline"
          >
            Book Another Meal
          </Link>
        </div>
      </motion.div>
    </section>
  )
}