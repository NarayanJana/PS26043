import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="text-signal mx-auto mb-4" size={32} />
            <h1 className="font-display text-xl font-semibold text-ink50 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-inkMuted mb-6">
              An unexpected error occurred. Try reloading the page — if it keeps
              happening, the details are in your browser console.
            </p>
            <button
              onClick={() => window.location.assign('/')}
              className="bg-signal text-ink text-sm font-medium rounded-md px-6 py-2.5 hover:bg-amber-400"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}