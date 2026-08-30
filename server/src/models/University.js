const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    departments: [
      {
        name: { type: String, trim: true },
        expertiseAreas: [{ type: String, trim: true }],
      },
    ],
    facultyExpertise: [{ type: String, trim: true }],
    researchAreas: [{ type: String, trim: true }],
    labs: [{ type: String, trim: true }],
    innovationCenters: [{ type: String, trim: true }],
    incubationFacilities: [{ type: String, trim: true }],
    previousProjects: [
      {
        title: { type: String, trim: true },
        domain: { type: String, trim: true },
        year: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('University', universitySchema);