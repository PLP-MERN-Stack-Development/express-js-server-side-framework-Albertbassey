const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Search route
router.get('/search', searchProductsByName);

// Stats route
router.get('/stats', getProductStats);


// Protected routes
router.post('/', auth, validateProduct, createProduct);
router.put('/:id', auth, validateProduct, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
