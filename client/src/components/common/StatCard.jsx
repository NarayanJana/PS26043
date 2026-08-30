export default function StatCard({ label, value, accent = 'text-ink50' }) {
  return (
    <div className="bg-panel border border-panelLight rounded-lg p-6">
      <p className={`font-display text-3xl font-semibold ${accent}`}>{value}</p>
      <p className="text-sm text-inkMuted mt-2">{label}</p>
    </div>
  );
}