import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, Factory } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import {
  getOpportunities,
  getIndustryDashboard,
  expressInterest,
} from '../../services/industryService';
import { SUPPORT_TYPES } from '../../utils/supportTypes';

const navItems = [{ to: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard }];

export default function IndustryDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTypes, setSelectedTypes] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const load = async () => {
    try {
      const [oppsRes, dashRes] = await Promise.all([getOpportunities(), getIndustryDashboard()]);
      setOpportunities(oppsRes.data.opportunities);
      setDashboard(dashRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load your dashboard. Does this account have an industry profile?'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleType = (projectId, type) => {
    setSelectedTypes((prev) => {
      const current = prev[projectId] || [];
      const next = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, [projectId]: next };
    });
  };

  const handleExpressInterest = async (projectId) => {
    const types = selectedTypes[projectId] || [];
    if (types.length === 0) return;

    setSubmittingId(projectId);
    try {
      await expressInterest(projectId, types);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="p-8 text-inkMuted">Loading...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="p-8 text-red-400 max-w-lg">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-8 max-w-6xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          Industry Dashboard
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Support university-led projects with funding, hardware, or expertise.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Available projects" value={dashboard.stats.available} />
          <StatCard label="Pending interest" value={dashboard.stats.pending} accent="text-inkMuted" />
          <StatCard label="Active collaborations" value={dashboard.stats.active} accent="text-signal" />
          <StatCard label="Completed" value={dashboard.stats.completed} accent="text-green-400" />
        </div>

        {dashboard.supportProvided.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-sm font-semibold text-ink50 mb-3">
              Support provided
            </h2>
            <div className="flex flex-wrap gap-2">
              {dashboard.supportProvided.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] bg-panelLight rounded px-2 py-1 text-pulse"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {['activeCollaborations', 'pendingCollaborations'].map((key) => {
          const list = dashboard[key];
          if (!list || list.length === 0) return null;
          const title = key === 'activeCollaborations' ? 'Active collaborations' : 'Awaiting response';

          return (
            <div key={key} className="mb-10">
              <h2 className="font-display text-lg font-semibold text-ink50 mb-4">{title}</h2>
              <div className="flex flex-col gap-3">
                {list.map((p) => (
                  <Link
                    key={p._id}
                    to={`/university/projects/${p._id}`}
                    className="bg-panel border border-panelLight rounded-lg px-6 py-4 flex items-center justify-between gap-4 hover:border-signal/40"
                  >
                    <div className="min-w-0">
                      <span className="text-sm text-ink50 truncate block">{p.title}</span>
                      <p className="text-xs text-inkMuted mt-1">{p.university?.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {p.supportType.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] bg-panelLight rounded px-1.5 py-0.5 text-inkMuted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <div>
          <h2 className="font-display text-lg font-semibold text-ink50 mb-4">
            Available projects
          </h2>
          {opportunities.length === 0 ? (
            <p className="text-sm text-inkMuted">No new projects available right now.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {opportunities.map((p) => (
                <div key={p._id} className="bg-panel border border-panelLight rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-ink50 font-medium">{p.title}</p>
                      <div className="flex items-center gap-3 text-xs text-inkMuted mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {p.challenge?.district}
                        </span>
                        <span className="flex items-center gap-1">
                          <Factory size={11} /> {p.university?.name}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] uppercase text-inkMuted">
                      {p.challenge?.domain}
                    </span>
                  </div>

                  <p className="text-xs text-inkMuted mb-2">
                    What support can you offer?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {SUPPORT_TYPES.map((type) => {
                      const active = (selectedTypes[p._id] || []).includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleType(p._id, type)}
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

                  <Button
                    variant="primary"
                    onClick={() => handleExpressInterest(p._id)}
                    className={
                      submittingId === p._id || (selectedTypes[p._id] || []).length === 0
                        ? 'opacity-50 pointer-events-none'
                        : ''
                    }
                  >
                    {submittingId === p._id ? 'Submitting...' : 'Express interest'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}