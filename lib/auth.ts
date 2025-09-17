import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import EmailProvider from 'next-auth/providers/email'
import type { NextAuthOptions } from 'next-auth'

export type Role = 'STUDENT' | 'MANAGER' | 'ADMIN'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || '',
      from: process.env.EMAIL_FROM || ''
    })
  ],
  session: { 
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.role = user.role as Role
        session.user.id = user.id
        session.user.email = user.collegeEmail ?? session.user.email
        session.user.name = user.name
      }
      return session
    },
    async signIn({ user }) {
      if (!user.email) {
        throw new Error('Email is required for authentication')
      }
      return true
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
    signOut: '/signin'
  },
  debug: process.env.NODE_ENV === 'development'
}

export function hasRole(userRole: string | undefined, allowed: Role[]): boolean {
  if (!userRole) return false
  return allowed.includes(userRole as Role)
}

type Session = {
  user?: {
    id?: string
    email?: string
    role?: Role
    name?: string
  }
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user?.id
}

export function getUserRole(session: Session | null): Role | undefined {
  return session?.user?.role
}

export function getSessionUser(session: Session | null) {
  return session?.user
}


