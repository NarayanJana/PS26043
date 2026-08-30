import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <GitBranch className="text-signal mx-auto mb-4" size={28} />
        <p className="font-mono text-signal text-sm mb-2">404</p>
        <h1 className="font-display text-xl font-semibold text-ink50 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-inkMuted mb-6">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-signal text-ink text-sm font-medium rounded-md px-6 py-2.5 hover:bg-amber-400"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}