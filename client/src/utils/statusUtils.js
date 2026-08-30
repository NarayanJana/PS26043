export const STATUS_GROUPS = {
  submitted: 'Pending',
  ai_analysis: 'Pending',
  validated: 'Approved',
  university_assigned: 'In Progress',
  project_created: 'In Progress',
  prototype: 'In Progress',
  pilot: 'In Progress',
  deployed: 'Resolved',
  rejected: 'Rejected',
};

export const STATUS_LABELS = {
  submitted: 'Submitted',
  ai_analysis: 'AI Analysis',
  validated: 'Validated',
  university_assigned: 'University Assigned',
  project_created: 'Project Created',
  prototype: 'Prototype',
  pilot: 'Pilot',
  deployed: 'Deployed',
  rejected: 'Rejected',
};

export const STATUS_COLORS = {
  Pending: 'text-inkMuted border-inkMuted/40',
  Approved: 'text-pulse border-pulse/40',
  'In Progress': 'text-signal border-signal/40',
  Resolved: 'text-green-400 border-green-400/40',
  Rejected: 'text-red-400 border-red-400/40',
};

export const getStatusGroup = (status) => STATUS_GROUPS[status] || 'Pending';
export const getStatusLabel = (status) => STATUS_LABELS[status] || status;