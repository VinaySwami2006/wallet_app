import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import {
  BankIcon,
  CreditCardIcon,
  TransferIcon,
  DocumentIcon,
  TvIcon,
  BriefcaseIcon,
  PackageIcon,
  LaptopIcon,
  ZapIcon,
} from '../components/icons';

const ACCOUNTS = [
  { id: '1', name: 'Main Wallet', number: '•••• •••• 4821', balance: 12450.00, color: ['#0B0D29', '#1E2056'] as [string, string] },
  { id: '2', name: 'Savings Account', number: '•••• •••• 9302', balance: 8200.50, color: ['#1A1A3E', '#2B2B5C'] as [string, string] },
];

const ACTIVITY = [
  { id: '1', title: 'Netflix Subscription', date: 'Today, 9:30 AM', amount: -15.99, icon: TvIcon, iconColor: '#3B82F6', iconBg: '#EFF6FF' },
  { id: '2', title: 'Salary Credit', date: 'Yesterday, 10:00 AM', amount: 3500.00, icon: BriefcaseIcon, iconColor: '#10B981', iconBg: '#ECFDF5' },
  { id: '3', title: 'Amazon Purchase', date: 'Sep 10, 2:45 PM', amount: -84.20, icon: PackageIcon, iconColor: '#F59E0B', iconBg: '#FFFBEB' },
  { id: '4', title: 'Freelance Payment', date: 'Sep 9, 6:00 PM', amount: 620.00, icon: LaptopIcon, iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
  { id: '5', title: 'Electricity Bill', date: 'Sep 8, 11:00 AM', amount: -42.00, icon: ZapIcon, iconColor: '#EAB308', iconBg: '#FEFCE8' },
];

export const BankScreen: React.FC = () => {
  const [activeCard, setActiveCard] = useState('1');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bank</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Add Account', 'Coming soon!')}>
              <Text style={styles.addBtnText}>+ Account</Text>
            </TouchableOpacity>
          </View>

          {/* Account Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
            {ACCOUNTS.map((acc) => (
              <TouchableOpacity
                key={acc.id}
                activeOpacity={0.85}
                onPress={() => setActiveCard(acc.id)}
                style={[styles.card, activeCard === acc.id && styles.cardActive]}
              >
                {/* Card background dots */}
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <Svg height="100%" width="100%" viewBox="0 0 240 140">
                    <Circle cx="200" cy="20" r="80" fill="rgba(255,255,255,0.04)" />
                    <Circle cx="20" cy="110" r="60" fill="rgba(255,255,255,0.03)" />
                  </Svg>
                </View>
                <Text style={styles.cardName}>{acc.name}</Text>
                <Text style={styles.cardNumber}>{acc.number}</Text>
                <Text style={styles.cardBalance}>${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardLabel}>Available Balance</Text>
                  {activeCard === acc.id && <View style={styles.activeDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quick actions */}
          <View style={styles.quickRow}>
            {[
              { label: 'Add Bank', icon: BankIcon, iconColor: '#60A5FA', onPress: () => Alert.alert('Add Bank', 'Link a new bank account coming soon!') },
              { label: 'Add Card', icon: CreditCardIcon, iconColor: '#A78BFA', onPress: () => Alert.alert('Add Card', 'Add a new card coming soon!') },
              { label: 'Self Transfer', icon: TransferIcon, iconColor: '#4ADE80', onPress: () => Alert.alert('Self Transfer', 'Transfer between your accounts coming soon!') },
              { label: 'Statement', icon: DocumentIcon, iconColor: '#FBBF24', onPress: () => Alert.alert('Statement', 'Download statement coming soon!') },
            ].map(({ label, icon: IconComponent, iconColor, onPress }) => (
              <TouchableOpacity key={label} activeOpacity={0.8} style={styles.quickBtn} onPress={onPress}>
                <View style={styles.quickIcon}>
                  <IconComponent size={22} color={iconColor} />
                </View>
                <Text style={styles.quickLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Cards — Add Bank · Add Card · Self Transfer */}
          <View style={styles.actionCardsRow}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#1A1A3E' }]}
              activeOpacity={0.85}
              onPress={() => Alert.alert('Add Bank', 'Link a new bank account coming soon!')}
            >
              <View style={{ marginBottom: 6 }}>
                <BankIcon size={22} color="#60A5FA" />
              </View>
              <Text style={styles.actionCardTitle}>Add Bank</Text>
              <Text style={styles.actionCardDesc}>Link your bank{"\n"}account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#2B1A3E' }]}
              activeOpacity={0.85}
              onPress={() => Alert.alert('Add Card', 'Add a new card coming soon!')}
            >
              <View style={{ marginBottom: 6 }}>
                <CreditCardIcon size={22} color="#A78BFA" />
              </View>
              <Text style={styles.actionCardTitle}>Add Card</Text>
              <Text style={styles.actionCardDesc}>Debit or credit{"\n"}card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#1A2E1A' }]}
              activeOpacity={0.85}
              onPress={() => Alert.alert('Self Transfer', 'Transfer between your own accounts coming soon!')}
            >
              <View style={{ marginBottom: 6 }}>
                <TransferIcon size={22} color="#4ADE80" />
              </View>
              <Text style={styles.actionCardTitle}>Self Transfer</Text>
              <Text style={styles.actionCardDesc}>Between your{"\n"}accounts</Text>
            </TouchableOpacity>
          </View>

          {/* White Sheet */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Recent Activity</Text>
              <TouchableOpacity><Text style={styles.sheetViewAll}>View all</Text></TouchableOpacity>
            </View>

            {ACTIVITY.map((item) => {
              const isCredit = item.amount > 0;
              const IconComp = item.icon;
              return (
                <View key={item.id} style={styles.activityRow}>
                  <View style={[styles.activityIcon, { backgroundColor: item.iconBg }]}>
                    <IconComp size={20} color={item.iconColor} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityDate}>{item.date}</Text>
                  </View>
                  <Text style={[styles.activityAmount, { color: isCredit ? '#16A34A' : '#EF4444' }]}>
                    {isCredit ? '+' : ''}{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Text>
                </View>
              );
            })}
            <View style={{ height: 110 }} />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0D29' },
  safeArea: { flex: 1, backgroundColor: '#0B0D29' },
  scrollContent: { paddingTop: 4 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingVertical: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  addBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#F5C451' },

  cardsRow: { paddingHorizontal: 22, paddingVertical: 8, gap: 14 },
  card: {
    width: 240, height: 140, backgroundColor: '#1A1A3E',
    borderRadius: 24, padding: 20, justifyContent: 'space-between',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  cardActive: { borderColor: '#F5C451', borderWidth: 1.5 },
  cardName: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  cardNumber: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  cardBalance: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F5C451' },

  quickRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: 16, marginTop: 16, marginBottom: 8,
  },
  quickBtn: { alignItems: 'center', gap: 6 },
  quickIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  quickLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },

  sheet: {
    backgroundColor: '#FAF9F5', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 22, marginTop: 16,
  },
  sheetHandle: {
    width: 44, height: 4, backgroundColor: '#D1D5DB',
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  sheetViewAll: { fontSize: 13, fontWeight: '600', color: '#8B7E74' },

  activityRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 13, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  activityIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  activityIconText: { fontSize: 20 },
  activityInfo: { flex: 1, marginLeft: 13 },
  activityTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  activityDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  activityAmount: { fontSize: 14, fontWeight: '700' },

  // Action cards row (Add Bank, Add Card, Self Transfer)
  actionCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 22,
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  actionCardIcon: { fontSize: 22, marginBottom: 6 },
  actionCardTitle: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  actionCardDesc: { fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 14 },
});

