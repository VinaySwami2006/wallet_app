import axios from 'axios';

// Update this to your backend URL
const BASE_URL = 'http://172.16.5.25:3000';

export const apiService = {
  async getUserByWalletId(walletId: string) {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/wallet/${walletId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async getUserTransactions(userId: number) {
    try {
      const response = await axios.get(`${BASE_URL}/api/transactions/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async walletTransfer(
    senderWalletId: string,
    receiverWalletId: string,
    amount: number,
    description?: string
  ) {
    try {
      const response = await axios.post(`${BASE_URL}/api/transactions/wallet-transfer`, {
        senderWalletId,
        receiverWalletId,
        amount,
        description,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Transfer failed';
      throw new Error(message);
    }
  },
};
