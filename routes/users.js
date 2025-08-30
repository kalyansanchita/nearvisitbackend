const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const User = require("../models/User"); // ✅ Import the Mongoose User model

const router = express.Router();

// GET /api/users/profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // 👈 remove password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
