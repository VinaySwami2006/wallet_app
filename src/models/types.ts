export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  walletId: string;
  balance: number;
  photoUrl?: string;
}

/** A payment card stored in the wallet pouch. */
export interface BankCard {
  id: string;
  holderName: string;
  last4: string;
  brand: 'VISA';
  expiry: string; // '05/29'
  color: readonly [string, string]; // gradient [top, bottom]
  isUserAdded: boolean; // gating: user-added cards are tappable/expandable
  status: 'active' | 'locked';
}

/** Default user-added cards that ship in the wallet deck. */
export function createMockCards(): BankCard[] {
  return [
    {
      id: 'usr-card-1',
      holderName: 'Oliver Bennet',
      last4: '5678',
      brand: 'VISA',
      expiry: '05/29',
      color: ['#EDE9FE', '#8B5CF6'],
      isUserAdded: true,
      status: 'active',
    },
    {
      id: 'usr-card-2',
      holderName: 'Oliver Bennet',
      last4: '4902',
      brand: 'VISA',
      expiry: '11/28',
      color: ['#DBEAFE', '#2563EB'],
      isUserAdded: true,
      status: 'active',
    },
    {
      id: 'usr-card-3',
      holderName: 'Oliver Bennet',
      last4: '0014',
      brand: 'VISA',
      expiry: '03/30',
      color: ['#FDE68A', '#F59E0B'],
      isUserAdded: false,
      status: 'locked',
    },
  ];
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

export function createMockUser(hasAccount: boolean = false): UserProfile {
  if (!hasAccount) {
    return {
      id: 0,
      name: 'Guest',
      email: 'guest@wallet.app',
      phone: '',
      walletId: 'WLT-GUEST000',
      balance: 0,
      photoUrl: undefined,
    };
  }
  return {
    id: 1,
    name: 'Tomasz',
    email: 'tomasz@wallet.app',
    phone: '+1 555 0123',
    walletId: 'WLT-7703948264',
    balance: 12540,
    photoUrl: undefined,
  };
}

export function createMockTransactions(): TransactionModel[] {
  return [
    {
      id: '1',
      name: 'Alice Johnson',
      type: 'Received',
      amount: 250.0,
      date: new Date(Date.now() - 3600000).toISOString(),
      reference: 'TX9821001',
      status: 'Completed',
      description: 'Payment from Alice',
      category: 'Transfer',
    },
    {
      id: '2',
      name: 'Netflix Subscription',
      type: 'Paid',
      amount: 15.99,
      date: new Date(Date.now() - 7200000).toISOString(),
      reference: 'TX9821002',
      status: 'Completed',
      description: 'Monthly subscription',
      category: 'Entertainment',
    },
    {
      id: '3',
      name: 'Bob Williams',
      type: 'Received',
      amount: 1200.0,
      date: new Date(Date.now() - 86400000).toISOString(),
      reference: 'TX9821003',
      status: 'Completed',
      description: 'Freelance payment',
      category: 'Income',
    },
    {
      id: '4',
      name: 'Amazon Purchase',
      type: 'Paid',
      amount: 89.5,
      date: new Date(Date.now() - 172800000).toISOString(),
      reference: 'TX9821004',
      status: 'Completed',
      description: 'Online shopping',
      category: 'Shopping',
    },
    {
      id: '5',
      name: 'Charlie Davis',
      type: 'Paid',
      amount: 45.0,
      date: new Date(Date.now() - 259200000).toISOString(),
      reference: 'TX9821005',
      status: 'Completed',
      description: 'Dinner split',
      category: 'Food',
    },
  ];
}

export function parseTransaction(apiTx: any, userId: number): TransactionModel {
  return {
    id: apiTx.id?.toString() || Date.now().toString(),
    name: apiTx.description || apiTx.name || 'Unknown',
    type: apiTx.senderId === userId ? 'Paid' : 'Received',
    amount: parseFloat(apiTx.amount) || 0,
    date: apiTx.createdAt || new Date().toISOString(),
    reference: apiTx.reference || `TX${Date.now()}`,
    status: apiTx.status || 'Completed',
    description: apiTx.description || '',
    category: apiTx.category || 'Transfer',
  };
}
