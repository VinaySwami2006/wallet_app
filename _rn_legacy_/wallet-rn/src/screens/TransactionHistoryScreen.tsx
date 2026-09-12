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
import { TransactionModel } from '../models/types';
import { TransactionListTile } from '../components/WalletComponents';
import { AppColors, BorderRadius, Shadows } from '../theme/colors';

interface TransactionHistoryScreenProps {
  transactions: TransactionModel[];
  onTransactionTap: (tx: TransactionModel) => void;
}

export const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  transactions,
  onTransactionTap,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  const [selectedYear] = useState('2025');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    if (selectedFilter === 'Income') return tx.type === 'Received';
    if (selectedFilter === 'Expense') return tx.type === 'Paid';
    return true;
  });

  // Calculate totals
  const totalIncome = transactions
    .filter((tx) => tx.type === 'Received')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'Paid')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Sample monthly spending data for bar chart
  const monthlySpending = [0.4, 0.7, 0.5, 0.9, 0.6, 0.8];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Blue Header with Dual Summary Cards */}
      <LinearGradient
        colors={[AppColors.heroGradientStart, AppColors.heroGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroHeader}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>...</Text>
          </TouchableOpacity>
        </View>

        {/* Dual Summary Cards */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconRow}>
              <View style={[styles.summaryIcon, styles.incomeIcon]}>
                <Text style={styles.summaryArrow}>↓</Text>
              </View>
              <Text style={styles.summaryLabel}>Income</Text>
            </View>
            <Text style={styles.summaryAmount}>+${totalIncome.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIconRow}>
              <View style={[styles.summaryIcon, styles.expenseIcon]}>
                <Text style={styles.summaryArrow}>↑</Text>
              </View>
              <Text style={styles.summaryLabel}>Expense</Text>
            </View>
            <Text style={styles.summaryAmount}>-${totalExpense.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Spending Overview */}
        <View style={styles.section}>
          <View style={styles.overviewHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
            <View style={styles.yearSelector}>
              <Text style={styles.yearText}>{selectedYear}</Text>
              <Text style={styles.yearArrow}>v</Text>
            </View>
          </View>

          {/* Bar Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {months.map((month, index) => {
                const isMax = index === 3;
                return (
                  <View key={month} style={styles.barColumn}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: 80 * monthlySpending[index],
                          backgroundColor: isMax
                            ? AppColors.primary
                            : AppColors.primaryContainer,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.monthLabel,
                        isMax && styles.monthLabelActive,
                      ]}
                    >
                      {month}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersContainer}>
          <FilterChip
            label="All"
            isSelected={selectedFilter === 'All'}
            onPress={() => setSelectedFilter('All')}
          />
          <FilterChip
            label="Income"
            isSelected={selectedFilter === 'Income'}
            onPress={() => setSelectedFilter('Income')}
          />
          <FilterChip
            label="Expense"
            isSelected={selectedFilter === 'Expense'}
            onPress={() => setSelectedFilter('Expense')}
          />
        </View>

        {/* Transactions List */}
        <View style={styles.section}>
          <Text style={styles.dateGroupLabel}>Today</Text>

          {filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No transactions matching this filter.
              </Text>
            </View>
          ) : (
            filtered.map((tx) => (
              <TransactionListTile
                key={tx.id}
                name={tx.name}
                amount={tx.amount}
                date={tx.date}
                category={tx.category}
                isIncome={tx.type === 'Received'}
                onPress={() => onTransactionTap(tx)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterChip,
        isSelected && styles.filterChipActive,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  heroHeader: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: BorderRadius.xxlarge,
    borderBottomRightRadius: BorderRadius.xxlarge,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    color: AppColors.textOnPrimary,
    fontSize: 18,
  },
  headerTitle: {
    color: AppColors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  summaryCards: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.large,
    padding: 16,
  },
  summaryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeIcon: {
    backgroundColor: AppColors.successBg,
  },
  expenseIcon: {
    backgroundColor: AppColors.expenseBg,
  },
  summaryArrow: {
    fontSize: 14,
  },
  summaryLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
    marginLeft: 8,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 22,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 4,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  yearArrow: {
    fontSize: 10,
    color: AppColors.textSecondary,
  },
  chartContainer: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.large,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 14,
    borderRadius: 8,
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: AppColors.textMuted,
    marginTop: 8,
  },
  monthLabelActive: {
    fontWeight: '700',
    color: AppColors.primary,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.surfaceSubtle,
  },
  filterChipActive: {
    backgroundColor: AppColors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  filterChipTextActive: {
    color: AppColors.textOnPrimary,
  },
  dateGroupLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: AppColors.textMuted,
  },
});
