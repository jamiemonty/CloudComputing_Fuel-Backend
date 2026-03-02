
const mongoose = require('mongoose');
// Mongoose Schema and Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String } // Store Base64 string here
});

const Product = mongoose.model('Product', productSchema);