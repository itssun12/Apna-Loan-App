const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'fixed'],
    default: 'savings'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastTransaction: {
    type: Date,
    default: Date.now
  }
});

// Generate account number before saving
accountSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const count = await this.constructor.countDocuments();
    this.accountNumber = `APNA${String(count + 1).padStart(8, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Account', accountSchema); 