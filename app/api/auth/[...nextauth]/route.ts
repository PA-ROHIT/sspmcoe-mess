import NextAuth from &apos;next-auth&apos;
import { authOptions } from &apos;@/lib/auth&apos;

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


