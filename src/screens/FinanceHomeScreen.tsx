import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { UserProfile, BankCard, TransactionModel } from '../models/types';
import {
  BellIcon,
  SearchIcon,
  PlusIcon,
  PaperPlaneIcon,
  PersonIcon,
} from '../components/icons';
import { formatSignedINR, formatINR } from '../utils/currency';

interface FinanceHomeScreenProps {
  user: UserProfile;
  cards: BankCard[];
  transactions: TransactionModel[];
  onSendMoney: () => void;
  onAddMoney: () => void;
  onScanQR: () => void;
  onBills: () => void;
  onSavings: () => void;
  onCards: () => void;
  onViewAllTransactions: () => void;
  onTransactionTap: (tx: TransactionModel) => void;
  onProfileTap: () => void;
  onNotificationTap?: () => void;
}

export const FinanceHomeScreen: React.FC<FinanceHomeScreenProps> = ({
  user,
  transactions,
  onSendMoney,
  onAddMoney,
  onScanQR,
  onViewAllTransactions,
  onTransactionTap,
  onProfileTap,
  onNotificationTap = () => {},
}) => {
  const firstName = user.name ? user.name.split(' ')[0] : 'Guest';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onProfileTap} activeOpacity={0.8} style={styles.profileBadge}>
              {user.photoUrl ? (
                <Image source={{ uri: user.photoUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.blankAvatarCircle}>
                  <PersonIcon size={20} color="#6B7280" />
                </View>
              )}
              <Text style={styles.greetingText}>Hi, {firstName}</Text>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => {}} style={styles.iconCircle}>
                <SearchIcon size={20} color="#4B5563" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onNotificationTap} style={styles.iconCircle}>
                <BellIcon size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Wallet Balance</Text>
            <Text style={styles.balanceAmount}>{formatINR(user.balance || 0)}</Text>
          </View>

          {/* Core Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onScanQR} style={styles.actionItem}>
              <View style={styles.actionCircle}>
                <Text style={styles.actionEmoji}>📱</Text>
              </View>
              <Text style={styles.actionLabel}>Scan QR</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSendMoney} style={styles.actionItem}>
              <View style={styles.actionCircle}>
                <PaperPlaneIcon size={22} color="#4B5563" />
              </View>
              <Text style={styles.actionLabel}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onAddMoney} style={styles.actionItem}>
              <View style={styles.actionCircle}>
                <PlusIcon size={22} color="#4B5563" />
              </View>
              <Text style={styles.actionLabel}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions List */}
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={onViewAllTransactions}>
                <Text style={styles.viewAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No recent transactions.</Text>
              </View>
            ) : (
              transactions.slice(0, 8).map((tx) => {
                const isReceived = tx.type === 'Received';
                return (
                  <TouchableOpacity
                    key={tx.id}
                    onPress={() => onTransactionTap(tx)}
                    activeOpacity={0.7}
                    style={styles.txRow}
                  >
                    <View style={[styles.txIcon, { backgroundColor: isReceived ? '#DCFCE7' : '#F3F4F6' }]}>
                      <Text style={[styles.txArrow, { color: isReceived ? '#16A34A' : '#4B5563' }]}>
                        {isReceived ? '↓' : '↑'}
                      </Text>
                    </View>
                    <View style={styles.txDetails}>
                      <Text style={styles.txName} numberOfLines={1}>{tx.name}</Text>
                      <Text style={styles.txMeta}>
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                    <Text style={[styles.txAmount, { color: isReceived ? '#16A34A' : '#111827' }]}>
                      {formatSignedINR(tx.amount, isReceived)}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White header area
  },
  scrollContent: {
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  blankAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    backgroundColor: '#000000', // Solid black for high contrast minimal look
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionItem: {
    alignItems: 'center',
    width: 80,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionEmoji: {
    fontSize: 22,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 8,
  },
  transactionsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
    flex: 1,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6', // Standard blue link color
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txArrow: {
    fontSize: 18,
    fontWeight: '700',
  },
  txDetails: {
    flex: 1,
    marginLeft: 14,
  },
  txName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  txMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
