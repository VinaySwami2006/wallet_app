const pool = require("../db/database");
const crypto = require("crypto");

// Wallet to Wallet transfer
const createWalletTransfer = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            senderWalletId,
            receiverWalletId,
            amount,
            description,
        } = req.body;

        // Basic validation
        if (!senderWalletId || !receiverWalletId || !amount) {
            return res.status(400).json({
                success: false,
                message: "Sender Wallet ID, Receiver Wallet ID and amount are required.",
            });
        }

        const transferAmount = Number(amount);

        if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0.",
            });
        }

        if (senderWalletId === receiverWalletId) {
            return res.status(400).json({
                success: false,
                message: "Sender and receiver wallets cannot be the same.",
            });
        }

        await client.query("BEGIN");

        // Lock sender and receiver wallet rows
        const walletResult = await client.query(
            `
            SELECT
                id,
                user_id,
                wallet_id,
                balance,
                status
            FROM wallets
            WHERE wallet_id IN ($1, $2)
            ORDER BY id
            FOR UPDATE
            `,
            [senderWalletId, receiverWalletId]
        );

        if (walletResult.rows.length !== 2) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Sender or receiver wallet not found.",
            });
        }

        const senderWallet = walletResult.rows.find(
            wallet => wallet.wallet_id === senderWalletId
        );

        const receiverWallet = walletResult.rows.find(
            wallet => wallet.wallet_id === receiverWalletId
        );

        if (senderWallet.status !== "ACTIVE") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Sender wallet is not active.",
            });
        }

        if (receiverWallet.status !== "ACTIVE") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Receiver wallet is not active.",
            });
        }

        // Check balance
        if (Number(senderWallet.balance) < transferAmount) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        // Deduct money from sender
        await client.query(
            `
            UPDATE wallets
            SET
                balance = balance - $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            `,
            [transferAmount, senderWallet.id]
        );

        // Add money to receiver
        await client.query(
            `
            UPDATE wallets
            SET
                balance = balance + $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            `,
            [transferAmount, receiverWallet.id]
        );

        // Generate unique transaction reference
        const referenceNumber =
            "TXN-" + crypto.randomBytes(8).toString("hex").toUpperCase();

        // Create transaction
        const transactionResult = await client.query(
            `
            INSERT INTO transactions (
                reference_number,
                sender_user_id,
                receiver_user_id,
                amount,
                transaction_type,
                destination_type,
                status,
                description,
                completed_at
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                'PAYMENT',
                'WALLET',
                'SUCCESS',
                $5,
                CURRENT_TIMESTAMP
            )
            RETURNING *
            `,
            [
                referenceNumber,
                senderWallet.user_id,
                receiverWallet.user_id,
                transferAmount,
                description || null,
            ]
        );

        const transaction = transactionResult.rows[0];

        // Save transaction destination
        await client.query(
            `
            INSERT INTO transaction_destinations (
                transaction_id,
                destination_type,
                wallet_id
            )
            VALUES ($1, 'WALLET', $2)
            `,
            [transaction.id, receiverWallet.id]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Wallet transfer completed successfully.",
            transaction: {
                id: transaction.id,
                reference_number: transaction.reference_number,
                sender_user_id: transaction.sender_user_id,
                receiver_user_id: transaction.receiver_user_id,
                amount: transaction.amount,
                transaction_type: transaction.transaction_type,
                destination_type: transaction.destination_type,
                status: transaction.status,
                description: transaction.description,
                created_at: transaction.created_at,
                completed_at: transaction.completed_at,
            },
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Wallet transfer error:", error);

        res.status(500).json({
            success: false,
            message: "Wallet transfer failed.",
        });
    } finally {
        client.release();
    }
};
// Get transactions for a user
const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `
            SELECT
                t.id,
                t.reference_number,
                t.sender_user_id,
                t.receiver_user_id,
                t.amount,
                t.transaction_type,
                t.destination_type,
                t.status,
                t.description,
                t.created_at,
                t.completed_at,

                sender.name AS sender_name,
                receiver.name AS receiver_name

            FROM transactions t

            JOIN users sender
                ON t.sender_user_id = sender.id

            JOIN users receiver
                ON t.receiver_user_id = receiver.id

            WHERE t.sender_user_id = $1
               OR t.receiver_user_id = $1

            ORDER BY t.created_at DESC
            `,
            [userId]
        );

        res.json({
            success: true,
            transactions: result.rows,
        });

    } catch (error) {
        console.error("Error fetching user transactions:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions.",
        });
    }
};

module.exports = {
    createWalletTransfer,
    getUserTransactions,
};