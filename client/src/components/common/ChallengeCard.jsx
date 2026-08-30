import { Link } from 'react-router-dom';
import { MapPin, Users, Building2, Factory } from 'lucide-react';
import StatusBadge from './StatusBadge';

const priorityColor = {
  High: 'text-signal border-signal/40',
  Medium: 'text-pulse border-pulse/40',
  Low: 'text-inkMuted border-inkMuted/40',
};

export default function ChallengeCard({ challenge }) {
  const hasIndustry = challenge.projectData?.industryPartners?.length > 0;

  return (
    <Link
      to={`/challenges/${challenge._id}`}
      className="p-6 bg-panel border border-panelLight rounded-lg flex flex-col hover:border-signal/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] uppercase text-inkMuted">
          {challenge.domain}
        </span>
        <span
          className={`font-mono text-[10px] uppercase border rounded px-2 py-0.5 ${
            priorityColor[challenge.priority]
          }`}
        >
          {challenge.priority}
        </span>
      </div>

      <h3 className="font-display text-base font-semibold text-ink50 leading-snug mb-4 flex-1">
        {challenge.title}
      </h3>

      <div className="flex items-center gap-4 text-xs text-inkMuted mb-4 flex-wrap">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {challenge.district}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {challenge.peopleAffected || 0}
        </span>
        {challenge.universityData?.name && (
          <span className="flex items-center gap-1">
            <Building2 size={12} /> {challenge.universityData.name}
          </span>
        )}
        {hasIndustry && (
          <span className="flex items-center gap-1 text-pulse">
            <Factory size={12} /> Industry involved
          </span>
        )}
      </div>

      <div className="pt-4 border-t border-panelLight">
        <StatusBadge status={challenge.status} />
      </div>
    </Link>
  );
}