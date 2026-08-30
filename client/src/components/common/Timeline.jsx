import { Check } from 'lucide-react';
import { TIMELINE_STAGES, getStageIndex } from '../../utils/timelineUtils';

export default function Timeline({ status }) {
  const currentIndex = getStageIndex(status);
  const isRejected = status === 'rejected';

  return (
    <div className="relative pl-8">
      <div className="absolute top-0 bottom-0 left-[13px] w-px bg-panelLight" />
      <div className="flex flex-col gap-6">
        {TIMELINE_STAGES.map((stage, i) => {
          const done = !isRejected && i <= currentIndex;
          const active = !isRejected && i === currentIndex;
          return (
            <div key={stage.key} className="relative flex items-center gap-4">
              <div
                className={`absolute -left-8 w-[27px] h-[27px] rounded-full border-2 flex items-center justify-center bg-ink ${
                  done ? 'border-pulse' : 'border-panelLight'
                }`}
              >
                {done ? (
                  <Check size={13} className="text-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-panelLight" />
                )}
              </div>
              <span
                className={`text-sm ${
                  active ? 'text-signal font-medium' : done ? 'text-ink50' : 'text-inkMuted'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}