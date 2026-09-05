const express = require("express");

const {
    getUsers,
    getUserByWalletId,
} = require("../controllers/userController");

const router = express.Router();

// Get all users
router.get("/", getUsers);

// Get user by Wallet ID
router.get("/wallet/:walletId", getUserByWalletId);

module.exports = router;