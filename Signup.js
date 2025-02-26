const { config } = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

config();
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date }
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
  const { username, email, password, dateOfBirth } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username cannot be empty" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
  if (!email || !emailRegex.test(email)) {

    return res.status(400).json({ error: "Email cannot be empty or invalid format" });

  }
  
  if (!password || password.length < 8 || password.length > 16) {
    return res.status(400).json({ error: "Password length should be greater than 8 or less than or equal to 16" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const newUser = new User({

    username,
    email,
    password,      
    dateOfBirth   
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User signed up successfully",
      user: savedUser
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating user",
      details: error.message
    });
  }
});


app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users", details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
