const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticateToken } = require('../middleware/authMiddleware');
const cors = require('cors');
const upload = require('../middleware/uploadConfig');

// Enable CORS if necessary
router.use(cors());

// POST: Save student data with image upload
router.post('/addstudent', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, email, mobileNumber, address, dob } = req.body;
    const image = req.file ? req.file.path : null; // Get image path if uploaded

    const student = new Student({
      name,
      email,
      mobileNumber,
      address,
      dob,
      image
    });

    await student.save();
    res.status(201).json('Student saved successfully');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Retrieve all student data
router.get('/getstudent', authenticateToken, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update student data
router.put('/updatestudent/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, email, mobileNumber, address, dob } = req.body;
  const image = req.file ? req.file.path : null;
  const dbData = 
  {
    name, email, mobileNumber, address, dob 
  }
  if(req.file){
    dbData.image = image
  }


  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      dbData,
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
router.delete('/deletestudent/:id', authenticateToken, async (req, res) => {
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
