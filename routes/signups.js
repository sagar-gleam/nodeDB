const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Signup = require('../models/Signup');
const bcrypt = require('bcrypt');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('../middleware/authMiddleware')
// app.use(cors({
//   origin: 'https://frond-angular.vercel.app',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

const secretKey = process.env.JWT_SECRET || '05003'; 
app.use(cors())
router.post('/savedata', async (req, res) => {
  try {
    const Signups =  new Signup(req.body);
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
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });

    // Respond with token and user role
    res.json({ token, user });
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

router.put('/promote/:id', authenticateToken, async (req, res) => {
  const userId = req.params;
  console.log(userId)

  try {
    const user = await Signup.findById(userId.id);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's role to admin
    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/remove-admin/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  console.log("userr",userId)

  try {
    // Find the user by ID
    const user = await Signup.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is currently an admin
    if (user.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    // Update the user's role back to a non-admin role (e.g., 'user')
    user.role = 'user'; // Adjust this role based on your app's role structure
    await user.save();

    res.json({ message: 'Admin role removed successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/grant-read-permission/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Signup.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.permissions.read = true;  // Set the role to read
    await user.save();

    res.json({ message: 'Read permission granted successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/grant-write-permission/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Signup.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.permissions.write = true;  // Set the role to read
    await user.save();

    res.json({ message: 'write permission granted successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/grant-delete-permission/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Signup.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.permissions.delete = true;  // Set the role to read
    await user.save();

    res.json({ message: 'write permission granted successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.patch('/grant-revoke-read/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      // Find the user and update their permissions
      const user = await Signup.findById(userId);
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.permissions.read = false; // Revoke read permission
      await user.save();

      res.status(200).json({ message: 'Read permission revoked', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/grant-revoke-write/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      // Find the user and update their permissions
      const user = await Signup.findById(userId);
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.permissions.write = false; // Revoke read permission
      await user.save();

      res.status(200).json({ message: 'write permission revoked', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/grant-revoke-delete/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      // Find the user and update their permissions
      const user = await Signup.findById(userId);
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.permissions.delete = false; // Revoke read permission
      await user.save();

      res.status(200).json({ message: 'write permission revoked', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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


router.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match.' });
  }

  try {
    const user = await Signup.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    user.password = newPassword; // Set new password
    await user.save(); // This will trigger the 'pre' middleware and hash the new password

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


  
  

module.exports = router;
