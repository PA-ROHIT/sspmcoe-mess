"use client"

import * as React from "react"
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type PropsWithChildren = React.PropsWithChildren<{}>

export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideIn: {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 30, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  },
  bounce: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  },
  flip: {
    initial: { rotateX: -15, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: 15, opacity: 0 }
  }
}

interface MotionProps extends PropsWithChildren {
  className?: string
  animation?: keyof typeof animations
  duration?: number
}

export const MotionButton = React.forwardRef<HTMLButtonElement, MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(({ 
  children, 
  className,
  animation = 'scale',
  duration = 0.2,
  ...props
}, ref) => {
  const shouldReduceMotion = useReducedMotion()
  const selectedAnimation = animations[animation]

  return (
    <motion.button
      ref={ref}
      initial={shouldReduceMotion ? false : selectedAnimation.initial}
      animate={shouldReduceMotion ? {} : selectedAnimation.animate}
      exit={shouldReduceMotion ? {} : selectedAnimation.exit}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
})
MotionButton.displayName = "MotionButton"

export const MotionCard = React.forwardRef<HTMLDivElement, MotionProps>(({ 
  children, 
  className,
  animation = 'fadeInUp',
  duration = 0.4 
}, ref) => {
  const shouldReduceMotion = useReducedMotion()
  const selectedAnimation = animations[animation]

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : selectedAnimation.initial}
      animate={shouldReduceMotion ? {} : selectedAnimation.animate}
      exit={shouldReduceMotion ? {} : selectedAnimation.exit}
      transition={{ 
        duration,
        ease: [0.25, 0.1, 0.25, 1.0], // Improved cubic bezier curve
        staggerChildren: 0.1
      }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-md hover:shadow-lg", className)}
    >
      {children}
    </motion.div>
  )
})
MotionCard.displayName = "MotionCard"

export const PageTransition = React.forwardRef<HTMLDivElement, MotionProps>(({ 
  children,
  className,
  animation = 'fadeIn',
  duration = 0.5
}, ref) => {
  const shouldReduceMotion = useReducedMotion()
  const selectedAnimation = animations[animation]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        initial={shouldReduceMotion ? false : selectedAnimation.initial}
        animate={shouldReduceMotion ? {} : selectedAnimation.animate}
        exit={shouldReduceMotion ? {} : selectedAnimation.exit}
        transition={{ 
          duration,
          ease: [0.25, 0.1, 0.25, 1.0],
          staggerChildren: 0.1
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
})
PageTransition.displayName = "PageTransition"


