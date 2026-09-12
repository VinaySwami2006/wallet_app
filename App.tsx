import './global.css';

import React, { useState, useEffect, ReactElement } from 'react';
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
  LogBox,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  'Cannot connect to Expo CLI',
  'SafeAreaView has been deprecated',
]);
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import { AppColors, BorderRadius } from './src/theme/colors';
import { formatINR, formatSignedINR } from './src/utils/currency';
import { Skeleton } from '@/src/components/ui/skeleton';
import { UserProfile, TransactionModel, BankCard, createMockUser, createMockTransactions, createMockCards, parseTransaction } from './src/models/types';
import { apiService } from './src/services/api';

import { OnboardingWelcomeScreen } from './src/screens/OnboardingWelcomeScreen';
import { FinanceHomeScreen } from './src/screens/FinanceHomeScreen';
import { BankScreen } from './src/screens/BankScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';
import { SaverScreen } from './src/screens/SaverScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { BottomNav, TabKey } from './src/components/BottomNav';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [user, setUser] = useState<UserProfile>(createMockUser(false));
  const [transactions, setTransactions] = useState<TransactionModel[]>(createMockTransactions());
  const [cards, setCards] = useState<BankCard[]>(createMockCards());
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

      if (userData.user && userData.user.name) {
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

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
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
    Alert.alert('Success', `${formatINR(amount)} sent to ${sendName} successfully!`);
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

    Alert.alert('Success', `${formatINR(amount)} added to wallet!`);
  };

  const showTransactionDetail = (tx: TransactionModel) => {
    setSelectedTransaction(tx);
    setTransactionDetailModal(true);
  };

  if (isLoading) {
    return <SkeletonHomeScreen />;
  }

  if (showOnboarding) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardingWelcomeScreen
          onGetStarted={completeOnboarding}
          onSignIn={completeOnboarding}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Screen container: keep screens mounted so tab switching is instant and glitch-free */}
      <View style={styles.screenContainer}>
        <View style={[styles.screenWrapper, currentTab !== 'home' && styles.hiddenScreen]}>
          <FinanceHomeScreen
            user={user}
            cards={cards}
            transactions={transactions}
            onSendMoney={() => openSendMoneyModal()}
            onAddMoney={() => setAddMoneyModal(true)}
            onScanQR={() => setCurrentTab('scan')}
            onBills={() => setAddMoneyModal(true)}
            onSavings={() => setCurrentTab('profile')}
            onCards={() => setCurrentTab('bank')}
            onViewAllTransactions={() => setCurrentTab('bank')}
            onTransactionTap={showTransactionDetail}
            onProfileTap={() => setCurrentTab('profile')}
            onNotificationTap={() => Alert.alert('Notifications', 'Coming soon')}
            onLockedCardTap={(card) => Alert.alert('Card locked', `Card •••• ${card.last4} is locked.`)}
          />
        </View>

        <View style={[styles.screenWrapper, currentTab !== 'bank' && styles.hiddenScreen]}>
          <BankScreen />
        </View>

        <View style={[styles.screenWrapper, currentTab !== 'scan' && styles.hiddenScreen]}>
          <ScanScreen user={user} />
        </View>

        <View style={[styles.screenWrapper, currentTab !== 'rewards' && styles.hiddenScreen]}>
          <RewardsScreen />
        </View>

        <View style={[styles.screenWrapper, currentTab !== 'profile' && styles.hiddenScreen]}>
          <ProfileScreen user={user} onUpdateProfile={handleUpdateProfile} />
        </View>
      </View>

      {/* Floating bottom navigation */}
      <BottomNav activeTab={currentTab} onChange={setCurrentTab} />

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
                  <Text style={styles.quickAmountText}>{formatINR(amt)}</Text>
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
                    {selectedTransaction.type === 'Received' ? 'v' : '^'}
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
                  {formatSignedINR(
                    selectedTransaction.amount,
                    selectedTransaction.type === 'Received',
                  )}
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

/**
 * Skeleton loading state for the home screen — shown while the app boots.
 * Mirrors the FinanceHomeScreen layout: greeting pill, balance block,
 * quick actions, and the AI banner, using shimmering Skeleton blocks.
 */
const SkeletonHomeScreen: React.FC = () => {
  const dark = AppColors.dark;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dark.background }]}>
      <View style={styles.skPage}>
        {/* Greeting pill */}
        <View style={[styles.skRow, { alignItems: 'center' }]}>
          <Skeleton className="h-[42px] w-[42px] rounded-full bg-[#2A3446]" />
          <Skeleton className="ml-3 h-[20px] w-36 rounded-md bg-[#2A3446]" />
          <Skeleton className="ml-auto h-[42px] w-[42px] rounded-full bg-[#2A3446]" />
        </View>

        {/* Balance */}
        <Skeleton className="mt-8 h-[14px] w-28 rounded-md bg-[#2A3446]" />
        <Skeleton className="mt-3 h-[42px] w-64 rounded-lg bg-[#2A3446]" />

        {/* Quick actions (4 circles) */}
        <View style={styles.skRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px] w-[60px] rounded-full bg-[#2A3446]" />
          ))}
        </View>

        {/* AI banner */}
        <Skeleton className="mt-7 h-[70px] w-full rounded-[20px] bg-[#2A3446]" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },
  screenContainer: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
  },
  hiddenScreen: {
    display: 'none',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0D29',
  },
  skPage: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#0B0D29',
  },
  skRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  // Placeholder screens (Market, Profile)
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#0B0D29',
  },
  placeholderIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  placeholderIconEmoji: {
    fontSize: 32,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  revisitButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#F5C451',
    borderRadius: 18,
  },
  revisitButtonText: {
    color: '#0B0D29',
    fontSize: 14,
    fontWeight: '700',
  },

  // Modals — white sheet style
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAF9F5',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    paddingBottom: 44,
  },
  modalHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    color: '#111827',
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
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickAmountText: {
    color: '#0B0D29',
    fontWeight: '700',
    fontSize: 13,
  },
  modalButton: {
    backgroundColor: '#0B0D29',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  // Transaction detail modal
  detailIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  detailAmount: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 22,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  detailLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  detailValue: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
