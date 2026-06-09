const express = require("express");

const {
  getMyNotifications,
  markNotificationsRead,
} = require("../controllers/notificationController");

const { protect ,blockPendingUsers } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, blockPendingUsers, getMyNotifications);
router.put("/mark-read", protect, blockPendingUsers, markNotificationsRead);

module.exports = router;