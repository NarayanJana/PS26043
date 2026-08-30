import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FilePlus, MapPin, Users, Bell, Compass } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { getMyChallenges } from '../../services/challengeService';
import { getMyNotifications } from '../../services/notificationService';
import { getStatusGroup } from '../../utils/statusUtils';

const navItems = [
  { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/citizen/submit-challenge', label: 'Submit challenge', icon: FilePlus },
  { to: '/challenges', label: 'Explore challenges', icon: Compass },
];

export default function CitizenDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [challengesRes, notificationsRes] = await Promise.all([
          getMyChallenges(),
          getMyNotifications(),
        ]);
        setChallenges(challengesRes.data.challenges);
        setNotifications(notificationsRes.data.notifications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = challenges.reduce(
    (acc, c) => {
      const group = getStatusGroup(c.status);
      acc.total += 1;
      if (group === 'Pending') acc.pending += 1;
      if (group === 'Approved') acc.approved += 1;
      if (group === 'In Progress') acc.inProgress += 1;
      if (group === 'Resolved') acc.resolved += 1;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, inProgress: 0, resolved: 0 }
  );

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink50">
              Your challenges
            </h1>
            <p className="text-sm text-inkMuted mt-1">
              Track every challenge you've reported, end to end.
            </p>
          </div>
          <Link to="/citizen/submit-challenge">
            <Button variant="primary" icon>
              Submit challenge
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <StatCard label="Total submitted" value={counts.total} />
          <StatCard label="Pending" value={counts.pending} accent="text-inkMuted" />
          <StatCard label="Approved" value={counts.approved} accent="text-pulse" />
          <StatCard label="In progress" value={counts.inProgress} accent="text-signal" />
          <StatCard label="Resolved" value={counts.resolved} accent="text-green-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-panel border border-panelLight rounded-lg">
            <div className="px-6 py-4 border-b border-panelLight">
              <h2 className="font-display text-sm font-semibold text-ink50">
                Recent challenges
              </h2>
            </div>

            {loading ? (
              <p className="p-6 text-sm text-inkMuted">Loading...</p>
            ) : challenges.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-inkMuted mb-4">
                  You haven't submitted a challenge yet.
                </p>
                <Link to="/citizen/submit-challenge">
                  <Button variant="secondary">Submit your first challenge</Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-panelLight">
                {challenges.slice(0, 8).map((c) => (
                  <li
                    key={c._id}
                    className="px-6 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-ink50 truncate">{c.title}</p>
                      <div className="flex items-center gap-3 text-xs text-inkMuted mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {c.district}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {c.peopleAffected}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-panel border border-panelLight rounded-lg">
            <div className="px-6 py-4 border-b border-panelLight flex items-center gap-2">
              <Bell size={16} className="text-inkMuted" />
              <h2 className="font-display text-sm font-semibold text-ink50">
                Notifications
              </h2>
            </div>

            {notifications.length === 0 ? (
              <p className="p-6 text-sm text-inkMuted">
                No notifications yet. You'll see updates here as your
                challenges move through review.
              </p>
            ) : (
              <ul className="divide-y divide-panelLight">
                {notifications.map((n) => (
                  <li key={n._id} className="px-6 py-4">
                    <p className="text-sm text-ink50">{n.title}</p>
                    <p className="text-xs text-inkMuted mt-1">{n.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}