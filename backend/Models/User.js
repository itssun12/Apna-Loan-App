const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  mobile: String,
  password: String,
  kyc: {
    aadhaar: String,
    pan: String,
    bankAccount: String,
    ifsc: String,
  },
  address: String,
});

module.exports = mongoose.model('User', userSchema);