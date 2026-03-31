// src/models/Basket.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BasketSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

  items: [{
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    // Store the price at the time of adding to the basket
    priceAtAdd: {
        type: Number,
        required: true
    }
  }],
  // Total price of the basket, calculated from items
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
    timestamps: true
});

// Middleware to calculate total price before saving
BasketSchema.pre('save', function() {
  this.totalPrice = this.items.reduce((total, item) => {
      return total + (item.priceAtAdd * item.quantity);
  }, 0);
});

// Important: module.exports
module.exports = mongoose.model('Basket', BasketSchema);
