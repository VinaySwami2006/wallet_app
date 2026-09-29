import axios from 'axios';

const BASE_URL = 'http://172.20.10.2:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiService {
  async verifyBankAccount(
  requestId: number,
  ifsc: string,
  accountNumber: string
) {
  const response = await apiClient.post(
    `/api/banks/verify/${requestId}`,
    {
      ifsc,
      accountNumber,
    }
  );

  return response.data;
}
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
    // Get all active banks
  async getBanks() {
    const response = await apiClient.get('/api/banks');
    return response.data;
  }

  // Get bank accounts linked to a user
  async getUserBankAccounts(userId: number) {
    const response = await apiClient.get(`/api/banks/accounts/${userId}`);
    return response.data;
  }

  // Start a bank-link request
  async createBankLinkRequest(userId: number, bankId: number) {
    const response = await apiClient.post('/api/banks/link', {
      userId,
      bankId,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
