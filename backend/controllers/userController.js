const pool = require("../db/database");

// Get all users
const getUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id,
                name,
                email,
                phone,
                profile_photo,
                status,
                created_at
            FROM users
            ORDER BY id ASC
        `);

        res.json({
            success: true,
            users: result.rows,
        });
    } catch (error) {
        console.error("Error fetching users:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users.",
        });
    }
};

// Get user by Wallet ID
const getUserByWalletId = async (req, res) => {
    try {
        const { walletId } = req.params;

        const result = await pool.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.phone,
                u.profile_photo,
                u.status,
                w.wallet_id,
                w.balance
            FROM users u
            JOIN wallets w ON u.id = w.user_id
            WHERE w.wallet_id = $1
        `, [walletId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User with this Wallet ID was not found.",
            });
        }

        res.json({
            success: true,
            user: result.rows[0],
        });

    } catch (error) {
        console.error(
            "Error finding user by Wallet ID:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to find user.",
        });
    }
};

module.exports = {
    getUsers,
    getUserByWalletId,
};