import { z } from 'zod'

const MAX_NAME_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 500
const MAX_INGREDIENTS_LENGTH = 1000

export const createMenuItemSchema = z.object({
  messId: z.string().min(1, 'Mess ID is required'),
  name: z.string()
    .min(1, 'Name is required')
    .max(MAX_NAME_LENGTH, `Name must not exceed ${MAX_NAME_LENGTH} characters`)
    .trim(),
  description: z.string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`)
    .trim()
    .optional(),
  ingredients: z.string()
    .max(MAX_INGREDIENTS_LENGTH, `Ingredients list must not exceed ${MAX_INGREDIENTS_LENGTH} characters`)
    .trim()
    .optional(),
  portionSizes: z.string()
    .trim()
    .optional(),
  dietTags: z.string()
    .trim()
    .optional(),
  image: z.string()
    .url('Invalid image URL')
    .optional(),
  effectiveFrom: z.string()
    .datetime('Invalid date format')
    .optional()
    .transform(date => date ? new Date(date) : undefined)
})

export const TimeSlot = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner'
} as const

export const PortionSize = {
  SMALL: 'small',
  REGULAR: 'regular',
  LARGE: 'large'
} as const

export const createBookingSchema = z.object({
  menuItemId: z.string().min(1, 'Please select a meal from the menu'),
  messId: z.string().min(1, 'Mess ID is required'),
  date: z.string().min(1, 'Please select your preferred date')
    .refine(date => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, {
      message: 'Booking date must be today or a future date'
    })
    .refine(date => {
      const selected = new Date(date);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      return selected <= maxDate;
    }, {
      message: 'Bookings can only be made up to 30 days in advance'
    }),
  timeSlot: z.enum([TimeSlot.BREAKFAST, TimeSlot.LUNCH, TimeSlot.DINNER], {
    required_error: 'Please select your preferred meal time'
  })
    .refine(slot => {
      const now = new Date();
      const hour = now.getHours();
      if (slot === TimeSlot.BREAKFAST && hour >= 8) return false;
      if (slot === TimeSlot.LUNCH && hour >= 12) return false;
      if (slot === TimeSlot.DINNER && hour >= 19) return false;
      return true;
    }, {
      message: 'This time slot is no longer available for today'
    }),
  portionSize: z.enum([PortionSize.SMALL, PortionSize.REGULAR, PortionSize.LARGE], {
    required_error: 'Please select your portion size'
  })
})

export const AttendanceMethod = {
  CARD: 'card',
  BIOMETRIC: 'biometric',
  MANUAL: 'manual'
} as const

export const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
} as const

export const createAttendanceSchema = z.object({
  bookingId: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  method: z.enum([AttendanceMethod.CARD, AttendanceMethod.BIOMETRIC, AttendanceMethod.MANUAL], {
    required_error: 'Please select an attendance method'
  }),
  status: z.enum([AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE], {
    required_error: 'Please select an attendance status'
  }),
  timestamp: z.string().datetime().default(() => new Date().toISOString())
})

export const InvoiceStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
} as const

export const createInvoiceSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  periodStart: z.string().datetime('Invalid start date'),
  periodEnd: z.string().datetime('Invalid end date'),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Line item description is required'),
    amount: z.number().positive('Amount must be positive'),
    quantity: z.number().int().positive('Quantity must be a positive integer')
  })).default([]),
  total: z.number()
    .positive('Total amount must be positive')
    .transform(val => Math.round(val * 100) / 100), // Round to 2 decimal places
  status: z.enum([InvoiceStatus.PENDING, InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.CANCELLED], {
    required_error: 'Please select an invoice status'
  }),
  paidAt: z.string().datetime('Invalid payment date').optional(),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional()
})


