import { PrismaAdapter } from &apos;@next-auth/prisma-adapter&apos;
import { prisma } from &apos;./prisma&apos;
import EmailProvider from &apos;next-auth/providers/email&apos;
import type { NextAuthOptions } from &apos;next-auth&apos;

export type Role = &apos;STUDENT&apos; | &apos;MANAGER&apos; | &apos;ADMIN&apos;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || &apos;&apos;,
      from: process.env.EMAIL_FROM || &apos;&apos;
    })
  ],
  session: { 
    strategy: &apos;database&apos;,
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
        throw new Error(&apos;Email is required for authentication&apos;)
      }
      return true
    }
  },
  pages: {
    signIn: &apos;/signin&apos;,
    error: &apos;/signin&apos;,
    signOut: &apos;/signin&apos;
  },
  debug: process.env.NODE_ENV === &apos;development&apos;
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


