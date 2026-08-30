import { ArrowRight, Radio } from 'lucide-react';
import Button from '../../../components/common/Button';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-40 pb-28 px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#8794AC 1px, transparent 1px), linear-gradient(90deg, #8794AC 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-pulse border border-pulse/30 rounded-full px-4 py-1.5 mb-8">
          <Radio size={12} className="animate-pulse" />
          LIVE: 1,204 CHALLENGES BEING ANALYZED
        </div>

        <h1 className="font-display font-semibold text-4xl md:text-6xl leading-[1.1] text-ink50 mb-6">
          A local problem is a national{' '}
          <span className="text-signal">research opportunity</span>{' '}
          waiting to be matched.
        </h1>

        <p className="text-lg text-inkMuted max-w-2xl mx-auto mb-10 leading-relaxed">
          SocioSolve turns citizen-reported challenges into structured briefs, AI-matches
          them to the universities best equipped to solve them, and pairs the
          resulting research with industry partners — from first report to
          deployed pilot.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button variant="primary" icon>
              Report a challenge
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="secondary">See how it works</Button>
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-x-10 gap-y-4 flex-wrap font-mono text-xs text-inkMuted">
          <span>1,204 challenges submitted</span>
          <span className="text-panelLight">/</span>
          <span>86 universities onboard</span>
          <span className="text-panelLight">/</span>
          <span>212 active projects</span>
          <span className="text-panelLight">/</span>
          <span>34 deployed solutions</span>
        </div>
      </div>
    </section>
  );
}