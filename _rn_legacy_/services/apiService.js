const BASE_URL = 'http://172.16.5.25:3000';

export const ApiService = {
  // Get user by Wallet ID
  getUserByWalletId: async (walletId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/wallet/${walletId}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('User not found');
    } catch (error) {
      console.warn('ApiService.getUserByWalletId error:', error.message);
      return null;
    }
  },

  // Get user transactions
  getUserTransactions: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/transactions/user/${userId}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to load transactions');
    } catch (error) {
      console.warn('ApiService.getUserTransactions error:', error.message);
      return null;
    }
  },

  // Wallet to Wallet Transfer
  walletTransfer: async ({ senderWalletId, receiverWalletId, amount, description }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/transactions/wallet-transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderWalletId,
          receiverWalletId,
          amount,
          description,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        return data;
      } else {
        throw new Error(data.message || 'Wallet transfer failed');
      }
    } catch (error) {
      console.warn('ApiService.walletTransfer error:', error.message);
      throw error;
    }
  },
};
