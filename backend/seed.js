require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const bcrypt = require('bcryptjs');

const defaultCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#2d8a9e' },
  { name: 'Transportation', icon: '🚗', color: '#5cbdb9' },
  { name: 'Shopping', icon: '🛍️', color: '#1a4a6e' },
  { name: 'Bills & Utilities', icon: '💡', color: '#e85d3a' },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { name: 'Health', icon: '🏥', color: '#10b981' },
  { name: 'Education', icon: '📚', color: '#f59e0b' },
  { name: 'Others', icon: '📦', color: '#6b7280' },
];

const seedData = async () => {
  try {
    await connectDB();

    // Seed admin user
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const adminData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin',
      };

      const salt = await bcrypt.genSalt(10);
      adminData.password = await bcrypt.hash(adminData.password, salt);

      const admin = new User(adminData);
      await admin.save();

      console.log('Admin user created successfully');
      console.log('Email: admin@example.com');
      console.log('Password: password');
      console.log('Please change the password after first login');
    } else {
      console.log('Admin user already exists');
    }

    // Seed categories
    const existingCategories = await Category.countDocuments();
    if (!existingCategories) {
      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded successfully');
    } else {
      console.log('Categories already seeded');
    }
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seedData();