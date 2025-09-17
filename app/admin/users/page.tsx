"use client"
import { useEffect, useState } from &apos;react&apos;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  useEffect(()=>{ fetch(&apos;/api/admin/users&apos;).then(r=>r.json()).then(setUsers) },[])
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Users & Roles</h2>
      <div className="card p-4">
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">Name</th><th className="text-left">Email</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td>{u.name}</td>
                <td>{u.collegeEmail}</td>
                <td>{u.role}</td>
                <td>
                  <select className="border rounded px-2 py-1" defaultValue={u.role} onChange={async (e)=>{
                    const role = e.target.value
                    const res = await fetch(&apos;/api/admin/users&apos;, { method: &apos;PATCH&apos;, headers:{&apos;Content-Type&apos;:&apos;application/json&apos;}, body: JSON.stringify({ id: u.id, role }) })
                    if (res.ok) setUsers(users.map(x=> x.id===u.id? {...x, role}: x))
                  }}>
                    <option>STUDENT</option>
                    <option>MANAGER</option>
                    <option>ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}


