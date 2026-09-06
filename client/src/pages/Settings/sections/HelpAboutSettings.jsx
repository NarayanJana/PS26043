export default function HelpAboutSettings() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <p className="font-mono text-xs text-inkMuted uppercase mb-2">PS26043</p>
        <h2 className="font-display text-lg font-semibold text-ink50 mb-2">
          SocioSolve — Societal Innovation Collaboration Platform
        </h2>
        <p className="text-sm text-inkMuted leading-relaxed">
          Connecting citizens, government, universities, and industry to transform
          societal challenges into deployable solutions.
        </p>
      </div>

      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <h3 className="font-display text-sm font-semibold text-ink50 mb-4">
          Technology stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-mono text-xs text-inkMuted uppercase mb-1.5">Frontend</p>
            <p className="text-ink50">React, Vite, Tailwind CSS, Redux Toolkit, React Router</p>
          </div>
          <div>
            <p className="font-mono text-xs text-inkMuted uppercase mb-1.5">Backend</p>
            <p className="text-ink50">Node.js, Express, MongoDB, Mongoose, JWT</p>
          </div>
        </div>
      </div>

            <div className="bg-panel border border-panelLight rounded-lg p-6">
        <p className="font-mono text-xs text-inkMuted uppercase mb-1.5">Version</p>
        <p className="text-sm text-ink50">1.0.0</p>
      </div>

      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <h3 className="font-display text-sm font-semibold text-ink50 mb-4">
          Frequently asked questions
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-ink50 mb-1">Who can submit a challenge?</p>
            <p className="text-sm text-inkMuted">
              Any registered citizen account. Universities, industry, and government accounts
              respond to and act on submitted challenges rather than submitting them.
            </p>
          </div>
          <div>
            <p className="text-sm text-ink50 mb-1">How are universities matched to a challenge?</p>
            <p className="text-sm text-inkMuted">
              By comparing the challenge's required expertise against each university's declared
              departments, research areas, and labs — shown as a transparent match percentage with
              the specific overlapping expertise listed.
            </p>
          </div>
          <div>
            <p className="text-sm text-ink50 mb-1">Can I change my role after registering?</p>
            <p className="text-sm text-inkMuted">
              Not from Settings — role changes go through platform administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}