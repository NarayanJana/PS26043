import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getAllIndustries, updateIndustry } from '../../services/adminService';
import { SUPPORT_TYPES } from '../../utils/supportTypes';
import { adminNavItems } from './adminNavItems';

export default function AdminIndustries() {
  const [industries, setIndustries] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    getAllIndustries()
      .then((res) => {
        setIndustries(res.data.industries);
        const initialDrafts = {};
        res.data.industries.forEach((i) => {
          initialDrafts[i._id] = {
            capabilities: i.capabilities || [],
            sectorsOfInterest: (i.sectorsOfInterest || []).join(', '),
          };
        });
        setDrafts(initialDrafts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleCapability = (id, type) => {
    setDrafts((prev) => {
      const current = prev[id].capabilities;
      const next = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, [id]: { ...prev[id], capabilities: next } };
    });
  };

  const handleSectorsChange = (id, value) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], sectorsOfInterest: value } }));
  };

  const handleSave = async (id) => {
    setSavingId(id);
    try {
      const draft = drafts[id];
      await updateIndustry(id, {
        capabilities: draft.capabilities,
        sectorsOfInterest: draft.sectorsOfInterest
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-8 max-w-5xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          Manage industry partners
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Edit each partner's declared capabilities and sectors of interest.
        </p>

        {loading ? (
          <p className="text-sm text-inkMuted">Loading...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {industries.map((i) => (
              <div key={i._id} className="bg-panel border border-panelLight rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-ink50 font-medium">{i.name}</p>
                    <p className="text-xs text-inkMuted">{i.user?.email}</p>
                  </div>
                  <button
                    onClick={() => handleSave(i._id)}
                    className={`text-xs bg-signal text-ink rounded-md px-3 py-1.5 font-medium hover:bg-amber-400 ${
                      savingId === i._id ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {savingId === i._id ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <p className="text-xs text-inkMuted mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {SUPPORT_TYPES.map((type) => {
                    const active = drafts[i._id]?.capabilities.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleCapability(i._id, type)}
                        className={`font-mono text-[11px] rounded px-2 py-1 border transition-colors ${
                          active
                            ? 'bg-signal/10 border-signal/50 text-signal'
                            : 'bg-panelLight border-panelLight text-inkMuted hover:text-ink50'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                <label className="block text-xs text-inkMuted mb-1.5">
                  Sectors of interest (comma-separated)
                </label>
                <input
                  value={drafts[i._id]?.sectorsOfInterest || ''}
                  onChange={(e) => handleSectorsChange(i._id, e.target.value)}
                  className="w-full bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}