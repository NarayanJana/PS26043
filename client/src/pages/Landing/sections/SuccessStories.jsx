import SectionLabel from '../../../components/common/SectionLabel';
import { Quote } from 'lucide-react';

const stories = [
  {
    quote:
      'A citizen report about unsafe school crossings became a research project within three weeks, and a deployed traffic system within five months.',
    name: 'Dr. Anjali Rao',
    role: 'Dept. of Civil Engineering, IIT-adjacent partner university',
  },
  {
    quote:
      'We found a manufacturing partner for our low-cost water sensor through the industry matching, not a cold email.',
    name: 'Faculty-led student team',
    role: 'IoT & Water Management project',
  },
];

export default function SuccessStories() {
  return (
    <section className="py-24 px-6 lg:px-8 border-t border-panelLight bg-panel/40">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Success stories</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {stories.map((s) => (
            <div
              key={s.name}
              className="p-8 bg-panel border border-panelLight rounded-lg"
            >
              <Quote className="text-signal mb-4" size={20} />
              <p className="font-display text-lg text-ink50 leading-relaxed mb-6">
                {s.quote}
              </p>
              <p className="text-sm text-ink50 font-medium">{s.name}</p>
              <p className="text-xs text-inkMuted mt-1">{s.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}