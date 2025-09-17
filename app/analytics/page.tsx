"use client"
import { useEffect, useState } from &apos;react&apos;

export default function AnalyticsPage() {
  const [data, setData] = useState<any>()
  useEffect(() => { fetch(&apos;/api/analytics&apos;).then(r=>r.json()).then(setData) }, [])
  const prep = data?.prepVsServed
  const low = data?.lowStock || []
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics</h2>
      <div className="card p-4">
        <div className="font-medium">Prep vs Served (last 7 days)</div>
        <div className="text-sm text-gray-700 mt-2">Expected: {prep?.expectedPrep} &nbsp; Served: {prep?.actualServed} &nbsp; Diff: {prep?.discrepancy}</div>
      </div>
      <div className="card p-4">
        <div className="font-medium">Waste Trends (sum/day)</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {data && Object.entries(data.wasteTrends || {}).map(([d, v]: any) => (
            <div key={d} className="rounded border p-2 text-sm">{d}: {v.waste}</div>
          ))}
        </div>
      </div>
      <div className="card p-4">
        <div className="font-medium">Low Stock</div>
        <ul className="mt-2 text-sm list-disc pl-6">
          {low.map((i:any) => <li key={i.id}>{i.name}: {i.qty} (threshold {i.threshold})</li>)}
        </ul>
      </div>
    </section>
  )
}


