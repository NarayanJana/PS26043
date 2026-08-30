import SectionLabel from '../../../components/common/SectionLabel';
import {
  Sprout,
  Droplets,
  HeartPulse,
  GraduationCap,
  Bus,
  Zap,
  Recycle,
  ShieldAlert,
} from 'lucide-react';

const domains = [
  { icon: Sprout, label: 'Agriculture', count: 214 },
  { icon: Droplets, label: 'Water & Sanitation', count: 187 },
  { icon: HeartPulse, label: 'Healthcare', count: 203 },
  { icon: GraduationCap, label: 'Education', count: 96 },
  { icon: Bus, label: 'Transport & Mobility', count: 121 },
  { icon: Zap, label: 'Energy', count: 88 },
  { icon: Recycle, label: 'Environment & Waste', count: 176 },
  { icon: ShieldAlert, label: 'Public Safety', count: 119 },
];

export default function ProblemDomains() {
  return (
    <section id="domains" className="py-24 px-6 lg:px-8 border-t border-panelLight">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Problem domains</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink50 mb-14 max-w-xl">
          Every domain, tracked and quantified.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {domains.map((domain) => (
            <div
              key={domain.label}
              className="p-6 bg-panel border border-panelLight rounded-lg hover:border-signal/50 transition-colors group"
            >
              <domain.icon
                className="text-inkMuted group-hover:text-signal transition-colors"
                size={22}
              />
              <h3 className="font-display text-sm font-semibold text-ink50 mt-4">
                {domain.label}
              </h3>
              <p className="font-mono text-xs text-inkMuted mt-1">
                {domain.count} active
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}