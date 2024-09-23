const express = require('express');
const router = express.Router();
const { authenticateToken, adminOnly } = require('../middleware/authMiddleware');

// Example route
router.get('/user-role', authenticateToken, adminOnly, (req, res) => {
    const role = req.user.role; // Assuming req.user contains user info
    res.json({ role });
});
module.exports = router;
