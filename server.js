require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: 'https://frond-angular.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/signup', require('./routes/signups'));
app.use('/api/studnets', require('./routes/students'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});