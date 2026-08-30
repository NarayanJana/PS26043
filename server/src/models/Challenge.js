const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    domain: { type: String, trim: true },
    subCategory: { type: String, trim: true },
    district: { type: String, trim: true },
    location: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    peopleAffected: { type: Number, default: 0 },

    media: {
      photos: [{ type: String }],
      videos: [{ type: String }],
      documents: [{ type: String }],
    },

    expectedSolution: { type: String },
    additionalInfo: { type: String },

    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: {
      type: String,
      enum: [
        'submitted',
        'ai_analysis',
        'validated',
        'university_assigned',
        'project_created',
        'prototype',
        'pilot',
        'deployed',
        'rejected',
      ],
      default: 'submitted',
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

    aiAnalysis: {
      category: { type: String },
      subCategory: { type: String },
      summary: { type: String },
      priority: { type: String },
      keywords: [{ type: String }],
      requiredExpertise: [{ type: String }],
      analyzedAt: { type: Date },
    },

    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', default: null },
    similarChallenges: [
      {
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
        similarity: { type: Number },
      },
    ],

    recommendedUniversities: [
      {
        university: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
        matchScore: { type: Number },
        matchedExpertise: [{ type: String }],
      },
    ],

    assignedUniversity: { type: mongoose.Schema.Types.ObjectId, ref: 'University', default: null },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  },
  { timestamps: true }
);

challengeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Challenge', challengeSchema);