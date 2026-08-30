import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getUsers, updateUser } from '../../services/adminService';
import { adminNavItems } from './adminNavItems';

const ROLES = ['citizen', 'university', 'industry', 'government', 'admin'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    getUsers()
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    try {
      await updateUser(id, { role });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    setSavingId(id);
    try {
      await updateUser(id, { isActive: !isActive });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-8 max-w-6xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">Manage users</h1>
        <p className="text-sm text-inkMuted mb-8">
          Change roles or deactivate accounts across the platform.
        </p>

        {loading ? (
          <p className="text-sm text-inkMuted">Loading...</p>
        ) : (
          <div className="bg-panel border border-panelLight rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-panelLight text-left text-inkMuted font-mono text-xs uppercase">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panelLight">
                {users.map((u) => (
                  <tr key={u._id} className={savingId === u._id ? 'opacity-50' : ''}>
                    <td className="px-6 py-3 text-ink50">{u.name}</td>
                    <td className="px-6 py-3 text-inkMuted">{u.email}</td>
                    <td className="px-6 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-panelLight border border-panelLight rounded-md px-2 py-1 text-xs text-ink50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleToggleActive(u._id, u.isActive)}
                        className={`text-xs rounded px-2 py-1 font-mono uppercase ${
                          u.isActive
                            ? 'text-green-400 border border-green-400/40'
                            : 'text-red-400 border border-red-400/40'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}