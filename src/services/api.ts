import axios from 'axios';

const BASE_URL = 'http://172.16.5.25:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiService {
  async getUserByWalletId(walletId: string) {
    const response = await apiClient.get(`/api/users/wallet/${walletId}`);
    return response.data;
  }

  async getUserTransactions(userId: number) {
    const response = await apiClient.get(`/api/transactions/user/${userId}`);
    return response.data;
  }

  async walletTransfer(
    senderWalletId: string,
    receiverWalletId: string,
    amount: number,
    description: string
  ) {
    const response = await apiClient.post('/api/transactions/wallet-transfer', {
      senderWalletId,
      receiverWalletId,
      amount,
      description,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
