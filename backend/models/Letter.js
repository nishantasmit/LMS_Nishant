const mongoose = require("mongoose");

const LetterSchema = new mongoose.Schema({
  // New letter format fields
  officeDakReceiptNo: { type: String, required: true },
  rbDoLetterNo: { type: String, required: true },
  receivedFrom: { type: String, required: true },
  isDoLetter: { type: Boolean, required: true },
  receivingDate: { type: String, required: true },
  letterDate: { type: String, required: true },
  subject: { type: String, required: true },
  filePath: { type: String }, // For PDF file path
  
  // Legacy fields (keeping for backward compatibility)
  message: { type: String },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "pending_review", "approved", "rejected", "closed"], 
    default: "pending" 
  },
  senderRole: { type: String, enum: ["user", "ssm", "gm"], required: true },
  receiverRole: { type: String, enum: ["ssm", "gm"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comments: [{ 
    text: String, 
    author: String, 
    timestamp: { type: Date, default: Date.now } 
  }],
  // New field for GM to mark letters for specific users
  visibleTo: [{ 
    type: String, // Array of usernames who can see this letter
    default: [] 
  }]
});

module.exports = mongoose.model("Letter", LetterSchema);
