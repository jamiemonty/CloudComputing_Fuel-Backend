require('dotenv').config();// Load env vars first
const express = require('express');
const helmet = require('helmet'); // New security import
const cors = require('cors');     // FIX: You forgot to require cors
const connectDB = require('./config/db'); // Import DB logic


// Import routes
const productRoutes = require('./routes/productRoutes');
const indexRoutes = require('./routes/indexRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Middleware 
app.use(helmet());           // Protects against common web vulnerabilities
app.use(cors());             // Allows your mobile app to talk to this server [cite: 243]
app.use(express.json({ limit: '10mb' }));      // Standard for receiving JSON data, increased limit for base64 images

connectDB();

// Use Routes

app.use('/', indexRoutes);// Handles /api/status
// Mount product routes at the '/products' base path
app.use('/products', productRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
