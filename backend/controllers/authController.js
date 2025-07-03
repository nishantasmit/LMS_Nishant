const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.error('ChangePassword: User not found:', username);
      return res.status(404).json({ message: "User not found" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.json({ message: "Password changed" });
  } catch (err) {
    console.error('ChangePassword error:', err);
    res.status(500).json({ message: err.message });
  }
};

// User management functions
exports.createUser = async (req, res) => {
  try {
    // Only SSM and GM can create users
    if (!['ssm', 'gm'].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { username, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", username: newUser.username, role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Only SSM and GM can view users
    if (!['ssm', 'gm'].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({}, { password: 0 }); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Only SSM and GM can update users
    if (!['ssm', 'gm'].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { username, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, role },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Only SSM and GM can delete users
    if (!['ssm', 'gm'].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
