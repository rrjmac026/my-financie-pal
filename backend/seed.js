require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password', // You should change this after first login
      role: 'admin'
    };

    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    const admin = new User(adminData);
    await admin.save();

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: password');
    console.log('Please change the password after first login');

  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seedAdmin();