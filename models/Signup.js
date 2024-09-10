const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SignupSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  address: { type: String, required: true },
  dob: {
    type: Date,
    required: true,
  },
  password: { type: String, required: true }
});

// Hash password before saving
SignupSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Signup', SignupSchema);
