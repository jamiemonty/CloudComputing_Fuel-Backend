// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/favourites', protect, userController.getFavourites);
router.post('/favourites/:stationId', protect, userController.addFavourite);
router.delete('/favourites/:stationId', protect, userController.removeFavourite);

module.exports = router;