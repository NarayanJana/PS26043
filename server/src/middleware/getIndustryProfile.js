const IndustryPartner = require('../models/IndustryPartner');

const getIndustryProfile = async (req, res, next) => {
  try {
    const industry = await IndustryPartner.findOne({ user: req.user._id });
    if (!industry) {
      return res.status(404).json({
        message: 'No industry profile found for this account',
      });
    }
    req.industry = industry;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getIndustryProfile;