const express = require('express');
const app = express();
const router = express.Router();
const Signup = require('../models/Signup');
const bcrypt = require('bcrypt');
const cors = require('cors')
app.use(cors({
  origin: 'https://nodedb-7h8s.onrender.com', // Replace with your domain
}))
router.post('/savedata', async (req, res) => {
  try {
    const Signups =  new Signup(req.body);;
    await Signups.save();
    res.status(201).json('success');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Signup.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // If successful, send a success response
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route to get all Signups
router.get('/getdata', async (req, res) => {
  try {
    const Signups = await Signup.find();
    res.json(Signups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Signup
// router.put('/update/:id', async (req, res) => {
//     const { id } = req.params;
//     const { fullName, email, mobileNumber, message } = req.body;
  
//     try {
//       // Find the Signup by ID and update it with new data
//       const updatedSignup = await Signup.findByIdAndUpdate(
//         id,
//         { fullName, email, mobileNumber, message },
//         { new: true } // This option returns the updated document
//       );
  
//       if (!updatedSignup) {
//         return res.status(404).json({ message: 'Signup not found' });
//       }
  
//       res.json(updatedSignup);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });

  //delete api
//   router.delete('/delete/:id', async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       // Find the Signup by ID and delete it
//       const deletedSignup = await Signup.findByIdAndDelete(id);
  
//       if (!deletedSignup) {
//         return res.status(404).json({ message: 'Signup not found' });
//       }
  
//       res.json({ message: 'Signup deleted successfully' });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });

// router.delete('/delete/:id', async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       // Attempt to delete the Signup using deleteOne
//       const result = await Signup.deleteOne({ _id: id });
  
//       if (result.deletedCount === 0) {
//         return res.status(404).json({ message: 'Signup not found' });
//       }
  
//       res.json({ message: 'Signup deleted successfully' });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });
  
  

module.exports = router;
