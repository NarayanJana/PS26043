import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, Users, Check, X } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { getUniversityDashboard } from '../../services/universityService';
import { acceptChallenge, rejectChallenge } from '../../services/challengeService';

const navItems = [{ to: '/university/dashboard', label: 'Dashboard', icon: LayoutDashboard }];

export default function UniversityDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  const load = async () => {
    try {
      const { data } = await getUniversityDashboard();
      setData(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load your dashboard. Does this account have a university profile?'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAccept = async (id) => {
    setActioningId(id);
    try {
      await acceptChallenge(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    try {
      await rejectChallenge(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
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
          University Dashboard
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Challenges matched to your expertise, and your active projects.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Assigned challenges" value={data.stats.assigned} />
          <StatCard label="Recommended" value={data.stats.recommended} accent="text-signal" />
          <StatCard label="Active projects" value={data.stats.activeProjects} accent="text-pulse" />
          <StatCard label="Completed projects" value={data.stats.completedProjects} accent="text-green-400" />
          <StatCard label="Students involved" value={data.stats.studentsInvolved} />
          <StatCard label="Faculty mentors" value={data.stats.facultyMentors} />
        </div>

        <div className="mb-10">
          <h2 className="font-display text-lg font-semibold text-ink50 mb-4">
            Recommended for you
          </h2>
          {data.recommendedChallenges.length === 0 ? (
            <p className="text-sm text-inkMuted">No new recommended challenges right now.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.recommendedChallenges.map((c) => (
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
                    <div className="flex items-center gap-3 text-xs text-inkMuted mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {c.district}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {c.peopleAffected || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      onClick={() => handleAccept(c._id)}
                      className={actioningId === c._id ? 'opacity-50 pointer-events-none' : ''}
                    >
                      <Check size={14} /> Accept
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleReject(c._id)}
                      className={actioningId === c._id ? 'opacity-50 pointer-events-none' : ''}
                    >
                      <X size={14} /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink50 mb-4">
            Assigned challenges
          </h2>
          {data.assignedChallenges.length === 0 ? (
            <p className="text-sm text-inkMuted">
              No challenges assigned yet — accept one above to get started.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.assignedChallenges.map((c) => (
                <Link
                  key={c._id}
                  to={c.project ? `/university/projects/${c.project}` : `/challenges/${c._id}`}
                  className="bg-panel border border-panelLight rounded-lg px-6 py-4 flex items-center justify-between gap-4 hover:border-signal/40"
                >
                  <div className="min-w-0">
                    <span className="text-sm text-ink50 truncate block">{c.title}</span>
                    <div className="flex items-center gap-3 text-xs text-inkMuted mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {c.district}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={c.status} />
                    {!c.project && <span className="text-xs text-signal">Create project →</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}