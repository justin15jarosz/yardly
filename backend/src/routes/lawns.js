const express = require('express');
const router = express.Router();
const lawnController = require('../controllers/lawnController');

router.get('/', lawnController.getAllLawns);

module.exports = router;
