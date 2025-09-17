"use client"
import { useEffect, useState } from &apos;react&apos;

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetch(&apos;/api/inventory&apos;).then(r=>r.json()).then(setItems).finally(()=>setLoading(false)) }, [])
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Inventory</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(it => (
          <div className="card p-4" key={it.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-600">{it.quantityOnHand} {it.unit}</div>
              </div>
              <button className="btn-outline" onClick={async ()=>{
                const res = await fetch(&apos;/api/inventory&apos;, { method: &apos;PATCH&apos;, headers:{&apos;Content-Type&apos;:&apos;application/json&apos;}, body: JSON.stringify({ id: it.id, delta: -1 }) })
                if (res.ok) setItems(items.map(x=> x.id===it.id? { ...x, quantityOnHand: x.quantityOnHand -1}: x))
              }}>-1</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


