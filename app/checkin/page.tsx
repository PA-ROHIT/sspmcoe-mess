"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function CheckinPage() {
  const [code, setCode] = useState('')
  const [userId, setUserId] = useState('')

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Check-in</h2>
      <form className="card p-4 space-y-3" onSubmit={async (e)=>{e.preventDefault();
        const res = await fetch('/api/attendance', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ bookingId: code || undefined, userId, method: code ? 'qr':'manual', status: 'present' })});
        if (res.ok) { alert('Checked-in'); setCode(''); } else { const j = await res.json(); alert('Error: '+ JSON.stringify(j.error)) }
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


