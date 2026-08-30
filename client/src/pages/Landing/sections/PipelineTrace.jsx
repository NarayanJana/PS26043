import SectionLabel from '../../../components/common/SectionLabel';

const stages = [
  'Citizen',
  'Submission',
  'AI Analysis',
  'Validation',
  'University Match',
  'Team Formed',
  'Industry Joins',
  'Prototype',
  'Pilot',
  'Deployment',
  'Social Impact',
];

export default function PipelineTrace() {
  return (
    <section className="py-24 px-6 lg:px-8 border-t border-panelLight bg-panel/40">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Innovation pipeline</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink50 mb-14 max-w-xl">
          Every challenge follows the same traceable path.
        </h2>

        {/* Desktop: horizontal trace */}
        <div className="hidden lg:block relative">
          <div className="absolute top-[13px] left-0 right-0 h-px bg-panelLight" />
          <div className="grid grid-cols-11 gap-2">
            {stages.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center text-center">
                <div
                  className={`w-[27px] h-[27px] rounded-full border-2 flex items-center justify-center z-10 bg-ink ${
                    i === stages.length - 1
                      ? 'border-pulse'
                      : 'border-signal'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === stages.length - 1 ? 'bg-pulse' : 'bg-signal'
                    }`}
                  />
                </div>
                <span className="font-mono text-[11px] text-inkMuted mt-3 leading-tight">
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical trace */}
        <div className="lg:hidden relative pl-8">
          <div className="absolute top-0 bottom-0 left-[13px] w-px bg-panelLight" />
          <div className="flex flex-col gap-8">
            {stages.map((stage, i) => (
              <div key={stage} className="relative flex items-center gap-4">
                <div
                  className={`absolute -left-8 w-[27px] h-[27px] rounded-full border-2 flex items-center justify-center bg-ink ${
                    i === stages.length - 1 ? 'border-pulse' : 'border-signal'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === stages.length - 1 ? 'bg-pulse' : 'bg-signal'
                    }`}
                  />
                </div>
                <span className="font-mono text-sm text-ink50">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}