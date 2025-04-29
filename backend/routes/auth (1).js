const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, mobile } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, mobile });
    await user.save();
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.get('/me', async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch {
    res.status(400).json({ message: 'Invalid token' });
  }
});

module.exports = router;