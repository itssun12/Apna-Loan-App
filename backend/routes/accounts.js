const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');
const User = require('../models/User');

// Create new account
router.post('/', auth, async (req, res) => {
  try {
    const { accountType } = req.body;
    const userId = req.user.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new account
    const account = new Account({
      user: userId,
      accountType
    });

    await account.save();

    res.status(201).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all accounts for a user
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.userId });
    res.json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get account by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update account status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const account = await Account.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      { status },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 