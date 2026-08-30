export default function Select({ label, children, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-inkMuted mb-2">{label}</label>
      )}
      <select
        className={`w-full bg-panel border border-panelLight rounded-md px-4 py-2.5 text-sm text-ink50 focus:outline-none focus:border-signal transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}