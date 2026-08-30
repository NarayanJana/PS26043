const IndustryPartner = require('../models/IndustryPartner');

const getAllIndustriesAdmin = async (req, res) => {
  try {
    const industries = await IndustryPartner.find()
      .populate('user', 'email isActive')
      .sort({ name: 1 });
    res.status(200).json({ industries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIndustryProfile = async (req, res) => {
  try {
    const industry = await IndustryPartner.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ message: 'Industry partner not found' });
    }

    const editableFields = [
      'name',
      'industryType',
      'address',
      'contactPerson',
      'contactEmail',
      'contactPhone',
      'capabilities',
      'sectorsOfInterest',
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) industry[field] = req.body[field];
    });

    await industry.save();
    res.status(200).json({ industry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllIndustriesAdmin, updateIndustryProfile };