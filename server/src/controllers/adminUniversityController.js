const University = require('../models/University');

const getAllUniversitiesAdmin = async (req, res) => {
  try {
    const universities = await University.find()
      .populate('user', 'email isActive')
      .sort({ name: 1 });
    res.status(200).json({ universities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUniversityProfile = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }

    const editableFields = [
      'name',
      'type',
      'district',
      'address',
      'contactPerson',
      'contactEmail',
      'contactPhone',
      'facultyExpertise',
      'researchAreas',
      'labs',
      'innovationCenters',
      'incubationFacilities',
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) university[field] = req.body[field];
    });

    await university.save();
    res.status(200).json({ university });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUniversitiesAdmin, updateUniversityProfile };