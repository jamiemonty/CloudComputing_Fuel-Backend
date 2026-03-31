require('dotenv').config();// Load env vars first
const express = require('express');
const helmet = require('helmet'); // New security import
const cors = require('cors');     // FIX: You forgot to require cors
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db'); // Import DB logic

const productRoutes = require('./routes/productRoutes');
const basketRoutes = require('./routes/basketRoutes');
const statusController = require('./controllers/statusController');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Middleware 
app.use(helmet());           // Protects against common web vulnerabilities
app.use(cors());             // Allows your mobile app to talk to this server [cite: 243]
app.use(express.json({ limit: '10mb' }));      // Standard for receiving JSON data, increased limit for base64 images

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

connectDB();

// Use Routes
app.get('/api/status', statusController.getStatus);
app.use('/products', productRoutes);
app.use('/basket', basketRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
