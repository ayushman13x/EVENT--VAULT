const express = require("express");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  assignPhotographerToEvent
} = require("../controllers/eventController");

const {
  protect,
  optionalAuth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", optionalAuth, getEvents);
router.get("/:id", getEventById);

router.post("/", protect, authorizeRoles("admin"), createEvent);
router.put("/:id", protect, authorizeRoles("admin"), updateEvent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent);
router.put(
  "/:id/assign-photographer",
  protect,
  authorizeRoles("admin"),
  assignPhotographerToEvent
);
module.exports = router;