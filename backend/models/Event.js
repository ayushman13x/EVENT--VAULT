const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    coverImageKey: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Workshop",
        "Cultural Fest",
        "Sports",
        "Photoshoot",
        "Trip",
        "Competition",
        "Party",
        "Other",
      ],
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    eventScope: {
      type: String,
      enum: ["general", "club"],
      default: "club",
    },

    clubName: {
      type: String,
      default: "",
    },

    assignedPhotographers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    coverImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Event", eventSchema);
