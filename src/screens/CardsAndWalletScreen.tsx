import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile, TransactionModel } from '../models/types';
import { formatINR, formatSignedINR } from '../utils/currency';

interface CardsAndWalletScreenProps {
  user: UserProfile;
  transactions: TransactionModel[];
  onAddMoney: () => void;
  onQuickPay: (name: string, walletId: string) => void;
  onTransactionTap: (tx: TransactionModel) => void;
  onSeeMoreTopUp: () => void;
  onSeeMoreTransactions: () => void;
}

export const CardsAndWalletScreen: React.FC<CardsAndWalletScreenProps> = ({
  user,
  transactions,
  onAddMoney,
  onQuickPay,
  onTransactionTap,
  onSeeMoreTopUp,
  onSeeMoreTransactions,
}) => {
  const quickTopUpContacts = [
    { name: 'Alice', walletId: 'WLT-1111111111' },
    { name: 'Bob', walletId: 'WLT-2222222222' },
    { name: 'Charlie', walletId: 'WLT-3333333333' },
    { name: 'Diana', walletId: 'WLT-4444444444' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cards & Wallet</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddMoney}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Virtual Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#2563EB', '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.cardType}>VISA</Text>
              <Text style={styles.cardStatus}>Active</Text>
            </View>
            <Text style={styles.cardNumber}>**** **** **** {user.walletId.slice(-4)}</Text>
            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardLabel}>Card Holder</Text>
                <Text style={styles.cardValue}>{user.name}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expires</Text>
                <Text style={styles.cardValue}>12/28</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Balance Info */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatINR(user.balance)}</Text>
          <TouchableOpacity style={styles.topUpBtn} onPress={onAddMoney}>
            <Text style={styles.topUpBtnText}>Top Up Balance</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Send Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Send</Text>
            <TouchableOpacity onPress={onSeeMoreTopUp}>
              <Text style={styles.seeMore}>See More</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsScroll}>
            {quickTopUpContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={() => onQuickPay(contact.name, contact.walletId)}
                accessibilityRole="button"
                accessibilityLabel={`Quick pay ${contact.name}`}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactInitial}>{contact.name[0]}</Text>
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={onSeeMoreTopUp}
              accessibilityRole="button"
              accessibilityLabel="Add new contact"
            >
              <View style={styles.contactAvatarAdd}>
                <Text style={styles.contactAddIcon}>+</Text>
              </View>
              <Text style={styles.contactName}>Add New</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            <TouchableOpacity onPress={onSeeMoreTransactions}>
              <Text style={styles.seeMore}>See All</Text>
            </TouchableOpacity>
          </View>
          {transactions.slice(0, 4).map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.transactionItem}
              onPress={() => onTransactionTap(tx)}
            >
              <View style={[
                styles.transactionIcon,
                { backgroundColor: tx.type === 'Received' ? '#ECFDF5' : '#FEF2F2' },
              ]}>
                <Text style={[
                  styles.transactionArrow,
                  { color: tx.type === 'Received' ? '#10B981' : '#EF4444' },
                ]}>
                  {tx.type === 'Received' ? 'v' : '^'}
                </Text>
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionName}>{tx.name}</Text>
                <Text style={styles.transactionTime}>{tx.category}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  { color: tx.type === 'Received' ? '#10B981' : '#EF4444' },
                ]}>
                  {formatSignedINR(tx.amount, tx.type === 'Received')}
                </Text>
                <Text style={styles.transactionStatus}>{tx.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  addButton: { backgroundColor: '#EFF6FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  addButtonText: { color: '#2563EB', fontWeight: '700', fontSize: 13 },
  cardContainer: { marginBottom: 20, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 6 },
  card: { borderRadius: 24, padding: 24, height: 200, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardType: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  cardStatus: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  cardNumber: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', letterSpacing: 4, textAlign: 'center', marginVertical: 12 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '500', marginBottom: 4 },
  cardValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  balanceCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  balanceLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  balanceAmount: { fontSize: 32, fontWeight: '800', color: '#0F172A', marginTop: 6, marginBottom: 16 },
  topUpBtn: { backgroundColor: '#2563EB', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 14 },
  topUpBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  seeMore: { fontSize: 13, fontWeight: '600', color: '#2563EB' },
  contactsScroll: { marginLeft: -4 },
  contactItem: { alignItems: 'center', marginRight: 18, width: 64 },
  contactAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  contactAvatarAdd: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  contactInitial: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  contactAddIcon: { fontSize: 22, color: '#94A3B8', fontWeight: '600' },
  contactName: { fontSize: 11, fontWeight: '600', color: '#475569', textAlign: 'center' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  transactionArrow: { fontSize: 14, fontWeight: '700' },
  transactionContent: { flex: 1, marginLeft: 12 },
  transactionName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  transactionTime: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 14, fontWeight: '700' },
  transactionStatus: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
});
