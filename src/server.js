require('dotenv').config();// Load env vars first
const express = require('express');
const helmet = require('helmet'); // New security import
const cors = require('cors');     // New CORS import
const connectDB = require('./config/db'); // Import DB logic

const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Middleware 
app.use(helmet());           // Protects against common web vulnerabilities
app.use(cors());             // Allows mobile app to talk to this server
app.use(express.json({ limit: '10mb' }));      // Standard for receiving JSON data

connectDB();

// Use Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'Online', 
    message: "Fuel Price Tracker API is running", 
    timestamp: new Date()
   });
});

app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});



