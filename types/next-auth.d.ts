import 'next-auth'
import { Role } from '@/lib/auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: Role
      collegeEmail?: string
    }
  }

  interface User {
    id: string
    role: Role
    collegeEmail?: string
    name?: string | null
    email?: string | null
  }
}


