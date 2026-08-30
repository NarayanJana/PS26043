import SectionLabel from '../../../components/common/SectionLabel';
import { FileText, Sparkles, ShieldCheck, Rocket } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Report',
    desc: 'A citizen submits a challenge with location, evidence, and people affected.',
  },
  {
    icon: Sparkles,
    title: 'Analyze',
    desc: 'AI classifies the domain, sets priority, and extracts required expertise.',
  },
  {
    icon: ShieldCheck,
    title: 'Match',
    desc: 'The system ranks universities by expertise overlap — with the reasoning shown.',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    desc: 'A student-faculty team builds with industry support, from prototype to pilot.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-8 border-t border-panelLight">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink50 mb-14 max-w-xl">
          Four stages between a complaint and a solution.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-panelLight rounded-lg overflow-hidden">
          {steps.map((step, i) => (
            <div key={step.title} className="bg-ink p-8">
              <span className="font-mono text-xs text-inkMuted">
                0{i + 1}
              </span>
              <step.icon className="text-pulse my-4" size={24} />
              <h3 className="font-display text-lg font-semibold text-ink50 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-inkMuted leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}