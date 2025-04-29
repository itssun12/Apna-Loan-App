const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate transaction ID before saving
transactionSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const count = await this.constructor.countDocuments();
    this.transactionId = `TXN${String(count + 1).padStart(8, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Transaction', transactionSchema); 