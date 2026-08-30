const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', protect, getCategories);
router.post('/', protect, authorize('admin'), createCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;