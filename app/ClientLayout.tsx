&apos;use client&apos;

import AnimatedLayout from &apos;@/components/AnimatedLayout&apos;
import { ReactNode } from &apos;react&apos;

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <AnimatedLayout>{children}</AnimatedLayout>
}