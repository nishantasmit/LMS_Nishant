const Letter = require("../models/Letter");
const User = require("../models/User");

exports.createLetter = async (req, res) => {
  try {
    const { 
      officeDakReceiptNo, 
      rbDoLetterNo, 
      receivedFrom, 
      isDoLetter, 
      receivingDate, 
      letterDate, 
      subject, 
      filePath,
      message,
      receiver, 
      receiverRole, 
      status 
    } = req.body;
    
    console.log('Creating letter with data:', {
      officeDakReceiptNo,
      rbDoLetterNo,
      receivedFrom,
      isDoLetter,
      receivingDate,
      letterDate,
      subject,
      filePath,
      message,
      receiver,
      receiverRole,
      status,
      authenticatedUser: req.user?.username,
      authenticatedRole: req.user?.role
    });
    
    // Check if we have the required user information
    if (!req.user?.username) {
      return res.status(400).json({ 
        message: "User information missing. Please log out and log back in." 
      });
    }
    
    // Use sender and senderRole from request body, fallback to authenticated user
    const letterSender = req.user.username;
    const letterSenderRole = req.user.role;
    
    console.log('Final letter data:', {
      sender: letterSender,
      senderRole: letterSenderRole,
      receiver,
      receiverRole,
      status: status || 'pending'
    });
    
    const newLetter = new Letter({
      officeDakReceiptNo,
      rbDoLetterNo,
      receivedFrom,
      isDoLetter,
      receivingDate,
      letterDate,
      subject,
      filePath,
      message,
      sender: letterSender,
      receiver,
      senderRole: letterSenderRole,
      receiverRole,
      status: status || 'pending'
    });
    await newLetter.save();
    res.status(201).json(newLetter);
  } catch (err) {
    console.error('Error creating letter:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getLetters = async (req, res) => {
  try {
    let query = {};
    
    console.log('Getting letters for user:', {
      username: req.user.username,
      role: req.user.role
    });
    
    // Role-based filtering
    if (req.user.role === 'user') {
      // Users can see:
      // - Letters sent to SSM (live letters)
      // - Letters they sent to GM that are approved (verified by GM)
      // - Letters marked for them by GM (visibleTo)
      query.$or = [
        { senderRole: 'ssm', status: { $ne: 'closed' } },
        { sender: req.user.username, receiverRole: 'gm', status: 'approved' },
        { visibleTo: req.user.username }
      ];
    } else if (req.user.role === 'ssm') {
      // SSM can see letters they sent and letters sent to them
      query.$or = [
        { sender: req.user.username },
        { receiver: req.user.username }
      ];
    } else if (req.user.role === 'gm') {
      // GM can see all letters
      query = {};
    }
    
    console.log('Query for letters:', query);
    
    const letters = await Letter.find(query).sort({ createdAt: -1 });
    
    console.log('Found letters:', {
      count: letters.length,
      letters: letters.map(l => ({
        id: l._id,
        subject: l.subject,
        sender: l.sender,
        receiver: l.receiver,
        status: l.status
      }))
    });
    
    res.json(letters);
  } catch (err) {
    console.error('Error getting letters:', err);
    res.status(500).json({ message: err.message });
  }
};

// New function for GM to mark letters for specific users
exports.markLetterForUsers = async (req, res) => {
  try {
    const { letterId } = req.params;
    const { usernames } = req.body; // Array of usernames to mark the letter for
    
    console.log('Marking letter for users:', {
      letterId,
      usernames,
      gmUser: req.user.username
    });
    
    // Only GM can mark letters for users
    if (req.user.role !== 'gm') {
      return res.status(403).json({ message: "Only GM can mark letters for users" });
    }
    
    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }
    
    // Update the visibleTo field
    letter.visibleTo = usernames || [];
    letter.updatedAt = Date.now();
    await letter.save();
    
    console.log('Letter marked successfully for users:', {
      letterId: letter._id,
      visibleTo: letter.visibleTo
    });
    
    res.json({
      message: "Letter marked successfully for users",
      letter: {
        id: letter._id,
        subject: letter.subject,
        visibleTo: letter.visibleTo
      }
    });
  } catch (err) {
    console.error('Error marking letter for users:', err);
    res.status(500).json({ message: err.message });
  }
};

// New function to get all users for GM to select from
exports.getUsersForMarking = async (req, res) => {
  try {
    // Only GM can access this
    if (req.user.role !== 'gm') {
      return res.status(403).json({ message: "Only GM can access user list" });
    }
    // Fetch all users with role 'user'
    const users = await User.find({ role: 'user' }, 'username role');
    res.json(users);
  } catch (err) {
    console.error('Error getting users for marking:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateLetterStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    
    console.log('Updating letter status:', {
      letterId: req.params.id,
      status,
      comments,
      user: req.user.username
    });
    
    const updateData = { 
      status, 
      updatedAt: Date.now() 
    };
    
    if (comments) {
      updateData.$push = {
        comments: {
          text: comments,
          author: req.user.username
        }
      };
    }
    
    console.log('Update data:', updateData);
    
    const updated = await Letter.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Letter not found" });
    }
    
    console.log('Letter updated successfully:', {
      id: updated._id,
      status: updated.status,
      commentsCount: updated.comments ? updated.comments.length : 0
    });
    
    res.json(updated);
  } catch (err) {
    console.error('Error updating letter status:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getLetterById = async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }
    res.json(letter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addLetterWithFile = async (req, res) => {
  try {
    console.log('addLetterWithFile: req.body:', req.body);
    console.log('addLetterWithFile: req.file:', req.file);
    const letterData = req.body;
    if (req.file) {
      letterData.filePath = req.file.filename;
      console.log('File uploaded and saved as:', req.file.filename);
    } else {
      console.log('No file uploaded');
    }
    letterData.sender = req.user.username;
    letterData.senderRole = req.user.role;
    // Default receiver/role for SSM to GM
    if (!letterData.receiver) letterData.receiver = 'GM';
    if (!letterData.receiverRole) letterData.receiverRole = 'gm';
    const letter = new Letter(letterData);
    await letter.save();
    res.status(201).json(letter);
  } catch (err) {
    console.error('Error adding letter with file:', err);
    res.status(500).json({ message: err.message });
  }
};
