import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { getAnalytics } from '../../services/governmentService';
import { adminNavItems } from './adminNavItems';

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics({})
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <DashboardLayout navItems={adminNavItems}>
        <div className="p-8 text-inkMuted">Loading platform statistics...</div>
      </DashboardLayout>
    );
  }

  const { stats } = analytics;

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-8 max-w-6xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          Platform Overview
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Overall statistics across the entire platform.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total challenges" value={stats.totalChallenges} />
          <StatCard label="Validated" value={stats.validatedChallenges} accent="text-pulse" />
          <StatCard label="Active projects" value={stats.activeProjects} accent="text-signal" />
          <StatCard label="Completed projects" value={stats.completedProjects} accent="text-green-400" />
          <StatCard label="Deployed solutions" value={stats.deployedSolutions} accent="text-green-400" />
          <StatCard label="Universities involved" value={stats.universitiesInvolved} />
          <StatCard label="Industry partners" value={stats.industryPartners} />
          <StatCard label="Citizens benefited" value={stats.citizensBenefited} accent="text-pulse" />
        </div>
      </div>
    </DashboardLayout>
  );
}