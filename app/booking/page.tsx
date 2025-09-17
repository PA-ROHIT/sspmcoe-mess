"use client"
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBookingSchema } from '@/lib/validation'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

export default function BookingPage() {
  const router = useRouter()
  const [menus, setMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const FormSchema = createBookingSchema
  type FormValues = z.infer<typeof FormSchema>
  const { register, handleSubmit, formState: { errors, touchedFields }, reset, watch } = useForm<FormValues>({ 
    resolver: zodResolver(FormSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/menus')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to load menu items')
        }
        const data = await response.json()
        if (!data || data.length === 0) {
          setError('No menu items available for booking')
          return
        }
        setMenus(data)
      } catch (error) {
        console.error('Error fetching menus:', error)
        setError(error instanceof Error ? error.message : 'Failed to load menu items')
      } finally {
        setLoading(false)
      }
    }
    fetchMenus()
  }, [])

  const onSubmit = async (values: FormValues) => {
    if (!values.menuItemId || !values.date || !values.timeSlot || !values.portionSize) {
      setError('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    setError(null)
    
    try {
      const chosen = menus.find(m => m.id === values.menuItemId)
      if (!chosen) throw new Error('Selected menu item not found')
      
      // Set default messId if not provided
      const bookingData = {
        ...values,
        messId: chosen.messId || '1', // Default messId
        date: new Date(values.date).toISOString(),
      }
      
      const res = await fetch('/api/bookings', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(bookingData),
        credentials: 'include'
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to create booking')
      }
      
      // Redirect to success page with query parameters
      router.push(`/booking/success?meal=${encodeURIComponent(chosen.name)}&date=${values.date}&timeSlot=${values.timeSlot}&portionSize=${values.portionSize}`)
    } catch (err) {
      console.error('Booking error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  // Disable past dates
  const today = new Date().toISOString().split('T')[0]

  // Watch form values for validation
  const formValues = watch()
  const hasEmptyFields = Object.values(formValues).some(value => !value)

  return (
    <section className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 relative">
      <div className="animated-bg opacity-30" />
      
      <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block"
        >
          <Image
            src="/booking-illustration.svg"
            alt="Booking Illustration"
            width={500}
            height={500}
            className="w-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-gradient">Book Your Meals</h1>
          <p className="text-lg text-muted-foreground mb-8">Reserve your favorite dishes in advance</p>
          
          <form className="glass-card p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Menu Item</label>
              <div className="relative">
                <select
                  {...register('menuItemId')}
                  className="w-full bg-transparent px-4 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  required
                >
                  <option value="">Select a meal...</option>
                  {!loading && menus.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <input type="hidden" value={menus[0]?.messId || ''} {...register('messId')} />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Date</label>
              <div className="relative">
                <input
                  type="date"
                  {...register('date')}
                  min={today}
                  className="w-full bg-transparent px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">Time Slot</label>
              <div className="flex flex-wrap gap-3">
                {['breakfast', 'lunch', 'dinner'].map((slot) => (
                  <label key={slot} className="relative">
                    <input
                      type="radio"
                      {...register('timeSlot')}
                      value={slot}
                      className="peer sr-only"
                    />
                    <div className="px-4 py-2 rounded-full border cursor-pointer transition-all duration-200 peer-checked:bg-gradient-to-r from-blue-500 to-purple-500 peer-checked:border-transparent peer-checked:text-white hover:bg-muted/50 capitalize">
                      {slot}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">Portion Size</label>
              <div className="flex flex-wrap gap-3">
                {['small', 'regular', 'large'].map((size) => (
                  <label key={size} className="relative">
                    <input
                      type="radio"
                      {...register('portionSize')}
                      value={size}
                      className="peer sr-only"
                    />
                    <div className="px-4 py-2 rounded-full border cursor-pointer transition-all duration-200 peer-checked:bg-gradient-to-r from-blue-500 to-purple-500 peer-checked:border-transparent peer-checked:text-white hover:bg-muted/50 capitalize">
                      {size}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {Object.entries(errors).map(([field, error]) => 
              touchedFields[field as keyof FormValues] && (
                <p key={field} className="text-sm text-destructive">
                  {error?.message as string}
                </p>
              )
            )}

            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}
            
            <motion.button
              type="submit"
              className="w-full py-3 text-lg relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || submitting || hasEmptyFields}
              onClick={(e) => {
                if (hasEmptyFields) {
                  e.preventDefault()
                  setError('Please fill in all required fields')
                }
              }}
            >
              <span className="relative z-10">
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : loading ? "Loading..." : "Book Now"}
              </span>
              {submitting && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}


