import SectionLabel from '../../../components/common/SectionLabel';
import { Target } from 'lucide-react';

export default function Mission() {
  return (
    <section className="py-24 px-6 lg:px-8 border-t border-panelLight">
      <div className="max-w-4xl mx-auto">
        <SectionLabel>Mission</SectionLabel>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="p-3 bg-panel rounded-lg border border-panelLight shrink-0">
            <Target className="text-signal" size={28} />
          </div>
          <p className="font-display text-2xl md:text-3xl leading-snug text-ink50">
            Most societal problems never reach the people equipped to solve
            them. SocioSolve closes that gap — routing every verified challenge to
            the right expertise, and every piece of expertise to a problem
            worth solving.
          </p>
        </div>
      </div>
    </section>
  );
}