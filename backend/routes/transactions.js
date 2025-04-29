const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Create new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, type, description } = req.body;

    // Validate accounts
    const fromAccountDoc = await Account.findOne({
      _id: fromAccount,
      user: req.user.userId
    });

    if (!fromAccountDoc) {
      return res.status(404).json({ message: 'Source account not found' });
    }

    const toAccountDoc = await Account.findById(toAccount);
    if (!toAccountDoc) {
      return res.status(404).json({ message: 'Destination account not found' });
    }

    // Check if source account has sufficient balance
    if (fromAccountDoc.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create transaction
    const transaction = new Transaction({
      fromAccount,
      toAccount,
      amount,
      type,
      description
    });

    // Update account balances
    fromAccountDoc.balance -= amount;
    toAccountDoc.balance += amount;

    // Save all changes
    await Promise.all([
      transaction.save(),
      fromAccountDoc.save(),
      toAccountDoc.save()
    ]);

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions for an account
router.get('/account/:accountId', auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      user: req.user.userId
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: req.params.accountId },
        { toAccount: req.params.accountId }
      ]
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns either the source or destination account
    const fromAccount = await Account.findOne({
      _id: transaction.fromAccount,
      user: req.user.userId
    });

    const toAccount = await Account.findOne({
      _id: transaction.toAccount,
      user: req.user.userId
    });

    if (!fromAccount && !toAccount) {
      return res.status(403).json({ message: 'Not authorized to view this transaction' });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 