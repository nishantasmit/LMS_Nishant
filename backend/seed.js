const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Define test users
    const users = [
      {
        username: 'user1',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      },
      {
        username: 'ssm1',
        password: await bcrypt.hash('password123', 10),
        role: 'ssm'
      },
      {
        username: 'gm1',
        password: await bcrypt.hash('password123', 10),
        role: 'gm'
      }
    ];

    // Check and create users only if they don't exist
    for (const userData of users) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.username}`);
      } else {
        console.log(`User ${userData.username} already exists, skipping...`);
      }
    }

    console.log('Seed process completed!');
    console.log('\nTest Users:');
    console.log('Username: user1, Password: password123, Role: user');
    console.log('Username: ssm1, Password: password123, Role: ssm');
    console.log('Username: gm1, Password: password123, Role: gm');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers(); 