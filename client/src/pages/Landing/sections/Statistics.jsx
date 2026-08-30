import SectionLabel from '../../../components/common/SectionLabel';

const stats = [
  { value: '1,204', label: 'Challenges submitted' },
  { value: '86', label: 'Universities onboard' },
  { value: '212', label: 'Active projects' },
  { value: '34', label: 'Solutions deployed' },
  { value: '48K+', label: 'Citizens benefited' },
  { value: '91%', label: 'Avg. match confidence' },
];

export default function Statistics() {
  return (
    <section className="py-24 px-6 lg:px-8 border-t border-panelLight bg-panel/40">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Platform, in numbers</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl md:text-5xl font-semibold text-ink50">
                {stat.value}
              </p>
              <p className="text-sm text-inkMuted mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}