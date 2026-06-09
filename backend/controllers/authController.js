const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, requestedRole, clubName } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const safeRequestedRole =
      requestedRole === "member" || requestedRole === "photographer"
        ? requestedRole
        : "none";

    const user = await User.create({
  name,
  email,
  password,
  role: "viewer",
  requestedRole: safeRequestedRole,
  approvalStatus:
    safeRequestedRole === "none" ? "not_requested" : "pending",
  clubName: safeRequestedRole === "member" ? clubName : "",
});

    res.status(201).json({
      success: true,
      message:
        safeRequestedRole === "none"
          ? "Account created successfully"
          : "Account created successfully. Your role request is pending admin approval.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requestedRole: user.requestedRole,
        approvalStatus: user.approvalStatus,
        clubName: user.clubName,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};
// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  requestedRole: user.requestedRole,
  approvalStatus: user.approvalStatus,
  clubName: user.clubName,
},
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};