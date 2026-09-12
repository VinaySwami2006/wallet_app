export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  walletId: string;
  balance: number;
  photoUrl?: string;
}

export interface TransactionModel {
  id: string;
  name: string;
  type: 'Received' | 'Paid';
  amount: number;
  date: string;
  reference: string;
  status: string;
  description: string;
  category: string;
}

export const parseTransaction = (
  json: any,
  currentUserId: number
): TransactionModel => {
  const received = json.receiver_user_id?.toString() === currentUserId.toString();

  return {
    id: json.id?.toString() || json.reference_number?.toString() || Date.now().toString(),
    name: (received ? json.sender_name : json.receiver_name) || 'Transaction',
    type: received ? 'Received' : 'Paid',
    amount: parseFloat(json.amount?.toString() || '0'),
    date: json.created_at || new Date().toISOString(),
    reference: json.reference_number || '',
    status: json.status || 'Completed',
    description: json.description || '',
    category: json.category || (received ? 'Transfer' : 'Payment'),
  };
};

export const createMockUser = (): UserProfile => ({
  id: 1,
  name: 'Oliver Bennet',
  email: 'oliver.bennet@example.com',
  phone: '+1 854 793 7420',
  walletId: 'WLT-7703948264',
  balance: 12540000.0,
  photoUrl: '',
});

export const createMockTransactions = (): TransactionModel[] => [
  {
    id: '1',
    name: 'Starbucks',
    type: 'Paid',
    amount: 7.40,
    date: new Date().toISOString(),
    reference: 'TX1001',
    status: 'Completed',
    description: 'Coffee purchase',
    category: 'Purchase',
  },
  {
    id: '2',
    name: 'Incoming Transfer',
    type: 'Received',
    amount: 1850.00,
    date: new Date().toISOString(),
    reference: 'TX1002',
    status: 'Completed',
    description: 'Payment received',
    category: 'Transfer',
  },
  {
    id: '3',
    name: 'Uber Trip',
    type: 'Paid',
    amount: 12.08,
    date: new Date().toISOString(),
    reference: 'TX1003',
    status: 'Completed',
    description: 'Ride payment',
    category: 'Ride',
  },
  {
    id: '4',
    name: 'Mitchell Ramos',
    type: 'Received',
    amount: 200.00,
    date: new Date(Date.now() - 86400000).toISOString(),
    reference: 'TX1004',
    status: 'Completed',
    description: 'Payment received',
    category: 'Transfer',
  },
  {
    id: '5',
    name: 'Whole Foods',
    type: 'Paid',
    amount: 58.32,
    date: new Date(Date.now() - 86400000).toISOString(),
    reference: 'TX1005',
    status: 'Completed',
    description: 'Grocery shopping',
    category: 'Groceries',
  },
  {
    id: '6',
    name: 'Paul Francis',
    type: 'Received',
    amount: 5000.00,
    date: new Date(Date.now() - 86400000).toISOString(),
    reference: 'TX1006',
    status: 'Completed',
    description: 'Payment received',
    category: 'Transfer',
  },
  {
    id: '7',
    name: 'Amazon Marketplace',
    type: 'Paid',
    amount: 84.18,
    date: new Date(Date.now() - 172800000).toISOString(),
    reference: 'TX1007',
    status: 'Completed',
    description: 'Online shopping',
    category: 'Purchase',
  },
];
