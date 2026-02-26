const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// --- DATABASE SCHEMA ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true},
  price: { type: Number, defualt: 0 },
  description: { type: String }
});
const Product = mongoose.model('Product', productSchema);

// --- ROUTES ---

// Existing Status Route
app.get('/api/status', (req, res) => {
  res.json({ 
    status: "Online",
    message: "AWS Backend is reachable!",
    owner: "Student Name", // Change this to your name!!!
    timestamp: new Date()
  });
});

// Lab task: CREATE a new product
app.post('/products', async (req, res) => {
// Fill in ........
  try {
    const { name, price, description, image } = req.body;
    const newProduct = await Product.create({ name, price, description, image});

    console.log("Data saved to MongoDB:", newProduct);
    res.status(201).json({ message: "Saved successfully!", data: newProduct });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lab task: READ all products
app.get('/products', async (req, res) => {
// Fill in ........
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a product by ID
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// DELETE a product by ID
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });