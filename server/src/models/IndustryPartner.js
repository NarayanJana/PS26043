const mongoose = require('mongoose');

const industryPartnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    industryType: { type: String, trim: true },
    address: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    capabilities: [
      {
        type: String,
        enum: [
          'Funding',
          'Technical Mentorship',
          'Hardware',
          'Software',
          'Testing',
          'Deployment',
          'Manufacturing',
        ],
      },
    ],
    sectorsOfInterest: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('IndustryPartner', industryPartnerSchema);