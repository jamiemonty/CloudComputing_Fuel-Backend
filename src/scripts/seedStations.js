// src/scripts/seedStations.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const FuelStation = require('../models/FuelStation');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
};

const fetchIrishStations = async (city, lat, lng) => {
  const query = `[out:json];node["amenity"="fuel"](around:10000,${lat},${lng});out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  console.log(`Fetching stations near ${city}...`);
  const res = await fetch(url);
  const data = await res.json();
  return data.elements;
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
      const stations = await fetchIrishStations(city.name, city.lat, city.lng);

      for (const station of stations) {
        if (!station.lat || !station.lon || seenIds.has(station.id)) continue;
        seenIds.add(station.id);

        const name = station.tags?.name || station.tags?.brand || 'Fuel Station';
        const address = station.tags?.['addr:street']
          ? `${station.tags['addr:housenumber'] || ''} ${station.tags['addr:street']}, ${station.tags['addr:city'] || city.name}`.trim()
          : city.name;

        await FuelStation.create({
          name,
          address,
          location: {
            type: 'Point',
            coordinates: [station.lon, station.lat]
          },
          prices: {
            petrol: parseFloat((1.70 + Math.random() * 0.25).toFixed(3)),
            diesel: parseFloat((1.60 + Math.random() * 0.25).toFixed(3))
          }
        });

        totalAdded++;
      }

      console.log(`${city.name} done`);
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`\nSeeding complete: ${totalAdded} stations added.`);
    process.exit(0);

  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDB();