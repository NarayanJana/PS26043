import SectionLabel from '../../../components/common/SectionLabel';
import { User, Building2, Factory, Landmark } from 'lucide-react';

const groups = [
  {
    icon: User,
    title: 'Citizens',
    desc: 'Report a problem in your community and track it through to deployment.',
  },
  {
    icon: Building2,
    title: 'Universities',
    desc: 'Get matched to challenges that fit your department expertise and labs.',
  },
  {
    icon: Factory,
    title: 'Industry',
    desc: 'Support promising research with funding, hardware, or manufacturing.',
  },
  {
    icon: Landmark,
    title: 'Government',
    desc: 'Track validated challenges, active projects, and measurable social impact.',
  },
];

export default function Stakeholders() {
  return (
    <section id="stakeholders" className="py-24 px-6 lg:px-8 border-t border-panelLight">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Stakeholders</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink50 mb-14 max-w-xl">
          Built for everyone in the loop.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {groups.map((g) => (
            <div key={g.title} className="p-6">
              <div className="w-12 h-12 rounded-lg bg-panel border border-panelLight flex items-center justify-center mb-5">
                <g.icon className="text-signal" size={20} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink50 mb-2">
                {g.title}
              </h3>
              <p className="text-sm text-inkMuted leading-relaxed">
                {g.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}