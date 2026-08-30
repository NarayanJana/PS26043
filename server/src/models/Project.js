const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },

    students: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        department: { type: String, trim: true },
      },
    ],

    facultyMentor: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      department: { type: String, trim: true },
    },

    industryPartners: [
      {
        partner: { type: mongoose.Schema.Types.ObjectId, ref: 'IndustryPartner' },
        supportType: [{ type: String }],
        status: {
          type: String,
          enum: ['interested', 'active', 'completed'],
          default: 'interested',
        },
      },
    ],

    status: {
      type: String,
      enum: ['active', 'on_hold', 'completed'],
      default: 'active',
    },

    documents: [
      {
        name: { type: String },
        url: { type: String },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    updates: [
      {
        text: { type: String },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        postedAt: { type: Date, default: Date.now },
      },
    ],

    socialImpact: {
      peopleImpacted: { type: Number, default: 0 },
      description: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);