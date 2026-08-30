import { GitBranch, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const columns = [
    {
      title: 'Platform',
      links: ['How it works', 'Problem domains', 'Challenge explorer', 'Success stories'],
    },
    {
      title: 'Stakeholders',
      links: ['For citizens', 'For universities', 'For industry', 'For government'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API access', 'Guidelines', 'Support'],
    },
  ];

  return (
    <footer className="bg-panel border-t border-panelLight">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={20} className="text-signal" />
            <span className="font-display font-semibold text-lg text-ink50">
              SocioSolve
            </span>
          </div>
          <p className="text-sm text-inkMuted leading-relaxed max-w-xs">
            A digital bridge connecting citizen-reported challenges to
            university research and industry capability — turning local
            problems into deployed solutions.
          </p>
          <div className="flex items-center gap-2 mt-6 text-sm text-inkMuted">
            <Mail size={14} />
            <span>contact@sociosolve.gov</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-inkMuted">
            <MapPin size={14} />
            <span>National Innovation Cell</span>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-ink50 mb-4">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-inkMuted hover:text-pulse transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-panelLight">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-inkMuted font-mono">
            PS26043 · Problem Statement Reference
          </p>
          <p className="text-xs text-inkMuted">
            © {new Date().getFullYear()} SocioSolve. Built for societal impact.
          </p>
        </div>
      </div>
    </footer>
  );
}