import { generateToken } from "../lib/utils.js"; // Ensure this generates a token but doesn't interfere with response
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save the user first
    generateToken(newUser._id, res); // Then generate token

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while signing up. Please try again.",
      });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token and set cookie
    generateToken(user._id, res);

    // Respond with user data
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    // Clear JWT cookie
    res.cookie("jwt", "", { httpOnly: true, secure: false, maxAge: 0 }); // Set maxAge to 0 to delete cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // Get the profile picture from the request body
    const userId = req.user._id; // Assuming user is authenticated and user ID is available in the request

    // Check if the profilePic is provided
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload the image to Cloudinary (you can adjust the options based on your requirements)
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "user_profiles", // Optional: specify the folder for cloud storage
      transformation: [{ width: 200, height: 200, crop: "fill" }], // Optional: resize image
    });

    // Update the user's profile with the new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, // Set the secure URL of the uploaded image
      { new: true } // Return the updated user
    );

    // Send the updated user as the response
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated

    const user = await User.findById(userId); // Replace with your model
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
