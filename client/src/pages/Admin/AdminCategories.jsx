import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';
import { adminNavItems } from './adminNavItems';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!newName.trim()) return;
    try {
      await createCategory(newName.trim());
      setNewName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add category.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-8 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          Manage categories
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          These appear as domain options when citizens submit a challenge.
        </p>

        <form onSubmit={handleAdd} className="flex gap-2 mb-8">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            className="flex-1 bg-panel border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-signal text-ink text-sm font-medium rounded-md px-4 hover:bg-amber-400"
          >
            <Plus size={15} /> Add
          </button>
        </form>
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-inkMuted">Loading...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <div
                key={c._id}
                className="bg-panel border border-panelLight rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm text-ink50">{c.name}</span>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-red-400 hover:text-red-300"
                  aria-label="Delete category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}