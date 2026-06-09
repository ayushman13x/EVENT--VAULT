const Event = require("../models/Event");
const User = require("../models/User");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      location,
      visibility,
      eventScope,
      clubName,
      assignedPhotographers,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      visibility,
      eventScope,
      clubName,
      assignedPhotographers,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    let query = {
      visibility: "public",
    };

    if (req.user?.role === "admin") {
      query = {};
    }

    if (req.user?.role === "member") {
      query = {
        $or: [
          { visibility: "public" },
          {
            visibility: "private",
            eventScope: "club",
            clubName: req.user.clubName,
          },
        ],
      };
    }

    const events = await Event.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

const assignPhotographerToEvent = async (req, res) => {
  try {
    const { photographerId } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const photographer = await User.findById(photographerId);

    if (!photographer || photographer.role !== "photographer") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not an approved photographer",
      });
    }

    const alreadyAssigned = event.assignedPhotographers.some(
      (id) => id.toString() === photographerId,
    );

    if (!alreadyAssigned) {
      event.assignedPhotographers.push(photographerId);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: alreadyAssigned
        ? "Photographer already assigned to this event"
        : "Photographer assigned successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign photographer",
      error: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  assignPhotographerToEvent,
};
