const Basket = require('../models/Basket');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getBasket = async (req, res) => {
    try {
        const userId = String(req.query.userId || req.headers['x-user-id'] || 'default-user');

    const basket = await Basket.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, items: [] } },
      { new: true, upsert: true }
    ).populate('items.product');

        res.json(basket);

    } catch (err) {
        console.error('Error fetching basket:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.addToBasket = async (req, res) => { 
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = String(req.query.userId || req.headers['x-user-id'] || 'default-user');

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findById(productId);
        if(!product) {  
            return res.status(404).json({ error: 'Product not found' });
        }

        let basket = await Basket.findOne({ userId });
        if (!basket) {
            basket = new Basket({ userId, items: [] });
        }

        const existingItemIndex = basket.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex >= 0) {
            basket.items[existingItemIndex].quantity += quantity;
        } else {
            basket.items.push({
                product: productId,
                quantity: quantity,
                priceAtAdd: product.price || 0
            });
        }

        await basket.save();
        await basket.populate('items.product');

        res.json(basket);
    } catch (err) {
        console.error('Error adding to basket:', err);
        res.status(500).json({ error: err.message });

    }
};

// Remove product from basket
exports.removeFromBasket = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = String(req.query.userId || req.headers['x-user-id'] || 'default-user');
    
    const basket = await Basket.findOne({ userId });
    if (!basket) {
      return res.status(404).json({ error: 'Basket not found' });
    }
    
    basket.items = basket.items.filter(
      item => item.product.toString() !== productId
    );
    
    await basket.save();
    await basket.populate('items.product');
    
    res.json(basket);
  } catch (error) {
    console.error('Remove from basket error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Update quantity of item in basket
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = String(req.body.userId || req.headers['x-user-id'] || 'default-user');
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity required' });
    }
    
    const basket = await Basket.findOne({ userId });
    if (!basket) {
      return res.status(404).json({ error: 'Basket not found' });
    }
    
    const item = basket.items.find(
      item => item.product.toString() === productId
    );
    
    if (!item) {
      return res.status(404).json({ error: 'Item not in basket' });
    }
    
    item.quantity = quantity;
    
    await basket.save();
    await basket.populate('items.product');
    
    res.json(basket);
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Clear entire basket
exports.clearBasket = async (req, res) => {
  try {
    const userId = String(req.query.userId || req.headers['x-user-id'] || 'default-user');
    
    const basket = await Basket.findOne({ userId });
    if (!basket) {
      return res.status(404).json({ error: 'Basket not found' });
    }
    
    basket.items = [];
    await basket.save();
    
    res.json(basket);
  } catch (error) {
    console.error('Clear basket error:', error);
    res.status(500).json({ error: error.message });
  }
};
