const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../uploads/middleware/authMiddleware");

// 👥 FOLLOW / UNFOLLOW
router.put("/follow/:id", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json("You cannot follow yourself");
    }

    const user = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!user.followers.includes(currentUserId)) {
      await user.updateOne({ $push: { followers: currentUserId } });
      await currentUser.updateOne({ $push: { following: targetUserId } });
      res.json("User followed");
    } else {
      await user.updateOne({ $pull: { followers: currentUserId } });
      await currentUser.updateOne({ $pull: { following: targetUserId } });
      res.json("User unfollowed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;