import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getAllUniversities, updateUniversity } from '../../services/adminService';
import { adminNavItems } from './adminNavItems';

const ARRAY_FIELDS = [
  { key: 'facultyExpertise', label: 'Faculty expertise' },
  { key: 'researchAreas', label: 'Research areas' },
  { key: 'labs', label: 'Labs' },
  { key: 'innovationCenters', label: 'Innovation centers' },
  { key: 'incubationFacilities', label: 'Incubation facilities' },
];

export default function AdminUniversities() {
  const [universities, setUniversities] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    getAllUniversities()
      .then((res) => {
        setUniversities(res.data.universities);
        const initialDrafts = {};
        res.data.universities.forEach((u) => {
          initialDrafts[u._id] = {
            facultyExpertise: (u.facultyExpertise || []).join(', '),
            researchAreas: (u.researchAreas || []).join(', '),
            labs: (u.labs || []).join(', '),
            innovationCenters: (u.innovationCenters || []).join(', '),
            incubationFacilities: (u.incubationFacilities || []).join(', '),
          };
        });
        setDrafts(initialDrafts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleFieldChange = (id, field, value) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async (id) => {
    setSavingId(id);
    try {
      const draft = drafts[id];
      const payload = {};
      ARRAY_FIELDS.forEach(({ key }) => {
        payload[key] = draft[key]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      });
      await updateUniversity(id, payload);
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
          Manage universities
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Edit expertise data used for matching. Separate multiple entries with commas.
        </p>

        {loading ? (
          <p className="text-sm text-inkMuted">Loading...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {universities.map((u) => (
              <div key={u._id} className="bg-panel border border-panelLight rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-ink50 font-medium">{u.name}</p>
                    <p className="text-xs text-inkMuted">
                      {u.user?.email} · {u.district}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSave(u._id)}
                    className={`text-xs bg-signal text-ink rounded-md px-3 py-1.5 font-medium hover:bg-amber-400 ${
                      savingId === u._id ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {savingId === u._id ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ARRAY_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-inkMuted mb-1.5">{field.label}</label>
                      <input
                        value={drafts[u._id]?.[field.key] || ''}
                        onChange={(e) => handleFieldChange(u._id, field.key, e.target.value)}
                        className="w-full bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}