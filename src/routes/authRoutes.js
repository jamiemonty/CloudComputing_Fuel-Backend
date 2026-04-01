const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');

router.get('/', basketController.getBasket);
router.post('/add', basketController.addToBasket);
router.delete('/:productId', basketController.removeFromBasket);
router.put('/:productId', basketController.updateQuantity);
router.delete('/', basketController.clearBasket);

module.exports = router;