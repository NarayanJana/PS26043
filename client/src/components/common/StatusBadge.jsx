import { getStatusGroup, getStatusLabel, STATUS_COLORS } from '../../utils/statusUtils';

export default function StatusBadge({ status }) {
  const group = getStatusGroup(status);
  return (
    <span
      className={`font-mono text-[10px] uppercase border rounded px-2 py-0.5 whitespace-nowrap ${STATUS_COLORS[group]}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}