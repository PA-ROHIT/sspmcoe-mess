"use client"
import { useState } from &apos;react&apos;

export default function PaySandboxPage() {
  const [userId, setUserId] = useState(&apos;&apos;)
  const [amount, setAmount] = useState(100)
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Sandbox</h2>
      <form className="card p-4 space-y-3" onSubmit={async (e)=>{e.preventDefault();
        const res = await fetch(&apos;/api/payments/sandbox&apos;, { method: &apos;POST&apos;, headers:{&apos;Content-Type&apos;:&apos;application/json&apos;}, body: JSON.stringify({ userId, amount }) })
        const j = await res.json(); alert(&apos;Payment &apos;+ (res.ok? &apos;OK&apos;:&apos;ERR&apos;) + &apos; &apos; + JSON.stringify(j))
      }}>
        <label className="block text-sm font-medium">User ID</label>
        <input className="w-full rounded border px-3 py-2" value={userId} onChange={(e)=>setUserId(e.target.value)} required />
        <label className="block text-sm font-medium">Amount (paise)</label>
        <input className="w-full rounded border px-3 py-2" type="number" value={amount} onChange={(e)=>setAmount(parseInt(e.target.value||&apos;0&apos;,10))} min={0} />
        <button className="btn-primary">Simulate Pay</button>
      </form>
    </section>
  )
}


