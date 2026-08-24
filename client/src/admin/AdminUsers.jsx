import { useEffect, useState } from 'react'
import { api } from '../api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api('/admin/users', { auth: true }).then((d) => setUsers(d.users))
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Users ({users.length})</h1>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3 font-semibold">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
