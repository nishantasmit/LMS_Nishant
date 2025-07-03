const express = require("express");
const router = express.Router();
const { loginUser, changePassword, createUser, getUsers, updateUser, deleteUser } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/change-password", auth, changePassword);

// User management routes (SSM and GM only)
router.post("/users", auth, createUser);
router.get("/users", auth, getUsers);
router.put("/users/:id", auth, updateUser);
router.delete("/users/:id", auth, deleteUser);

module.exports = router;
