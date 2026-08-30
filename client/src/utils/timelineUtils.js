export const TIMELINE_STAGES = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'ai_analysis', label: 'AI Analysis' },
  { key: 'validated', label: 'Validated' },
  { key: 'university_assigned', label: 'University Assigned' },
  { key: 'project_created', label: 'Project Created' },
  { key: 'prototype', label: 'Prototype' },
  { key: 'pilot', label: 'Pilot' },
  { key: 'deployed', label: 'Deployed' },
];

export const getStageIndex = (status) => {
  const index = TIMELINE_STAGES.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
};