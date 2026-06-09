const express = require("express");

const {
  getPendingRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  getPhotographers,
  searchUsers,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/pending-requests",
  protect,
  authorizeRoles("admin"),
  getPendingRoleRequests
);

router.put(
  "/approve/:id",
  protect,
  authorizeRoles("admin"),
  approveRoleRequest
);

router.put(
  "/reject/:id",
  protect,
  authorizeRoles("admin"),
  rejectRoleRequest
);

router.get(
  "/photographers",
  protect,
  authorizeRoles("admin"),
  getPhotographers
);
router.get("/search", protect, searchUsers);
module.exports = router;