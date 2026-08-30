import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { getChallenges, deleteChallenge } from '../../services/challengeService';
import { adminNavItems } from './adminNavItems';

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    getChallenges({ limit: 50 })
      .then((res) => setChallenges(res.data.challenges))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this challenge permanently? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteChallenge(id);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-8 max-w-6xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          Manage challenges
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Every challenge on the platform, most recent first.
        </p>

        {loading ? (
          <p className="text-sm text-inkMuted">Loading...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {challenges.map((c) => (
              <div
                key={c._id}
                className="bg-panel border border-panelLight rounded-lg px-6 py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <Link
                    to={`/challenges/${c._id}`}
                    className="text-sm text-ink50 hover:text-signal truncate block"
                  >
                    {c.title}
                  </Link>
                  <p className="text-xs text-inkMuted mt-1">
                    {c.district} · {c.domain}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={c.status} />
                  <button
                    onClick={() => handleDelete(c._id)}
                    className={`text-red-400 hover:text-red-300 ${
                      deletingId === c._id ? 'opacity-50 pointer-events-none' : ''
                    }`}
                    aria-label="Delete challenge"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}