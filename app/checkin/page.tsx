"use client"
import { useState } from &apos;react&apos;
import { Button } from &apos;@/components/ui/Button&apos;
import { Input } from &apos;@/components/ui/Input&apos;

export default function CheckinPage() {
  const [code, setCode] = useState(&apos;&apos;)
  const [userId, setUserId] = useState(&apos;&apos;)

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Check-in</h2>
      <form className="card p-4 space-y-3" onSubmit={async (e)=>{e.preventDefault();
        const res = await fetch(&apos;/api/attendance&apos;, { method: &apos;POST&apos;, headers: { &apos;Content-Type&apos;:&apos;application/json&apos; }, body: JSON.stringify({ bookingId: code || undefined, userId, method: code ? &apos;qr&apos;:&apos;manual&apos;, status: &apos;present&apos; })});
        if (res.ok) { alert(&apos;Checked-in&apos;); setCode(&apos;&apos;); } else { const j = await res.json(); alert(&apos;Error: &apos;+ JSON.stringify(j.error)) }
      }}>
        <label className="block text-sm font-medium">User ID</label>
        <Input value={userId} onChange={(e)=>setUserId((e.target as HTMLInputElement).value)} placeholder="Your user id (demo)" required />
        <label className="block text-sm font-medium">Enter Code</label>
        <Input value={code} onChange={(e)=>setCode((e.target as HTMLInputElement).value)} placeholder="Scan/enter code" />
        <Button type="submit">Check-in</Button>
      </form>
    </section>
  )
}


