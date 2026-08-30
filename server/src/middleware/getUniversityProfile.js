const University = require('../models/University');

const getUniversityProfile = async (req, res, next) => {
  try {
    const university = await University.findOne({ user: req.user._id });
    if (!university) {
      return res.status(404).json({
        message: 'No university profile found for this account',
      });
    }
    req.university = university;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getUniversityProfile;