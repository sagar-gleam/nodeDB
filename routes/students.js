// routes/students.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticateToken } = require('../middleware/authMiddleware');
const cors = require('cors');

// Enable CORS if necessary
router.use(cors());

// POST: Save student data
router.post('/savedata', authenticateToken, async (req, res) => {
  try {
    const student = new Student(req.body);
    console.log(req.body)
    await student.save();
    res.status(201).json('Student saved successfully');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Retrieve all student data
router.get('/getdata', authenticateToken, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update student data
router.put('/update/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, mobileNumber, address, dob } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, mobileNumber, address, dob },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete student data
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Search students
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (mobileNumber) {
      query.mobileNumber = { $regex: mobileNumber, $options: 'i' };
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
