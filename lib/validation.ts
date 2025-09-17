import { z } from &apos;zod&apos;

const MAX_NAME_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 500
const MAX_INGREDIENTS_LENGTH = 1000

export const createMenuItemSchema = z.object({
  messId: z.string().min(1, &apos;Mess ID is required&apos;),
  name: z.string()
    .min(1, &apos;Name is required&apos;)
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
    .url(&apos;Invalid image URL&apos;)
    .optional(),
  effectiveFrom: z.string()
    .datetime(&apos;Invalid date format&apos;)
    .optional()
    .transform(date => date ? new Date(date) : undefined)
})

export const TimeSlot = {
  BREAKFAST: &apos;breakfast&apos;,
  LUNCH: &apos;lunch&apos;,
  DINNER: &apos;dinner&apos;
} as const

export const PortionSize = {
  SMALL: &apos;small&apos;,
  REGULAR: &apos;regular&apos;,
  LARGE: &apos;large&apos;
} as const

export const createBookingSchema = z.object({
  menuItemId: z.string().min(1, &apos;Please select a meal from the menu&apos;),
  messId: z.string().min(1, &apos;Mess ID is required&apos;),
  date: z.string().min(1, &apos;Please select your preferred date&apos;)
    .refine(date => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, {
      message: &apos;Booking date must be today or a future date&apos;
    })
    .refine(date => {
      const selected = new Date(date);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      return selected <= maxDate;
    }, {
      message: &apos;Bookings can only be made up to 30 days in advance&apos;
    }),
  timeSlot: z.enum([TimeSlot.BREAKFAST, TimeSlot.LUNCH, TimeSlot.DINNER], {
    required_error: &apos;Please select your preferred meal time&apos;
  })
    .refine(slot => {
      const now = new Date();
      const hour = now.getHours();
      if (slot === TimeSlot.BREAKFAST && hour >= 8) return false;
      if (slot === TimeSlot.LUNCH && hour >= 12) return false;
      if (slot === TimeSlot.DINNER && hour >= 19) return false;
      return true;
    }, {
      message: &apos;This time slot is no longer available for today&apos;
    }),
  portionSize: z.enum([PortionSize.SMALL, PortionSize.REGULAR, PortionSize.LARGE], {
    required_error: &apos;Please select your portion size&apos;
  })
})

export const AttendanceMethod = {
  CARD: &apos;card&apos;,
  BIOMETRIC: &apos;biometric&apos;,
  MANUAL: &apos;manual&apos;
} as const

export const AttendanceStatus = {
  PRESENT: &apos;present&apos;,
  ABSENT: &apos;absent&apos;,
  LATE: &apos;late&apos;
} as const

export const createAttendanceSchema = z.object({
  bookingId: z.string().optional(),
  userId: z.string().min(1, &apos;User ID is required&apos;),
  method: z.enum([AttendanceMethod.CARD, AttendanceMethod.BIOMETRIC, AttendanceMethod.MANUAL], {
    required_error: &apos;Please select an attendance method&apos;
  }),
  status: z.enum([AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE], {
    required_error: &apos;Please select an attendance status&apos;
  }),
  timestamp: z.string().datetime().default(() => new Date().toISOString())
})

export const InvoiceStatus = {
  PENDING: &apos;pending&apos;,
  PAID: &apos;paid&apos;,
  OVERDUE: &apos;overdue&apos;,
  CANCELLED: &apos;cancelled&apos;
} as const

export const createInvoiceSchema = z.object({
  userId: z.string().min(1, &apos;User ID is required&apos;),
  periodStart: z.string().datetime(&apos;Invalid start date&apos;),
  periodEnd: z.string().datetime(&apos;Invalid end date&apos;),
  lineItems: z.array(z.object({
    description: z.string().min(1, &apos;Line item description is required&apos;),
    amount: z.number().positive(&apos;Amount must be positive&apos;),
    quantity: z.number().int().positive(&apos;Quantity must be a positive integer&apos;)
  })).default([]),
  total: z.number()
    .positive(&apos;Total amount must be positive&apos;)
    .transform(val => Math.round(val * 100) / 100), // Round to 2 decimal places
  status: z.enum([InvoiceStatus.PENDING, InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.CANCELLED], {
    required_error: &apos;Please select an invoice status&apos;
  }),
  paidAt: z.string().datetime(&apos;Invalid payment date&apos;).optional(),
  notes: z.string().max(500, &apos;Notes must not exceed 500 characters&apos;).optional()
})


