"use client"
import { useState, useEffect } from &apos;react&apos;
import { useForm } from &apos;react-hook-form&apos;
import { zodResolver } from &apos;@hookform/resolvers/zod&apos;
import { createBookingSchema } from &apos;@/lib/validation&apos;
import { z } from &apos;zod&apos;
import { motion } from &apos;framer-motion&apos;
import { useRouter } from &apos;next/navigation&apos;
import Image from &apos;next/image&apos;
import { CalendarIcon, ClockIcon, UserIcon } from &apos;@heroicons/react/24/outline&apos;

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
    mode: &apos;onChange&apos;
  })

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true)
        setError(&apos;&apos;)
        const response = await fetch(&apos;/api/menus&apos;)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || &apos;Failed to load menu items&apos;)
        }
        const data = await response.json()
        if (!data || data.length === 0) {
          setError(&apos;No menu items available for booking&apos;)
          return
        }
        setMenus(data)
      } catch (error) {
        console.error(&apos;Error fetching menus:&apos;, error)
        setError(error instanceof Error ? error.message : &apos;Failed to load menu items&apos;)
      } finally {
        setLoading(false)
      }
    }
    fetchMenus()
  }, [])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    setError(null)
    try {
      const chosen = menus.find(m => m.id === values.menuItemId)
      if (!chosen) throw new Error(&apos;Selected menu item not found&apos;)
      values.messId = chosen.messId
      
      const res = await fetch(&apos;/api/bookings&apos;, { 
        method: &apos;POST&apos;, 
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; }, 
        body: JSON.stringify(values) 
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || &apos;Failed to create booking&apos;)
      
      router.push(`/booking/success?meal=${encodeURIComponent(chosen.name)}&date=${values.date}&timeSlot=${values.timeSlot}&portionSize=${values.portionSize}`)
    } catch (err) {
      console.error(&apos;Booking error:&apos;, err)
      setError(err instanceof Error ? err.message : &apos;Failed to create booking&apos;)
    } finally {
      setSubmitting(false)
    }
  }

  // Disable past dates
  const today = new Date().toISOString().split(&apos;T&apos;)[0]

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
                  {...register(&apos;menuItemId&apos;)}
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

            <input type="hidden" value={menus[0]?.messId || &apos;&apos;} {...register(&apos;messId&apos;)} />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Date</label>
              <div className="relative">
                <input
                  type="date"
                  {...register(&apos;date&apos;)}
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
                {[&apos;breakfast&apos;, &apos;lunch&apos;, &apos;dinner&apos;].map((slot) => (
                  <label key={slot} className="relative">
                    <input
                      type="radio"
                      {...register(&apos;timeSlot&apos;)}
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
                {[&apos;small&apos;, &apos;regular&apos;, &apos;large&apos;].map((size) => (
                  <label key={size} className="relative">
                    <input
                      type="radio"
                      {...register(&apos;portionSize&apos;)}
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
              className="w-full btn-primary py-3 text-lg relative overflow-hidden disabled:pointer-events-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || submitting || hasEmptyFields}
              onClick={(e) => {
                if (hasEmptyFields) {
                  e.preventDefault()
                  setError(&apos;Please fill in all required fields&apos;)
                }
              }}
            >
              <span className="relative z-10">
                {loading ? &apos;Loading...&apos; : submitting ? &apos;Booking...&apos; : &apos;Book Now&apos;}
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


