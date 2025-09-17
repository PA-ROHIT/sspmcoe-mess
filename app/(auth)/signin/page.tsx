import { getServerSession } from "next-auth"
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto card p-6 space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="text-sm text-gray-600">Use your college email to receive a magic link.</p>
      <form className="space-y-3" action="/api/auth/signin/email" method="POST">
        <input className="w-full rounded border px-3 py-2" name="email" type="email" placeholder="you@college.edu" required />
        <button className="btn-primary w-full" type="submit">Send sign-in link</button>
      </form>
      <p className="text-xs text-gray-500">By continuing, you agree to our terms.</p>
      <Link className="text-primary-700 text-sm" href="/">Back home</Link>
    </div>
  )
}


