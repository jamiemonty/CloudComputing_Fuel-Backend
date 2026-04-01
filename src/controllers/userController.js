// src/controllers/userController.js
const User = require('../models/User');

// GET /api/users/favourites - Get user's favourite stations
exports.getFavourites = async (req, res) => {
    try {
        // req.user is set by authMiddleware.protect and contains the authenticated user's data
        // populate() replaces the station IDs in favouriteStations with the actual station documents
        const user = await User.findById(req.user._id).populate('favouriteStations');
        res.json(user.favouriteStations);
    } catch (err) {
        res.status(500).json({ message: 'Error while fetching favourite stations', error: err.message });
    }
};

// POST /api/users/favourites - Add a station to user's favourites
exports.addFavourite = async (req, res) => {
    try {
        const { stationId } = req.params;
        const user = await User.findById(req.user._id);

        // Check if station is already in favourites
        if (user.favouriteStations.includes(stationId)) {
            return res.status(400).json({ message: 'Station already in favourites' });
        }

        // $addToSet adds the stationId to the array only if it doesn't already exist
        await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favouriteStations: stationId } },
            { returnDocument: 'after' }
        );
        res.json({ message: 'Station added to favourites' });
    } catch (err) {
        res.status(500).json({ message: 'Error while adding favourite station', error: err.message });
    }
};

// DELETE /api/users/favourites/:stationId - Remove a station from user's favourites
exports.removeFavourite = async (req, res) => {
    try {
        const { stationId } = req.params;

        // $pull removes the stationId from the array if it exists
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favouriteStations: stationId } },
            { returnDocument: 'after' }
        );
        res.json({ message: 'Station removed from favourites' });
    } catch (err) {
        res.status(500).json({ message: 'Error while removing favourite station', error: err.message });
    }
};