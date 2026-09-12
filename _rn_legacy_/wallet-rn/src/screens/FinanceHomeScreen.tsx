import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile, TransactionModel } from '../models/types';

interface FinanceHomeScreenProps {
  user: UserProfile;
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
}

export const FinanceHomeScreen: React.FC<FinanceHomeScreenProps> = ({
  user,
  transactions,
  onSendMoney,
  onAddMoney,
  onScanQR,
  onBills,
  onSavings,
  onCards,
  onViewAllTransactions,
  onTransactionTap,
  onProfileTap,
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const balanceText = isBalanceVisible
    ? `$${user.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : '••••••••';

  const maskedAccount = user.walletId.length > 4
    ? `*** *** ${user.walletId.slice(-4)}`
    : '*** *** 8264';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Blue Balance Container */}
        <LinearGradient
          colors={['#3B82F6', '#1E40AF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroContainer}
        >
          {/* Top Row */}
          <View style={styles.heroHeader}>
            <TouchableOpacity onPress={onProfileTap} style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Good Day!</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>

          {/* Balance & Privacy Eye */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceText}>{balanceText}</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeIcon}>{isBalanceVisible ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.accountNumber}>Account no: {maskedAccount}</Text>

          {/* Hero Actions */}
          <View style={styles.heroActions}>
            <TouchableOpacity onPress={onSendMoney} style={[styles.heroBtn, styles.heroBtnWhite]}>
              <Text style={styles.heroBtnIconPrimary}>→</Text>
              <Text style={styles.heroBtnTextPrimary}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAddMoney} style={[styles.heroBtn, styles.heroBtnTransparent]}>
              <Text style={styles.heroBtnIconWhite}>+</Text>
              <Text style={styles.heroBtnTextWhite}>Add Money</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Upgrade Account Banner */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Upgrade Account</Text>
              <Text style={styles.bannerSubtitle}>Upgrade your account for more features</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionTile icon="+" label="Topup" onPress={onAddMoney} />
            <QuickActionTile icon="📄" label="Bills" onPress={onBills} />
            <QuickActionTile icon="🏦" label="Savings" onPress={onSavings} />
            <QuickActionTile icon="💳" label="Cards" onPress={onCards} />
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={onViewAllTransactions}>
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent transactions found.</Text>
            </View>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <TouchableOpacity key={tx.id} onPress={() => onTransactionTap(tx)} style={styles.tile}>
                <View style={[styles.iconContainer, { backgroundColor: tx.type === 'Received' ? '#ECFDF5' : '#FEF2F2' }]}>
                  <Text style={[styles.arrow, { color: tx.type === 'Received' ? '#10B981' : '#EF4444' }]}>
                    {tx.type === 'Received' ? '↓' : '↑'}
                  </Text>
                </View>
                <View style={styles.tileContent}>
                  <Text style={styles.tileName}>{tx.name}</Text>
                  <Text style={styles.tileTime}>{new Date(tx.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</Text>
                </View>
                <View style={styles.tileRight}>
                  <Text style={[styles.tileAmount, { color: tx.type === 'Received' ? '#10B981' : '#EF4444' }]}>
                    {tx.type === 'Received' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.tileCategory}>{tx.category}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface QuickActionTileProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const QuickActionTile: React.FC<QuickActionTileProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.quickActionTile}>
      <View style={styles.quickActionIconContainer}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  heroContainer: { borderRadius: 28, padding: 22, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 6 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarIcon: { fontSize: 24 },
  greetingContainer: { flex: 1, marginLeft: 12 },
  greetingText: { color: 'rgba(255, 255, 255, 0.75)', fontSize: 12 },
  userName: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginTop: 2 },
  notificationBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.15)', justifyContent: 'center', alignItems: 'center' },
  notificationIcon: { fontSize: 20 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceText: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  eyeBtn: { marginLeft: 10, padding: 5 },
  eyeIcon: { fontSize: 20 },
  accountNumber: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, fontWeight: '500', marginTop: 6 },
  heroActions: { flexDirection: 'row', marginTop: 22, gap: 12 },
  heroBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 16, gap: 6 },
  heroBtnWhite: { backgroundColor: '#FFFFFF' },
  heroBtnTransparent: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  heroBtnIconPrimary: { fontSize: 16, color: '#2563EB' },
  heroBtnTextPrimary: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  heroBtnIconWhite: { fontSize: 18, color: '#FFFFFF' },
  heroBtnTextWhite: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  section: { marginTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  filterIcon: { fontSize: 18 },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#FDE68A' },
  bannerIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.15)', justifyContent: 'center', alignItems: 'center' },
  shieldIcon: { fontSize: 20 },
  bannerContent: { flex: 1, marginLeft: 12 },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  bannerSubtitle: { fontSize: 12, color: '#475569', marginTop: 2 },
  chevron: { fontSize: 20, color: '#475569' },
  quickActionsGrid: { flexDirection: 'row', gap: 12, marginTop: 14 },
  quickActionTile: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2 },
  quickActionIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  quickActionIcon: { fontSize: 22 },
  quickActionLabel: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#0F172A' },
  emptyContainer: { padding: 28, backgroundColor: '#FFFFFF', borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  emptyText: { color: '#94A3B8' },
  tile: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2 },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  arrow: { fontSize: 16, fontWeight: '600' },
  tileContent: { flex: 1, marginLeft: 14 },
  tileName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  tileTime: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  tileRight: { alignItems: 'flex-end' },
  tileAmount: { fontSize: 15, fontWeight: '700' },
  tileCategory: { fontSize: 11, color: '#94A3B8', marginTop: 3 },
});