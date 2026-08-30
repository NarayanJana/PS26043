import SectionLabel from '../../../components/common/SectionLabel';
import { MapPin, Users } from 'lucide-react';

const challenges = [
  {
    title: 'Groundwater depletion in irrigation-dependent villages',
    domain: 'Agriculture',
    district: 'Nashik',
    priority: 'High',
    affected: '3,200',
    status: 'University Assigned',
  },
  {
    title: 'Overflowing storm drains during monsoon season',
    domain: 'Water & Sanitation',
    district: 'Kochi',
    priority: 'High',
    affected: '8,500',
    status: 'Prototype',
  },
  {
    title: 'Last-mile connectivity gap for rural health clinics',
    domain: 'Healthcare',
    district: 'Bikaner',
    priority: 'Medium',
    affected: '1,900',
    status: 'AI Analysis',
  },
];

const priorityColor = {
  High: 'text-signal border-signal/40',
  Medium: 'text-pulse border-pulse/40',
  Low: 'text-inkMuted border-inkMuted/40',
};

export default function FeaturedChallenges() {
  return (
    <section id="challenges" className="py-24 px-6 lg:px-8 border-t border-panelLight">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Featured challenges</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink50 mb-14 max-w-xl">
          Real problems, currently in the pipeline.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <div
              key={c.title}
              className="p-6 bg-panel border border-panelLight rounded-lg flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] uppercase text-inkMuted">
                  {c.domain}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase border rounded px-2 py-0.5 ${priorityColor[c.priority]}`}
                >
                  {c.priority}
                </span>
              </div>

              <h3 className="font-display text-base font-semibold text-ink50 leading-snug mb-4 flex-1">
                {c.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-inkMuted mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {c.district}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {c.affected}
                </span>
              </div>

              <div className="pt-4 border-t border-panelLight">
                <span className="font-mono text-[11px] text-pulse">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}