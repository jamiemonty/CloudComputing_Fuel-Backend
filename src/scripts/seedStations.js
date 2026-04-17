// src/scripts/seedStations.js
require('dotenv').config({
  path: './.env'
});
const mongoose = require('mongoose');
const FuelStation = require('../models/FuelStation');

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
};

// Fetch real fuel stations from Google Places API
const fetchStations = async (city, lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=gas_station&key=${GOOGLE_API_KEY}`;
  
  console.log(`Fetching stations near ${city}...`);
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error(`Google API error for ${city}:`, data.status, data.error_message);
    return [];
  }

  return data.results || [];
};

const seedDB = async () => {
  try {
    await connectDB();
    await FuelStation.deleteMany({});
    console.log('Cleared existing stations');

    const cities = [
      { name: 'Dublin',    lat: 53.3498, lng: -6.2603 },
      { name: 'Cork',      lat: 51.8985, lng: -8.4756 },
      { name: 'Limerick',  lat: 52.6638, lng: -8.6267 },
      { name: 'Galway',    lat: 53.2707, lng: -9.0568 },
      { name: 'Waterford', lat: 52.2593, lng: -7.1101 },
      { name: 'Belfast',   lat: 54.5976, lng: -5.9301 },
      { name: 'Cavan',     lat: 53.9900, lng: -7.3600 },
      { name: 'Clare',     lat: 52.8433, lng: -9.3900 },
    ];

    let totalAdded = 0;
    const seenIds = new Set();

    for (const city of cities) {
      const stations = await fetchStations(city.name, city.lat, city.lng);

      for (const place of stations) {
        if (seenIds.has(place.place_id)) continue;
        seenIds.add(place.place_id);

        await FuelStation.create({
          name: place.name,
          address: place.vicinity,
          location: {
            type: 'Point',
            coordinates: [
              place.geometry.location.lng,
              place.geometry.location.lat
            ]
          },
          prices: {
            petrol: parseFloat((1.70 + Math.random() * 0.25).toFixed(3)),
            diesel: parseFloat((1.60 + Math.random() * 0.25).toFixed(3))
          }
        });

        totalAdded++;
      }

      console.log(`${city.name} done - ${stations.length} stations found`);

      // Avoid hitting Google rate limits
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\nSuccessfully added ${totalAdded} real Irish fuel stations!`);
    process.exit(0);

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seedDB();