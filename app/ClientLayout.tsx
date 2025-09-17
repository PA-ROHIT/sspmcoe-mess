'use client'

import AnimatedLayout from '@/components/AnimatedLayout'
import { ReactNode } from 'react'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <AnimatedLayout>{children}</AnimatedLayout>
}