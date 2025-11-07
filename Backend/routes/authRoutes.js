const express = require('express');
const { registerUser, loginUser, profileUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Protected Route: Profile (accessible to specific roles)
router.get('/profile', protect, authorize('Student', 'HOD', 'Admin'), profileUser);

module.exports = router;