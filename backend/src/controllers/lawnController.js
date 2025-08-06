const Lawn = require('../models/lawn');

exports.getAllLawns = async (req, res) => {
  try {
    const lawns = await Lawn.findAll();
    res.json(lawns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
