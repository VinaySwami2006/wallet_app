const pool = require("../db/database");

// Get all active banks
const getBanks = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                id,
                bank_name,
                bank_code
            FROM banks
            WHERE status = 'ACTIVE'
            ORDER BY bank_name
            `
        );

        res.json({
            success: true,
            banks: result.rows,
        });

    } catch (error) {
        console.error("Error fetching banks:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch banks.",
        });
    }
};


// Start a bank-link request
const createBankLinkRequest = async (req, res) => {
    try {
        const { userId, bankId } = req.body;

        // Basic validation
        if (!userId || !bankId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Bank ID are required.",
            });
        }

        // Check user exists
        const userResult = await pool.query(
            `
            SELECT id
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check bank exists and is active
        const bankResult = await pool.query(
            `
            SELECT id, bank_name, bank_code
            FROM banks
            WHERE id = $1
              AND status = 'ACTIVE'
            `,
            [bankId]
        );

        if (bankResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bank not found or inactive.",
            });
        }

        // Check for an existing pending/processing request
        const existingRequest = await pool.query(
            `
            SELECT id, status
            FROM bank_link_requests
            WHERE user_id = $1
              AND bank_id = $2
              AND status IN ('PENDING', 'PROCESSING')
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [userId, bankId]
        );

        if (existingRequest.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "A bank-link request is already in progress.",
                request: existingRequest.rows[0],
            });
        }

        // Create a new pending request
        const requestResult = await pool.query(
            `
            INSERT INTO bank_link_requests (
                user_id,
                bank_id,
                status,
                consent_given_at,
                created_at,
                updated_at
            )
            VALUES (
                $1,
                $2,
                'PENDING',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING
                id,
                user_id,
                bank_id,
                status,
                consent_given_at,
                provider_reference,
                created_at,
                updated_at
            `,
            [userId, bankId]
        );

        res.status(201).json({
            success: true,
            message: "Bank-link request created.",
            request: requestResult.rows[0],
            bank: bankResult.rows[0],
        });

    } catch (error) {
        console.error("Error creating bank-link request:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create bank-link request.",
        });
    }
};
// Get bank accounts for a user
const getUserBankAccounts = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        const result = await pool.query(
            `
            SELECT
                ba.id,
                ba.user_id,
                ba.bank_id,
                b.bank_name,
                b.bank_code,
                ba.account_holder_name,
                ba.account_reference,
                ba.verification_status,
                ba.is_primary,
                ba.created_at,
                ba.updated_at
            FROM bank_accounts ba
            JOIN banks b
                ON ba.bank_id = b.id
            WHERE ba.user_id = $1
            ORDER BY ba.is_primary DESC, ba.created_at DESC
            `,
            [userId]
        );

        res.json({
            success: true,
            accounts: result.rows,
        });

    } catch (error) {
        console.error("Error fetching user bank accounts:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch bank accounts.",
        });
    }
};


module.exports = {
    getBanks,
    createBankLinkRequest,
    getUserBankAccounts,
};