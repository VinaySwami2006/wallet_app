import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionModel } from '../models/types';
import { ChevronDownIcon } from '../components/icons';
import { formatINR, formatSignedINR } from '../utils/currency';

interface TransactionHistoryScreenProps {
  transactions: TransactionModel[];
  onTransactionTap: (tx: TransactionModel) => void;
}

type Filter = 'All' | 'Income' | 'Expense';

const FILTERS: Filter[] = ['All', 'Income', 'Expense'];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  transactions,
  onTransactionTap,
}) => {
  const [filter, setFilter] = useState<Filter>('All');

  const { income, expense, totalIncome, totalExpense } = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'Received');
    const expense = transactions.filter((t) => t.type === 'Paid');
    return {
      income,
      expense,
      totalIncome: income.reduce((s, t) => s + t.amount, 0),
      totalExpense: expense.reduce((s, t) => s + t.amount, 0),
    };
  }, [transactions]);

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? transactions
        : filter === 'Income'
          ? income
          : expense,
    [filter, transactions, income, expense]
  );

  // Spending overview (bar chart) data
  const monthlyData = [
    { label: 'Jan', income: 3200, expense: 1800 },
    { label: 'Feb', income: 4100, expense: 2200 },
    { label: 'Mar', income: 2800, expense: 3100 },
    { label: 'Apr', income: 5200, expense: 2600 },
    { label: 'May', income: 3900, expense: 2900 },
    { label: 'Jun', income: totalIncome > 0 ? totalIncome : 4500, expense: totalExpense > 0 ? totalExpense : 2400 },
  ];
  const maxVal = Math.max(...monthlyData.map((m) => Math.max(m.income, m.expense)), 1);

  // Group filtered transactions into Today / Yesterday / Earlier
  const groups = useMemo(() => {
    const now = new Date();
    const today: TransactionModel[] = [];
    const yesterday: TransactionModel[] = [];
    const earlier: TransactionModel[] = [];

    filtered.forEach((tx) => {
      const d = new Date(tx.date);
      if (isSameDay(d, now)) today.push(tx);
      else if (isSameDay(d, new Date(now.getTime() - 86400000))) yesterday.push(tx);
      else earlier.push(tx);
    });

    return [
      today.length > 0 && { title: 'Today', items: today },
      yesterday.length > 0 && { title: 'Yesterday', items: yesterday },
      earlier.length > 0 && { title: 'Earlier', items: earlier },
    ].filter(Boolean) as { title: string; items: TransactionModel[] }[];
  }, [filtered]);

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea}>
        {/* Dark header section */}
        <View style={styles.darkHeader}>
          <Text style={styles.headerTitle}>Transactions</Text>

          {/* Summary stat tiles */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryTile}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryAmountGreen}>{formatSignedINR(totalIncome, true)}</Text>
              <Text style={styles.summaryCount}>{income.length} transactions</Text>
            </View>
            <View style={styles.summaryTile}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={styles.summaryAmountRed}>{formatSignedINR(totalExpense, false)}</Text>
              <Text style={styles.summaryCount}>{expense.length} transactions</Text>
            </View>
          </View>
        </View>

        {/* White bottom sheet */}
        <View style={styles.whiteSheet}>
          <View style={styles.sheetHandle} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Spending Overview */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Spending Overview</Text>
              <TouchableOpacity
                style={styles.yearPill}
                activeOpacity={0.8}
              >
                <Text style={styles.yearPillText}>2026</Text>
                <ChevronDownIcon size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartBars}>
                {monthlyData.map((m, i) => (
                  <View key={i} style={styles.chartBarGroup}>
                    <View style={styles.chartBarContainer}>
                      <View style={[styles.chartBarIncome, { height: Math.max(4, (m.income / maxVal) * 90) }]} />
                      <View style={[styles.chartBarExpense, { height: Math.max(4, (m.expense / maxVal) * 90) }]} />
                    </View>
                    <Text style={styles.chartLabel}>{m.label}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
                  <Text style={styles.legendText}>Income</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendText}>Expense</Text>
                </View>
              </View>
            </View>

            {/* Filter chips */}
            <View style={styles.filterRow}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterChip, filter === f && styles.filterChipActive]}
                  onPress={() => setFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date-grouped transaction list */}
            <View style={styles.listContainer}>
              {filtered.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No transactions found.</Text>
                </View>
              ) : (
                groups.map((group) => (
                  <View key={group.title}>
                    <Text style={styles.groupHeader}>{group.title}</Text>
                    {group.items.map((tx) => (
                      <TouchableOpacity
                        key={tx.id}
                        style={styles.txRow}
                        onPress={() => onTransactionTap(tx)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.txBadge,
                            { backgroundColor: tx.type === 'Received' ? '#DCFCE7' : '#FEE2E2' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.txArrow,
                              { color: tx.type === 'Received' ? '#16A34A' : '#EF4444' },
                            ]}
                          >
                            {tx.type === 'Received' ? '↓' : '↑'}
                          </Text>
                        </View>

                        <View style={styles.txContent}>
                          <Text style={styles.txName}>{tx.name}</Text>
                          <Text style={styles.txMeta}>
                            {new Date(tx.date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                            {' · '}
                            {tx.category}
                          </Text>
                        </View>

                        <Text
                          style={[
                            styles.txAmount,
                            { color: tx.type === 'Received' ? '#16A34A' : '#EF4444' },
                          ]}
                        >
                          {formatSignedINR(tx.amount, tx.type === 'Received')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              )}
            </View>

            {/* Bottom nav clearance */}
            <View style={{ height: 110 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },

  // Dark header
  darkHeader: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 18,
    letterSpacing: -0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryTile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  summaryAmountGreen: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4ADE80',
    marginTop: 4,
  },
  summaryAmountRed: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F87171',
    marginTop: 4,
  },
  summaryCount: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },

  // White bottom sheet
  whiteSheet: {
    flex: 1,
    backgroundColor: '#FAF9F5',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  // Chart section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  yearPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    marginBottom: 12,
  },
  chartBarGroup: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 96,
  },
  chartBarIncome: {
    width: 9,
    backgroundColor: '#4ADE80',
    borderRadius: 4,
  },
  chartBarExpense: {
    width: 9,
    backgroundColor: '#F87171',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 6,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Filter chips
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#0B0D29',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // List
  listContainer: {
    paddingBottom: 8,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  txBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txArrow: {
    fontSize: 18,
    fontWeight: '700',
  },
  txContent: {
    flex: 1,
    marginLeft: 13,
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
  emptyContainer: {
    padding: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});