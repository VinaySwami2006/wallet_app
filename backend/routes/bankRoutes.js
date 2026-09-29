const express = require("express");

const {
    getBanks,
    createBankLinkRequest,
    getUserBankAccounts,
} = require("../controllers/bankController");

const router = express.Router();

// Get all active banks
router.get("/", getBanks);

// Start bank-link request
router.post("/link", createBankLinkRequest);

// Get bank accounts for a user
router.get("/accounts/:userId", getUserBankAccounts);

module.exports = router;