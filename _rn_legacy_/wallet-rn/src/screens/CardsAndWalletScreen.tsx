import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { UserProfile, TransactionModel } from '../models/types';
import { VirtualCard } from '../components/VirtualCard';
import { QuickTopUpAvatar } from '../components/WalletComponents';
import { AppColors, BorderRadius, Shadows } from '../theme/colors';

interface CardsAndWalletScreenProps {
  user: UserProfile;
  transactions: TransactionModel[];
  onAddMoney: () => void;
  onQuickPay: (name: string, walletId: string) => void;
  onTransactionTap: (tx: TransactionModel) => void;
  onSeeMoreTopUp: () => void;
  onSeeMoreTransactions: () => void;
}

const { width } = Dimensions.get('window');

export const CardsAndWalletScreen: React.FC<CardsAndWalletScreenProps> = ({
  user,
  transactions,
  onAddMoney,
  onQuickPay,
  onTransactionTap,
  onSeeMoreTopUp,
  onSeeMoreTransactions,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const topUpContacts = [
    { name: 'Warren', walletId: 'WLT-1002003001' },
    { name: 'Edwards', walletId: 'WLT-1002003002' },
    { name: 'Ingrid', walletId: 'WLT-1002003003' },
    { name: 'Sofia', walletId: 'WLT-1002003004' },
  ];

  const cards = [
    {
      id: '1',
      holder: user.name,
      number: '•••• •••• •••• 3569',
      expiry: '05/28',
      balance: user.balance,
      type: 'VISA',
    },
    {
      id: '2',
      holder: user.name,
      number: '•••• •••• •••• 8841',
      expiry: '12/27',
      balance: user.balance * 0.4,
      type: 'Mastercard',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Cards</Text>
            <Text style={styles.headerSubtitle}>Cards & Transactions</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIcon}>
              <Text>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Text>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Virtual Card Carousel */}
        <FlatList
          data={cards}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - 32}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
          onMomentumScrollEnd={(event) => {
            const page = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
            setCurrentPage(page);
          }}
          renderItem={({ item }) => (
            <VirtualCard
              cardHolder={item.holder}
              cardNumberMasked={item.number}
              expiryDate={item.expiry}
              balance={item.balance}
              cardType={item.type}
              style={{ width: width - 48, marginHorizontal: 8 }}
            />
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {cards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Quick Top-Up Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Top-Up</Text>
            <TouchableOpacity onPress={onSeeMoreTopUp}>
              <Text style={styles.seeMore}>See more</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topUpList}
          >
            <QuickTopUpAvatar name="Add" isAddButton onPress={onAddMoney} />
            {topUpContacts.map((contact) => (
              <QuickTopUpAvatar
                key={contact.walletId}
                name={contact.name}
                onPress={() => onQuickPay(contact.name, contact.walletId)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Latest Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Transactions</Text>
            <TouchableOpacity onPress={onSeeMoreTransactions}>
              <Text style={styles.seeMore}>See more</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent transactions</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.transactionsList}
            >
              {transactions.slice(0, 5).map((tx) => {
                const isIncome = tx.type === 'Received';
                const date = new Date(tx.date);
                return (
                  <TouchableOpacity
                    key={tx.id}
                    onPress={() => onTransactionTap(tx)}
                    style={styles.transactionCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.transactionAvatar}>
                      <Text style={styles.transactionInitial}>
                        {tx.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.transactionName} numberOfLines={1}>
                      {tx.name}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </Text>
                    <Text
                      style={[
                        styles.transactionAmount,
                        { color: isIncome ? AppColors.success : AppColors.expense },
                      ]}
                    >
                      {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: AppColors.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: AppColors.primary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  seeMore: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
  },
  topUpList: {
    paddingVertical: 4,
  },
  transactionsList: {
    paddingVertical: 4,
  },
  transactionCard: {
    width: 130,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.large,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
    ...Shadows.card,
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.primary,
  },
  transactionName: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 10,
    color: AppColors.textMuted,
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 28,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  emptyText: {
    color: AppColors.textMuted,
  },
});
