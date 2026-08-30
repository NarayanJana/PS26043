export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-inkMuted mb-2">{label}</label>
      )}
      <input
        className={`w-full bg-panel border border-panelLight rounded-md px-4 py-2.5 text-sm text-ink50 placeholder:text-inkMuted/60 focus:outline-none focus:border-signal transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}