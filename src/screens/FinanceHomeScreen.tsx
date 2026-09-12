import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { UserProfile, BankCard, TransactionModel } from '../models/types';
import {
  BellIcon,
  SearchIcon,
  CloseIcon,
  SparkleIcon,
  MoreIcon,
  ChartUpIcon,
  PlusIcon,
  PaperPlaneIcon,
  PersonIcon,
} from '../components/icons';
import { formatSignedINR } from '../utils/currency';
import { formatINR } from '../utils/currency';


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
  onLockedCardTap?: (card: BankCard) => void;
}

const { width } = Dimensions.get('window');

// Background concentric circles SVG component
const BackgroundConcentricCircles = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg height="100%" width="100%" viewBox="0 0 400 500">
      <Circle cx="200" cy="150" r="120" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" fill="none" />
      <Circle cx="200" cy="150" r="180" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" fill="none" />
      <Circle cx="200" cy="150" r="240" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />
      <Circle cx="200" cy="150" r="300" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1" fill="none" />
    </Svg>
  </View>
);

export const FinanceHomeScreen: React.FC<FinanceHomeScreenProps> = ({
  user,
  cards,
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
  onNotificationTap = () => {},
}) => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const firstName = user.name ? user.name.split(' ')[0] : 'Guest';

  return (
    <View style={styles.container}>
      <BackgroundConcentricCircles />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {/* ============ HEADER ROW ============ */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={onProfileTap}
              activeOpacity={0.8}
              style={styles.profilePill}
            >
              {user.photoUrl ? (
                <Image
                  source={{ uri: user.photoUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.blankAvatarCircle}>
                  <PersonIcon size={20} color="#0B0D29" />
                </View>
              )}
              <Text style={styles.greetingText}>Hi, {firstName}.</Text>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => {}}
                activeOpacity={0.7}
                style={styles.iconCircle}
              >
                <SearchIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onNotificationTap}
                activeOpacity={0.7}
                style={styles.iconCircle}
              >
                <BellIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ============ BALANCE BLOCK ============ */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceTitle}>Your Balance</Text>
            <Text style={styles.balanceAmount}>{formatINR(user.balance || 0)}</Text>
          </View>

          {/* ============ ACTION BUTTONS (Invest, Swap, Send, More) ============ */}
          <View style={styles.actionRow}>
            {/* Invest button (Pill shaped with gold stroke & sparkle badge) */}
            <TouchableOpacity
              onPress={onSavings}
              activeOpacity={0.8}
              style={styles.actionItem}
            >
              <View style={styles.investPill}>
                <ChartUpIcon size={24} color="#F5C451" />
                <View style={styles.sparkleBadge}>
                  <SparkleIcon size={12} color="#0B0D29" />
                </View>
              </View>
              <Text style={styles.actionLabelActive}>Invest</Text>
            </TouchableOpacity>

            {/* Add Money button */}
            <TouchableOpacity
              onPress={onAddMoney}
              activeOpacity={0.8}
              style={styles.actionItem}
            >
              <View style={styles.circleButton}>
                <PlusIcon size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.actionLabel}>Add</Text>
            </TouchableOpacity>

            {/* Send button */}
            <TouchableOpacity
              onPress={onSendMoney}
              activeOpacity={0.8}
              style={styles.actionItem}
            >
              <View style={styles.circleButton}>
                <PaperPlaneIcon size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.actionLabel}>Send</Text>
            </TouchableOpacity>

            {/* More button */}
            <TouchableOpacity
              onPress={onCards}
              activeOpacity={0.8}
              style={styles.actionItem}
            >
              <View style={styles.circleButton}>
                <MoreIcon size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.actionLabel}>More</Text>
            </TouchableOpacity>
          </View>

          {/* ============ AI BANNER CARD WITH SPEECH POINTER ============ */}
          {bannerVisible && (
            <View style={styles.bannerWrapper}>
              {/* Speech bubble arrow pointer */}
              <View style={styles.speechPointer} />

              <View style={styles.bannerCard}>
                <View style={styles.bannerContentRow}>
                  <View style={styles.sparkleIconWrap}>
                    <SparkleIcon size={26} color="#F5C451" />
                  </View>

                  <View style={styles.bannerTextContainer}>
                    <Text style={styles.bannerTitle}>Smart investing with AI!</Text>
                    <Text style={styles.bannerDescription}>
                      Get personalized recommendations and risk assessments.
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setBannerVisible(false)}
                    activeOpacity={0.7}
                    style={styles.closeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <CloseIcon size={16} color="rgba(255, 255, 255, 0.6)" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* ============ WHITE TRANSACTIONS SHEET ============ */}
          <View style={styles.marketSheet}>
            {/* Sheet Handle Top Bar */}
            <View style={styles.sheetHandle} />

            <View style={styles.marketHeader}>
              <Text style={styles.marketTitle}>Transactions</Text>
              <TouchableOpacity onPress={onViewAllTransactions} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            {/* Transaction list */}
            {transactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions yet.</Text>
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
                    <View style={[styles.txIcon, { backgroundColor: isReceived ? '#DCFCE7' : '#FEE2E2' }]}>
                      <Text style={[styles.txArrow, { color: isReceived ? '#16A34A' : '#EF4444' }]}>
                        {isReceived ? '↓' : '↑'}
                      </Text>
                    </View>
                    <View style={styles.txDetails}>
                      <Text style={styles.txName} numberOfLines={1}>{tx.name}</Text>
                      <Text style={styles.txMeta}>
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {tx.category}
                      </Text>
                    </View>
                    <Text style={[styles.txAmount, { color: isReceived ? '#16A34A' : '#EF4444' }]}>
                      {formatSignedINR(tx.amount, isReceived)}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}

            {/* Bottom padding so floating nav doesn't cover content */}
            <View style={{ height: 120 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D29', // Deep dark blue background
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },
  scrollContent: {
    paddingTop: 8,
    backgroundColor: '#0B0D29',
  },

  // Header row
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  blankAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Balance Section
  balanceContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  balanceTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: -1,
  },

  // Action Buttons Section
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 36,
  },
  actionItem: {
    alignItems: 'center',
    width: (width - 32) / 4,
  },
  investPill: {
    width: 90,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#F5C451',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sparkleBadge: {
    position: 'absolute',
    top: -5,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F5C451',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 8,
  },
  actionLabelActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },

  // AI Banner with Pointer
  bannerWrapper: {
    paddingHorizontal: 20,
    marginTop: 24,
    position: 'relative',
  },
  speechPointer: {
    position: 'absolute',
    top: -8,
    left: 72,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2B2B5C',
    zIndex: 2,
  },
  bannerCard: {
    backgroundColor: '#2B2B5C',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bannerContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sparkleIconWrap: {
    marginTop: 2,
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  closeBtn: {
    padding: 4,
  },

  // White Market Bottom Sheet
  marketSheet: {
    backgroundColor: '#FAF9F5', // Soft off-white light background matching screenshot
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 12,
    marginTop: 28,
    paddingBottom: 120,
    minHeight: 500,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  marketTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B7E74',
  },

  // Transaction rows (in the white sheet)
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  txMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },

  // Empty state
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});




