import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { subscribeToToasts } from '../../utils/toastBus';

const ICONS = { error: AlertCircle, success: CheckCircle, info: Info };
const COLORS = {
  error: 'border-red-500/40 text-red-400',
  success: 'border-pulse/40 text-pulse',
  info: 'border-signal/40 text-signal',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    });
    return unsubscribe;
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-80 max-w-[calc(100vw-3rem)]">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`bg-panel border rounded-lg px-4 py-3 flex items-start gap-3 shadow-lg ${COLORS[toast.type]}`}
          >
            <Icon size={16} className="shrink-0 mt-0.5" />
            <p className="text-sm text-ink50 flex-1">{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} className="text-inkMuted hover:text-ink50 shrink-0">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}