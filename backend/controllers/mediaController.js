const compressImage = require("../utils/compressImage");
const Media = require("../models/Media");
const Event = require("../models/Event");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const User = require("../models/User");
const Notification = require("../models/Notification");
const generateAITags = require("../utils/generateAITags");
const compareFaces = require("../utils/compareFaces");
const uploadToS3 = require("../utils/uploadToS3");
const getS3ObjectBuffer = require("../utils/getS3ObjectBuffer");

const attachDisplayUrls = async (mediaItems) => {
  return Promise.all(
    mediaItems.map(async (item) => {
      const mediaObject = item.toObject ? item.toObject() : item;

      if (mediaObject.s3Key) {
        mediaObject.displayUrl = mediaObject.fileUrl;
      } else {
        mediaObject.displayUrl = `http://localhost:5000${mediaObject.fileUrl}`;
      }

      return mediaObject;
    }),
  );
};

// Upload media
const uploadMedia = async (req, res) => {
  try {
    const { eventId, visibility, tags } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (req.user.role === "photographer") {
      const isAssigned = event.assignedPhotographers
        .map((id) => id.toString())
        .includes(req.user._id.toString());

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to upload media for this event",
        });
      }
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const tagList = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0)
      : [];

    const mediaDocs = [];

    for (const file of req.files) {
      const isImage = file.mimetype.startsWith("image/");
      const fileType = isImage ? "image" : "video";

      const filePath = path.join(__dirname, "..", "uploads", file.filename);

      const compressedFilePath = await compressImage(filePath, file);

      const aiTags = await generateAITags(compressedFilePath, fileType);

      const finalTags = Array.from(new Set([...tagList, ...aiTags]));

      const uploadFileData = {
        ...file,
        filename:
          fileType === "image"
            ? `compressed-${path.parse(file.filename).name}.jpg`
            : file.filename,
        mimetype: fileType === "image" ? "image/jpeg" : file.mimetype,
      };

      const uploadedFile = await uploadToS3(compressedFilePath, uploadFileData);

      if (!event.coverImage && fileType === "image") {
        event.coverImage = uploadedFile.fileUrl;
        event.coverImageKey = uploadedFile.s3Key;
        await event.save();
      }

      mediaDocs.push({
        event: eventId,
        uploadedBy: req.user._id,
        fileUrl: uploadedFile.fileUrl,
        s3Key: uploadedFile.s3Key,
        fileName: file.originalname,
        fileType,
        visibility: visibility || event.visibility,
        tags: finalTags,
      });

      if (
        fileType === "image" &&
        compressedFilePath !== filePath &&
        fs.existsSync(compressedFilePath)
      ) {
        fs.unlinkSync(compressedFilePath);
      }
    }
    const savedMedia = await Media.insertMany(mediaDocs);

    res.status(201).json({
      success: true,
      message: "Media uploaded successfully with AI-generated tags",
      count: savedMedia.length,
      media: savedMedia,
    });
  } catch (error) {
    console.error("UPLOAD MEDIA ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload media",
      error: error.message,
    });
  }
};

// Get media by event
const getMediaByEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let canViewPrivate = false;

    const isSameClub =
      req.user.clubName &&
      event.clubName &&
      req.user.clubName === event.clubName;

    const isAssignedPhotographer = event.assignedPhotographers
      .map((id) => id.toString())
      .includes(req.user._id.toString());

    // Overall admin can see all private media
    if (req.user.role === "admin") {
      canViewPrivate = true;
    }

    // Club member can see private media only for their own club event
    if (
      req.user.role === "member" &&
      event.eventScope === "club" &&
      isSameClub
    ) {
      canViewPrivate = true;
    }

    const query = {
      event: req.params.eventId,
    };

    if (!canViewPrivate) {
      query.visibility = "public";
    }

    const media = await Media.find(query)
      .populate("uploadedBy", "name role clubName")
      .populate("event", "title category date eventScope clubName")
      .populate("comments.user", "name role")
      .populate("taggedUsers", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch media",
      error: error.message,
    });
  }
};

// Like or unlike media
const toggleLikeMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = media.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      media.likes = media.likes.filter((id) => id.toString() !== userId);
    } else {
      media.likes.push(req.user._id);
    }

    await media.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Media liked",
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update like",
      error: error.message,
    });
  }
};

// Favourite or unfavourite media
const toggleFavouriteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyFavourited = media.favourites.some(
      (id) => id.toString() === userId,
    );

    if (alreadyFavourited) {
      media.favourites = media.favourites.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      media.favourites.push(req.user._id);
    }

    await media.save();

    res.status(200).json({
      success: true,
      message: alreadyFavourited
        ? "Removed from favourites"
        : "Added to favourites",
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update favourite",
      error: error.message,
    });
  }
};

const addCommentToMedia = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    media.comments.push({
      user: req.user._id,
      text,
    });

    await media.save();

    const updatedMedia = await Media.findById(req.params.id)
      .populate("uploadedBy", "name role clubName")
      .populate("comments.user", "name role");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      media: updatedMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

const downloadMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate("uploadedBy", "name role")
      .populate("event", "title clubName");

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    let fileBuffer;

    if (media.s3Key) {
      fileBuffer = await getS3ObjectBuffer(media.s3Key);
    } else {
      const filePath = path.join(
        __dirname,
        "..",
        media.fileUrl.replace(/^\/+/, ""),
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "File not found on server",
        });
      }

      fileBuffer = fs.readFileSync(filePath);
    }

    if (media.fileType === "video") {
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${media.fileName.replace(/\s+/g, "-")}"`,
      );

      return res.send(fileBuffer);
    }

    const image = sharp(fileBuffer);
    const metadata = await image.metadata();

    const imageWidth = metadata.width || 600;
    const watermarkHeight = Math.max(50, Math.floor(imageWidth * 0.12));
    const fontSize = Math.max(16, Math.floor(imageWidth * 0.045));

    const eventTitle = media.event?.title || "EventVault";
    const clubName = media.event?.clubName || "Campus Event";
    const uploaderRole = media.uploadedBy?.role || "user";

    const watermarkText = `EventVault · ${eventTitle} · ${clubName} · ${uploaderRole}`;

    const safeWatermarkText = watermarkText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const watermarkSvg = `
      <svg width="${imageWidth}" height="${watermarkHeight}">
        <rect
          x="0"
          y="0"
          width="${imageWidth}"
          height="${watermarkHeight}"
          fill="rgba(0,0,0,0.45)"
        />
        <text
          x="20"
          y="${Math.floor(watermarkHeight * 0.65)}"
          font-size="${fontSize}"
          font-family="Arial"
          fill="white"
          font-weight="700"
        >
          ${safeWatermarkText}
        </text>
      </svg>
    `;

    const watermarkedBuffer = await image
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          gravity: "south",
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    const eventName = media.event?.title || "EventVault";
    const cleanEventName = eventName.replace(/\s+/g, "-");
    const cleanFileName = media.fileName.replace(/\s+/g, "-");

    const downloadName = `${cleanEventName}-${cleanFileName}`;

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${downloadName}"`,
    );

    res.send(watermarkedBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to download media",
      error: error.message,
    });
  }
};

const getMyFavourites = async (req, res) => {
  try {
    const media = await Media.find({
      favourites: req.user._id,
    })
      .populate("event", "title eventScope clubName")
      .populate("uploadedBy", "name role clubName")
      .populate("comments.user", "name role")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch favourites",
      error: error.message,
    });
  }
};

const tagUserInMedia = async (req, res) => {
  try {
    const { userId } = req.body;

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const userToTag = await User.findById(userId);

    if (!userToTag) {
      return res.status(404).json({
        success: false,
        message: "User to tag not found",
      });
    }

    const alreadyTagged = media.taggedUsers.some(
      (id) => id.toString() === userId,
    );

    if (!alreadyTagged) {
      media.taggedUsers.push(userId);
      await media.save();

      await Notification.create({
        recipient: userId,
        sender: req.user._id,
        media: media._id,
        type: "tag",
        message: `${req.user.name} tagged you in a media upload.`,
      });
    }

    const updatedMedia = await Media.findById(req.params.id)
      .populate("uploadedBy", "name role clubName")
      .populate("comments.user", "name role")
      .populate("taggedUsers", "name email role");

    res.status(200).json({
      success: true,
      message: alreadyTagged
        ? "User already tagged"
        : "User tagged successfully",
      media: updatedMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to tag user",
      error: error.message,
    });
  }
};

const findMyPhotos = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Reference selfie is required",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const referenceImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      req.file.filename,
    );

    let query = {
      event: eventId,
      fileType: "image",
    };

    if (req.user.role !== "admin") {
      query.visibility = "public";
    }

    if (
      req.user.role === "member" &&
      event.eventScope === "club" &&
      req.user.clubName &&
      event.clubName &&
      req.user.clubName === event.clubName
    ) {
      delete query.visibility;
    }

    const eventImages = await Media.find(query)
      .populate("uploadedBy", "name role clubName")
      .populate("event", "title eventScope clubName");

    const matchedMedia = [];

    for (const media of eventImages) {
      let targetImagePath;

      if (media.s3Key) {
        const s3Buffer = await getS3ObjectBuffer(media.s3Key);

        targetImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          `temp-${Date.now()}-${media._id}.jpg`,
        );

        fs.writeFileSync(targetImagePath, s3Buffer);
      } else {
        targetImagePath = path.join(
          __dirname,
          "..",
          media.fileUrl.replace(/^\/+/, ""),
        );
      }

      if (!fs.existsSync(targetImagePath)) {
        continue;
      }

      const isMatch = await compareFaces(referenceImagePath, targetImagePath);

      if (isMatch) {
        matchedMedia.push(media);
      }

      if (media.s3Key && fs.existsSync(targetImagePath)) {
        fs.unlinkSync(targetImagePath);
      }
    }

    const mediaWithUrls = await attachDisplayUrls(matchedMedia);

    res.status(200).json({
      success: true,
      message: "Face search completed",
      count: mediaWithUrls.length,
      media: mediaWithUrls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to find matching photos",
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedia,
  getMediaByEvent,
  toggleLikeMedia,
  toggleFavouriteMedia,
  findMyPhotos,
  addCommentToMedia,
  downloadMedia,
  getMyFavourites,
  tagUserInMedia,
};
