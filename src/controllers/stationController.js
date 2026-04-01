// src/controllers/stationController.js
const FuelStation = require('../models/FuelStation');

// GET /api/stations - Get all fuel stations
exports.getAllStations = async (req, res) => {
  try {
    const stations = await FuelStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Error while fetching stations', error: err.message });
  }
};

// GET /api/stations/:id - Get single station
exports.getStationById = async (req, res) => {
  try {
    const station = await FuelStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json(station);
  } catch (err) {
    res.status(500).json({ message: 'Error while fetching station', error: err.message });
  }
};

// POST /api/stations - Create new station (Protected)
exports.createStation = async (req, res) => {
  try {
    const { name, address, longitude, latitude, petrol, diesel } = req.body;

    const station = await FuelStation.create({
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      prices: { petrol, diesel }
    });

    res.status(201).json({ message: 'Station created successfully', station });
  } catch (err) {
    res.status(500).json({ message: 'Error while creating station', error: err.message });
  }
};

// PUT /api/stations/:id - Update station (Protected)
exports.updateStation = async (req, res) => {
  try {
    const { name, address, longitude, latitude, petrol, diesel } = req.body;

    const updateData = {
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      prices: { petrol, diesel },
      lastUpdated: Date.now()
    };

    const station = await FuelStation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.json({ message: 'Station updated successfully', station });
  } catch (err) {
    res.status(500).json({ message: 'Error while updating station', error: err.message });
  }
};

// DELETE /api/stations/:id - Delete station (Protected)
exports.deleteStation = async (req, res) => {
  try {
    const station = await FuelStation.findByIdAndDelete(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({ message: 'Station deleted successfully', station });
  } catch (err) {
    res.status(500).json({ message: 'Error while deleting station', error: err.message });
  }
};

// GET /api/stations/nearby?lng=&lat=&maxDistance= - Get nearby stations
exports.getNearbyStations = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const stations = await FuelStation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Error while fetching nearby stations', error: err.message });
  }
};