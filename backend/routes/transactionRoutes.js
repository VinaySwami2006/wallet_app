const express = require("express");

const {
    createWalletTransfer,
    getUserTransactions,
} = require("../controllers/transactionController");

const router = express.Router();

// Wallet → Wallet transfer
router.post("/wallet-transfer", createWalletTransfer);

// Get transactions for a user
router.get("/user/:userId", getUserTransactions);

module.exports = router;