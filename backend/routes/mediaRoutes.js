const express = require("express");

const {
  uploadMedia,
  getMediaByEvent,
  toggleLikeMedia,
  toggleFavouriteMedia,
  addCommentToMedia,
  downloadMedia,
    getMyFavourites,
    tagUserInMedia,
        findMyPhotos,
} = require("../controllers/mediaController");

const { protect, authorizeRoles , blockPendingUsers } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorizeRoles("admin", "photographer"),
  blockPendingUsers,
  upload.array("media", 20),
  uploadMedia
);

router.get("/event/:eventId", protect, getMediaByEvent);
router.get("/my/favourites", protect, getMyFavourites);
router.post(
  "/find-my-photos",
  protect,
  blockPendingUsers,
  upload.single("selfie"),
  findMyPhotos
);
router.put("/:id/like", protect, blockPendingUsers, toggleLikeMedia);
router.put("/:id/favourite", protect, blockPendingUsers, toggleFavouriteMedia);
router.post("/:id/comment", protect, blockPendingUsers, addCommentToMedia);
router.post("/:id/tag-user", protect, blockPendingUsers, tagUserInMedia);
router.get("/:id/download", protect, blockPendingUsers, downloadMedia);
module.exports = router;