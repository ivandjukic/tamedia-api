const express = require('express');
const connectionController = require('../controllers/connection.js');
const router = express.Router();

// [GET] /connections
router.get('/', connectionController.getConnections);

module.exports = router;