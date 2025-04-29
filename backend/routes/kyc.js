const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { aadhaar, pan, bankAccount, ifsc, address } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.kyc = { aadhaar, pan, bankAccount, ifsc };
  user.address = address;
  await user.save();

  res.json({ message: 'KYC updated' });
});

module.exports = router;