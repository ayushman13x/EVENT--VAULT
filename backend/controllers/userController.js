const User = require("../models/User");

// Get all pending role requests
const getPendingRoleRequests = async (req, res) => {
  try {
    const users = await User.find({
      approvalStatus: "pending",
      requestedRole: { $in: ["member", "photographer"] },
    }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending requests",
      error: error.message,
    });
  }
};

// Approve role request
const approveRoleRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.approvalStatus !== "pending" ||
      !["member", "photographer"].includes(user.requestedRole)
    ) {
      return res.status(400).json({
        success: false,
        message: "This user does not have a pending valid role request",
      });
    }

    user.role = user.requestedRole;
    user.approvalStatus = "approved";
    user.requestedRole = "none";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Role request approved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requestedRole: user.requestedRole,
        approvalStatus: user.approvalStatus,
        clubName: user.clubName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve role request",
      error: error.message,
    });
  }
};

// Reject role request
const rejectRoleRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This user does not have a pending request",
      });
    }

    user.role = "viewer";
    user.approvalStatus = "rejected";
    user.requestedRole = "none";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Role request rejected",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requestedRole: user.requestedRole,
        approvalStatus: user.approvalStatus,
        clubName: user.clubName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject role request",
      error: error.message,
    });
  }
};

const getPhotographers = async (req, res) => {
  try {
    const photographers = await User.find({
      role: "photographer",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: photographers.length,
      photographers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch photographers",
      error: error.message,
    });
  }
};
const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      name: { $regex: search, $options: "i" },
      _id: { $ne: req.user._id },
    })
      .select("name email role clubName")
      .limit(10);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  searchUsers,
  getPhotographers,
};