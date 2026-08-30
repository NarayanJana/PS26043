const University = require('../models/University');

const getUniversities = async (req, res) => {
  try {
    const universities = await University.find().select('name district');
    res.status(200).json({ universities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUniversities };