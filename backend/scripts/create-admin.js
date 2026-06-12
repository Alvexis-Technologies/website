// You can run this script to create an admin user
// Create file: backend/scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User.model');

// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect('mongodb://root:AnoviBuckoti@127.0.0.1:27017/ardhivision_tz?authSource=admin')

const createAdmin = async () => {
  const admin = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@ardhivision.com',
    password: 'Admin123!',
    role: 'admin',
    isActive: true
  });
  
  await admin.save();
  console.log('Admin user created');
  process.exit();
};

createAdmin();