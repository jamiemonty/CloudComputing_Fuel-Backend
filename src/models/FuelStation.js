
// src/models/Product.js
const mongoose = require('mongoose');

const fuelStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],// 'location.type' must be 'Point' for GEOJSON format
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  prices: {
    petrol: {
      type: Number,
      default: 0
    },
    diesel: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true //adds createdAt and updatedAt fields automatically
});

// This index is what enables finding fuel stations by location using queries  
fuelStationSchema.index({ location: '2dsphere' }); // Create geospatial index for location

module.exports = mongoose.model('FuelStation', fuelStationSchema);
