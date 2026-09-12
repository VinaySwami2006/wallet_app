import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import { AppColors, BorderRadius } from './src/theme/colors';
import { UserProfile, TransactionModel, createMockUser, createMockTransactions, parseTransaction } from './src/models/types';
import { apiService } from './src/services/api';

import { OnboardingWelcomeScreen } from './src/screens/OnboardingWelcomeScreen';
import { FinanceHomeScreen } from './src/screens/FinanceHomeScreen';
import { CardsAndWalletScreen } from './src/screens/CardsAndWalletScreen';
import { TransactionHistoryScreen } from './src/screens/TransactionHistoryScreen';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState<UserProfile>(createMockUser());
  const [transactions, setTransactions] = useState<TransactionModel[]>(createMockTransactions());
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [sendMoneyModal, setSendMoneyModal] = useState(false);
  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [transactionDetailModal, setTransactionDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionModel | null>(null);

  // Send Money Form
  const [sendName, setSendName] = useState('');
  const [sendWalletId, setSendWalletId] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Add Money Form
  const [addAmount, setAddAmount] = useState('');

  useEffect(() => {
    checkOnboarding();
    fetchBackendData();
  }, []);

  const checkOnboarding = async () => {
    try {
      const seen = await AsyncStorage.getItem('seen_onboarding');
      setShowOnboarding(!seen);
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('seen_onboarding', 'true');
    setShowOnboarding(false);
  };

  const fetchBackendData = async () => {
    try {
      const userData = await apiService.getUserByWalletId('WLT-7703948264');
      const txData = await apiService.getUserTransactions(1);

      if (userData.user) {
        setUser({
          ...user,
          name: userData.user.name || user.name,
          email: userData.user.email || user.email,
          phone: userData.user.phone || user.phone,
          balance: parseFloat(userData.user.balance) || user.balance,
        });
      }

      if (txData.transactions && Array.isArray(txData.transactions)) {
        const parsed = txData.transactions.map((t: any) => parseTransaction(t, user.id));
        if (parsed.length > 0) {
          setTransactions(parsed);
        }
      }
    } catch (error) {
      console.log('Backend sync notice:', error);
    }
  };

  const openSendMoneyModal = (defaultName = '', defaultWalletId = '') => {
    setSendName(defaultName);
    setSendWalletId(defaultWalletId);
    setSendAmount('');
    setSendMoneyModal(true);
  };

  const handleSendMoney = async () => {
    const amount = parseFloat(sendAmount);

    if (!sendName.trim() || !sendWalletId.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please fill all fields accurately.');
      return;
    }

    if (amount > user.balance) {
      Alert.alert('Error', 'Insufficient wallet balance.');
      return;
    }

    setSendMoneyModal(false);
    setIsSending(true);

    try {
      await apiService.walletTransfer(user.walletId, sendWalletId, amount, `Payment to ${sendName}`);
    } catch (error) {
      console.log('Transfer notice:', error);
    }

    setUser({ ...user, balance: Math.max(0, user.balance - amount) });
    setTransactions([
      {
        id: Date.now().toString(),
        name: sendName,
        type: 'Paid',
        amount,
        date: new Date().toISOString(),
        reference: `TX${Date.now().toString().substring(7)}`,
        status: 'Completed',
        description: `Payment to ${sendName}`,
        category: 'Transfer',
      },
      ...transactions,
    ]);

    setIsSending(false);
    Alert.alert('Success', `$${amount.toFixed(2)} sent to ${sendName} successfully!`);
  };

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setAddMoneyModal(false);

    setUser({ ...user, balance: user.balance + amount });
    setTransactions([
      {
        id: Date.now().toString(),
        name: 'Wallet Top-up',
        type: 'Received',
        amount,
        date: new Date().toISOString(),
        reference: `TOP${Date.now().toString().substring(7)}`,
        status: 'Completed',
        description: 'Wallet top-up',
        category: 'Top-up',
      },
      ...transactions,
    ]);

    Alert.alert('Success', `$${amount.toFixed(2)} added to wallet!`);
  };

  const showTransactionDetail = (tx: TransactionModel) => {
    setSelectedTransaction(tx);
    setTransactionDetailModal(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingWelcomeScreen
          onGetStarted={completeOnboarding}
          onSignIn={completeOnboarding}
        />
      </>
    );
  }

  const screens = [
    <FinanceHomeScreen
      key="home"
      user={user}
      transactions={transactions}
      onSendMoney={() => openSendMoneyModal()}
      onAddMoney={() => setAddMoneyModal(true)}
      onScanQR={() => Alert.alert('QR Scanner', 'Camera feature coming soon')}
      onBills={() => Alert.alert('Bills', 'Coming soon')}
      onSavings={() => Alert.alert('Savings', 'Coming soon')}
      onCards={() => setCurrentTab(2)}
      onViewAllTransactions={() => setCurrentTab(1)}
      onTransactionTap={showTransactionDetail}
      onProfileTap={() => Alert.alert('Profile', 'Coming soon')}
    />,
    <TransactionHistoryScreen
      key="history"
      transactions={transactions}
      onTransactionTap={showTransactionDetail}
    />,
    <CardsAndWalletScreen
      key="cards"
      user={user}
      transactions={transactions}
      onAddMoney={() => setAddMoneyModal(true)}
      onQuickPay={(name, walletId) => openSendMoneyModal(name, walletId)}
      onTransactionTap={showTransactionDetail}
      onSeeMoreTopUp={() => openSendMoneyModal()}
      onSeeMoreTransactions={() => setCurrentTab(1)}
    />,
    <View key="activity" style={styles.placeholderScreen}>
      <Text style={styles.placeholderIcon}>Activity</Text>
      <Text style={styles.placeholderTitle}>Activity & Insights</Text>
      <Text style={styles.placeholderSubtitle}>Track your spending trends</Text>
    </View>,
    <View key="settings" style={styles.placeholderScreen}>
      <Text style={styles.placeholderIcon}>Settings</Text>
      <Text style={styles.placeholderTitle}>Account & Security</Text>
      <TouchableOpacity
        style={styles.revisitButton}
        onPress={async () => {
          await AsyncStorage.removeItem('seen_onboarding');
          setShowOnboarding(true);
        }}
      >
        <Text style={styles.revisitButtonText}>Revisit Onboarding</Text>
      </TouchableOpacity>
    </View>,
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screens[currentTab]}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="Home" label="Home" isActive={currentTab === 0} onPress={() => setCurrentTab(0)} />
        <NavItem icon="Stats" label="Stats" isActive={currentTab === 1} onPress={() => setCurrentTab(1)} />
        <NavItem icon="Cards" label="Cards" isActive={currentTab === 2} onPress={() => setCurrentTab(2)} />
        <NavItem icon="Activity" label="Activity" isActive={currentTab === 3} onPress={() => setCurrentTab(3)} />
        <NavItem icon="Settings" label="Settings" isActive={currentTab === 4} onPress={() => setCurrentTab(4)} />
      </View>

      {/* Send Money Modal */}
      <Modal visible={sendMoneyModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Send Money</Text>

            <TextInput
              style={styles.input}
              placeholder="Recipient Name"
              value={sendName}
              onChangeText={setSendName}
            />
            <TextInput
              style={styles.input}
              placeholder="Wallet ID (WLT-XXXXXXXXXX)"
              value={sendWalletId}
              onChangeText={setSendWalletId}
              autoCapitalize="characters"
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={sendAmount}
              onChangeText={setSendAmount}
              keyboardType="decimal-pad"
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleSendMoney}>
              <Text style={styles.modalButtonText}>Confirm & Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setSendMoneyModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Money Modal */}
      <Modal visible={addMoneyModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Money to Wallet</Text>

            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={addAmount}
              onChangeText={setAddAmount}
              keyboardType="decimal-pad"
              autoFocus
            />

            <View style={styles.quickAmounts}>
              {[100, 500, 1000, 5000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.quickAmountBtn}
                  onPress={() => setAddAmount(amt.toString())}
                >
                  <Text style={styles.quickAmountText}>${amt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleAddMoney}>
              <Text style={styles.modalButtonText}>Top Up Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setAddMoneyModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Transaction Detail Modal */}
      <Modal visible={transactionDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTransaction && (
              <>
                <View style={styles.modalHandle} />
                <View
                  style={[
                    styles.detailIcon,
                    {
                      backgroundColor:
                        selectedTransaction.type === 'Received'
                          ? AppColors.successBg
                          : AppColors.expenseBg,
                    },
                  ]}
                >
                  <Text style={styles.detailArrow}>
                    {selectedTransaction.type === 'Received' ? '↓' : '↑'}
                  </Text>
                </View>
                <Text style={styles.detailName}>{selectedTransaction.name}</Text>
                <Text
                  style={[
                    styles.detailAmount,
                    {
                      color:
                        selectedTransaction.type === 'Received'
                          ? AppColors.success
                          : AppColors.expense,
                    },
                  ]}
                >
                  {selectedTransaction.type === 'Received' ? '+' : '-'}$
                  {selectedTransaction.amount.toFixed(2)}
                </Text>

                <View style={styles.detailDivider} />

                <DetailRow label="Status" value={selectedTransaction.status} />
                <DetailRow label="Category" value={selectedTransaction.category} />
                <DetailRow label="Reference" value={selectedTransaction.reference} />
                <DetailRow
                  label="Date & Time"
                  value={new Date(selectedTransaction.date).toLocaleString()}
                />

                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setTransactionDetailModal(false)}
                >
                  <Text style={styles.modalCancelText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Loading Indicator */}
      {isSending && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      )}
    </View>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <Text style={styles.navIcon}>{icon}</Text>
    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    {isActive && <View style={styles.navDot} />}
  </TouchableOpacity>
);

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  revisitButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: AppColors.primary,
    borderRadius: 16,
  },
  revisitButtonText: {
    color: AppColors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: AppColors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 14,
    marginBottom: 4,
    color: AppColors.textMuted,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: AppColors.textMuted,
  },
  navLabelActive: {
    fontWeight: '700',
    color: AppColors.primary,
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.primary,
    marginTop: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: BorderRadius.xxlarge,
    borderTopRightRadius: BorderRadius.xxlarge,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: AppColors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 14,
  },
  quickAmountBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: AppColors.primaryContainer,
    borderRadius: 12,
  },
  quickAmountText: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  modalButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: AppColors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  modalCancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  detailIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  detailArrow: {
    fontSize: 28,
  },
  detailName: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  detailAmount: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailDivider: {
    height: 1,
    backgroundColor: AppColors.border,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    color: AppColors.textMuted,
  },
  detailValue: {
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});