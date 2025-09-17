export default function AdminHome() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Admin</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <a className="card p-4 hover:bg-gray-50" href="/admin/users">Users & Roles</a>
        <a className="card p-4 hover:bg-gray-50" href="/admin/mess">Mess Config</a>
        <a className="card p-4 hover:bg-gray-50" href="/admin/mealplans">Meal Plans</a>
        <a className="card p-4 hover:bg-gray-50" href="/admin/settings">Settings</a>
      </div>
    </section>
  )
}


