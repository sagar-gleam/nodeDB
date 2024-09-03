const express = require('express');
const app = express();
const router = express.Router();
const Student = require('../models/Student');
const cors = require('cors')
app.use(cors({
  origin: 'https://nodedb-7h8s.onrender.com', // Replace with your domain
}))
router.post('/savedata', async (req, res) => {
  try {
    const Studentt =  new Student(req.body);;
    await Studentt.save();
    res.status(201).json('success');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/getdata', async (req, res) => {
    try {
        const Studentt = await Student.find();
        res.json(Studentt);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});
  
router.put('/update/:id', async (req, res) => {
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

  router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedContact = await Student.findByIdAndDelete(id);
  
      if (!deletedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/search', async (req, res) => {
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
    } catch (err)  {
      res.status(400).json({ error: err.message });
    }
  });
module.exports = router;