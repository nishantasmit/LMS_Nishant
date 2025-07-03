const express = require("express");
const router = express.Router();
const { createLetter, getLetters, updateLetterStatus, getLetterById, markLetterForUsers, getUsersForMarking, addLetterWithFile } = require("../controllers/letterController");
const auth = require("../middleware/authMiddleware");

// Multer setup for file uploads
const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '../uploads'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  }
});

router.post('/', auth, upload.single('pdf'), addLetterWithFile);
router.get("/", auth, getLetters);
router.get("/:id", auth, getLetterById);
router.put("/:id", auth, updateLetterStatus);

// New routes for GM letter marking functionality
router.post("/:letterId/mark-for-users", auth, markLetterForUsers);
router.get("/users/for-marking", auth, getUsersForMarking);

module.exports = router;
