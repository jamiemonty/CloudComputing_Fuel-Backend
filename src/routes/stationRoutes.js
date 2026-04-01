// src/routes/stationRoutes.js
const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', stationController.getAllStations);
router.get('/nearby', stationController.getNearbyStations);
router.get('/:id', stationController.getStationById);
 


// Protected routes (require JWT auth)
router.post('/', protect, stationController.createStation);
router.put('/:id', protect, stationController.updateStation);
router.delete('/:id', protect, stationController.deleteStation);

module.exports = router;