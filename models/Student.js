  const mongoose = require('mongoose');

  const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    image: { type: String }, // Field to store image path or URL
  });
  

  module.exports = mongoose.model('Student', studentSchema);
