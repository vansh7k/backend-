const { config } = require('dotenv');
const express = require('express');

config();
const app = express();

app.use(express.json());


app.post('/signup', async (req, res) => {
  const { username, email, password, dateOfBirth } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username cannot be empty" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (!email || !emailRegex.test(email)) {

    return res.status(400).json({ error: "Email cannot be empty or invalid format" });

  }
  
  if (!password || password.length < 8 || password.length > 16) {
    return res.status(400).json({ error: "Password length should be greater than 8 or less than or equal to 16" });
  }


  try {
    res.status(201).json({
      message: "User signed up successfully"
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
