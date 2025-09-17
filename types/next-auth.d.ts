import &apos;next-auth&apos;
import { Role } from &apos;@/lib/auth&apos;

declare module &apos;next-auth&apos; {
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


