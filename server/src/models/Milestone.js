const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    stage: {
      type: String,
      enum: ['Research', 'Design', 'Prototype', 'Testing', 'Pilot', 'Deployment'],
      required: true,
    },
    order: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: Date },
    completedDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Milestone', milestoneSchema);