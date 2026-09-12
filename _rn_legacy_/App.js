import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ApiService } from './services/apiService';

const { width } = Dimensions.get('window');

export default function App() {
  const [balance, setBalance] = useState(25867.40);
  const [currency, setCurrency] = useState('SAR');
  const [hideBalance, setHideBalance] = useState(false);
  const [userName, setUserName] = useState('Aditya Sheral');
  const [cardNumber, setCardNumber] = useState('5678');
  const [cardExpiry, setCardExpiry] = useState('05/29');
  const [email, setEmail] = useState('aditya.sheral@example.com');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [walletId, setWalletId] = useState('WLT-7703948264');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  const [topUpContacts, setTopUpContacts] = useState([
    { id: '1', name: 'Warren', initial: 'W', bg: '#DCFCE7', color: '#166534', avatarColor: '#3B82F6' },
    { id: '2', name: 'Edwards', initial: 'E', bg: '#E0F2FE', color: '#075985', avatarColor: '#6366F1' },
    { id: '3', name: 'Ingrid', initial: 'I', bg: '#FEF3C7', color: '#92400E', avatarColor: '#EC4899' },
    { id: '4', name: 'Sofia', initial: 'S', bg: '#FCE7F3', color: '#9D174D', avatarColor: '#F59E0B' },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: '1',
      name: 'Sofia',
      type: 'Paid',
      amount: 36.95,
      currency: 'SAR',
      date: 'April 10, 2025',
      status: 'Completed',
      description: 'Coffee & Snacks',
      avatarColor: '#FCE7F3',
      initial: 'S',
    },
    {
      id: '2',
      name: 'Edwards',
      type: 'Paid',
      amount: 5.00,
      currency: 'SAR',
      date: 'April 05, 2025',
      status: 'Completed',
      description: 'Subscription share',
      avatarColor: '#E0F2FE',
      initial: 'E',
    },
    {
      id: '3',
      name: 'Warren',
      type: 'Received',
      amount: 175.75,
      currency: 'SAR',
      date: 'March 25, 2025',
      status: 'Completed',
      description: 'Dinner payment split',
      avatarColor: '#DCFCE7',
      initial: 'W',
    },
  ]);

  // Load backend data if available
  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    setLoading(true);
    try {
      const userData = await ApiService.getUserByWalletId('WLT-7703948264');
      if (userData && userData.user) {
        const user = userData.user;
        if (user.balance !== undefined) setBalance(parseFloat(user.balance));
        if (user.name) setUserName(user.name);
        if (user.email) setEmail(user.email);
        if (user.phone) setPhone(user.phone);
      }

      const txData = await ApiService.getUserTransactions(1);
      if (txData && txData.transactions) {
        const mapped = txData.transactions.map((tx) => {
          const received = tx.receiver_user_id?.toString() === '1';
          return {
            id: tx.id ? tx.id.toString() : Date.now().toString(),
            name: received ? tx.sender_name || 'Transfer' : tx.receiver_name || 'Transfer',
            type: received ? 'Received' : 'Paid',
            amount: parseFloat(tx.amount || '0'),
            currency: 'SAR',
            date: tx.created_at || 'Recently',
            status: tx.status || 'Completed',
            description: tx.description || 'Transaction',
            avatarColor: received ? '#DCFCE7' : '#FCE7F3',
            initial: (received ? tx.sender_name || 'T' : tx.receiver_name || 'T').charAt(0),
          };
        });
        setTransactions(mapped);
      }
    } catch (err) {
      console.log('Backend offline, using local app state');
    } finally {
      setLoading(false);
    }
  };

  // Modal States
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
  const [sendMoneyModalVisible, setSendMoneyModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Form Inputs
  const [amountInput, setAmountInput] = useState('');
  const [recipientInput, setRecipientInput] = useState('');
  const [sendAmountInput, setSendAmountInput] = useState('');

  // Add Money Handler
  const handleAddMoney = () => {
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
      return;
    }

    const newTx = {
      id: Date.now().toString(),
      name: 'Wallet Top-up',
      type: 'Received',
      amount: amount,
      currency: currency,
      date: 'Today',
      status: 'Completed',
      description: 'Added via bank card',
      avatarColor: '#DCFCE7',
      initial: '+',
    };

    setBalance((prev) => prev + amount);
    setTransactions((prev) => [newTx, ...prev]);
    setAmountInput('');
    setAddMoneyModalVisible(false);
    Alert.alert('Success', `${currency} ${amount.toFixed(2)} added to your wallet balance!`);
  };

  // Send Money Handler
  const handleSendMoney = () => {
    const amount = parseFloat(sendAmountInput);
    const targetName = recipientInput.trim() || (selectedContact ? selectedContact.name : '');

    if (!targetName) {
      Alert.alert('Missing Recipient', 'Please select or enter a recipient name.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (amount > balance) {
      Alert.alert('Insufficient Balance', 'Your current wallet balance is lower than this amount.');
      return;
    }

    const newTx = {
      id: Date.now().toString(),
      name: targetName,
      type: 'Paid',
      amount: amount,
      currency: currency,
      date: 'Today',
      status: 'Completed',
      description: 'Quick Transfer',
      avatarColor: '#FCE7F3',
      initial: targetName.charAt(0).toUpperCase(),
    };

    setBalance((prev) => prev - amount);
    setTransactions((prev) => [newTx, ...prev]);
    setSendAmountInput('');
    setRecipientInput('');
    setSelectedContact(null);
    setSendMoneyModalVisible(false);
    Alert.alert('Transfer Sent', `Successfully sent ${currency} ${amount.toFixed(2)} to ${targetName}.`);
  };

  // Toggle Currency (SAR / USD)
  const toggleCurrency = () => {
    if (currency === 'SAR') {
      setCurrency('USD');
    } else {
      setCurrency('SAR');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Main Container */}
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => setProfileModalVisible(true)}>
            <View style={styles.menuIconBox}>
              <View style={styles.menuLineLong} />
              <View style={styles.menuLineShort} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Wallet</Text>
            <Text style={styles.headerSubtitle}>My Cards & Transaction</Text>
          </View>

          <TouchableOpacity style={styles.headerIconButton} onPress={() => setAddMoneyModalVisible(true)}>
            <Text style={styles.plusIconText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* 3D VISUAL WALLET CONTAINER */}
          <View style={styles.wallet3DContainer}>
            {/* Tucked Credit Card (Sticking out top) */}
            <View style={styles.tuckedCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHolderName}>{userName}</Text>
                <Text style={styles.visaText}>VISA</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardNumberText}>•••• •••• •••• {cardNumber}</Text>
                <Text style={styles.cardExpiryText}>Valid: {cardExpiry}</Text>
              </View>
            </View>

            {/* Front Leather Pocket Layer */}
            <View style={styles.pocketFrontLayer}>
              {/* Pocket Top Rim Highlight Cutout */}
              <View style={styles.pocketRimHighlight} />

              <Text style={styles.totalBalanceLabel}>Total Balance</Text>
              
              <View style={styles.balanceValueRow}>
                <Text style={styles.balanceAmountText}>
                  {hideBalance ? '••••••••' : balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                <Text style={styles.currencyBadge}>{currency}</Text>
              </View>

              {/* Pocket Actions Row */}
              <View style={styles.pocketActionsRow}>
                <TouchableOpacity style={styles.addBalanceButton} onPress={() => setAddMoneyModalVisible(true)}>
                  <Text style={styles.addBalancePlus}>+</Text>
                  <Text style={styles.addBalanceText}>Add Balance</Text>
                </TouchableOpacity>

                <View style={styles.pocketMiniIconGroup}>
                  <TouchableOpacity style={styles.pocketMiniButton} onPress={toggleCurrency}>
                    <Text style={styles.pocketMiniIconText}>⇄</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pocketMiniButton} onPress={() => setHideBalance(!hideBalance)}>
                    <Text style={styles.pocketMiniIconText}>{hideBalance ? '👁' : '🙈'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* QUICK TOP-UP SECTION */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Top-Up</Text>
            <TouchableOpacity onPress={() => setSendMoneyModalVisible(true)}>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsScroll}>
            {/* Add Contact Button */}
            <TouchableOpacity 
              style={styles.addContactCard} 
              onPress={() => {
                setSelectedContact(null);
                setSendMoneyModalVisible(true);
              }}
            >
              <View style={styles.addContactDashedCircle}>
                <Text style={styles.addContactPlus}>+</Text>
              </View>
              <Text style={styles.contactName}>Add</Text>
            </TouchableOpacity>

            {/* Contact Avatars */}
            {topUpContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => {
                  setSelectedContact(contact);
                  setRecipientInput(contact.name);
                  setSendMoneyModalVisible(true);
                }}
              >
                <View style={[styles.avatarCircleOuter, { backgroundColor: contact.bg }]}>
                  <View style={[styles.avatarInner, { backgroundColor: contact.avatarColor }]}>
                    <Text style={styles.avatarInitial}>{contact.initial}</Text>
                  </View>
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* LATEST TRANSACTIONS SECTION */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Transactions</Text>
            <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Transaction Card Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.txCardsScroll}>
            {transactions.slice(0, 4).map((tx) => (
              <TouchableOpacity key={tx.id} style={styles.txHorizontalCard}>
                <View style={[styles.txAvatarCircle, { backgroundColor: tx.avatarColor }]}>
                  <Text style={styles.txAvatarInitial}>{tx.initial}</Text>
                </View>
                <Text style={styles.txCardName}>{tx.name}</Text>
                <Text style={styles.txCardDate}>{tx.date}</Text>
                <Text
                  style={[
                    styles.txCardAmount,
                    { color: tx.type === 'Received' ? '#10B981' : '#EF4444' },
                  ]}
                >
                  {tx.type === 'Received' ? '+' : '-'}{tx.amount.toFixed(2)} {tx.currency}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Detailed Vertical List */}
          <View style={styles.verticalTxList}>
            {transactions.map((tx) => (
              <View key={tx.id} style={styles.txListItem}>
                <View style={styles.txListLeft}>
                  <View style={[styles.txListAvatar, { backgroundColor: tx.avatarColor }]}>
                    <Text style={styles.txListInitial}>{tx.initial}</Text>
                  </View>
                  <View style={styles.txListTextCol}>
                    <Text style={styles.txListName}>{tx.name}</Text>
                    <Text style={styles.txListSub}>{tx.description} • {tx.date}</Text>
                  </View>
                </View>
                <Text style={[styles.txListAmount, { color: tx.type === 'Received' ? '#10B981' : '#EF4444' }]}>
                  {tx.type === 'Received' ? '+' : '-'}{tx.amount.toFixed(2)} {tx.currency}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION BAR */}
        <View style={styles.bottomBarContainer}>
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.navIcon, activeTab === 'Home' && styles.navIconActive]}>⌂</Text>
            <Text style={[styles.navLabel, activeTab === 'Home' && styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('Statistic')}
          >
            <Text style={[styles.navIcon, activeTab === 'Statistic' && styles.navIconActive]}>📊</Text>
            <Text style={[styles.navLabel, activeTab === 'Statistic' && styles.navLabelActive]}>Statistic</Text>
          </TouchableOpacity>

          {/* Center Floating Scan QR Button */}
          <TouchableOpacity style={styles.floatingScanButton} onPress={() => setQrModalVisible(true)}>
            <View style={styles.scanFrameIcon}>
              <View style={styles.scanCornerTL} />
              <View style={styles.scanCornerTR} />
              <View style={styles.scanCornerBL} />
              <View style={styles.scanCornerBR} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('Activity')}
          >
            <Text style={[styles.navIcon, activeTab === 'Activity' && styles.navIconActive]}>📈</Text>
            <Text style={[styles.navLabel, activeTab === 'Activity' && styles.navLabelActive]}>Activity</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('Cards')}
          >
            <Text style={[styles.navIcon, activeTab === 'Cards' && styles.navIconActive]}>💳</Text>
            <Text style={[styles.navLabel, activeTab === 'Cards' && styles.navLabelActive]}>Cards</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL: ADD BALANCE */}
      <Modal visible={addMoneyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>+ Add Balance</Text>
            <Text style={styles.modalSub}>Top up your wallet with bank transfer or card</Text>

            <TextInput
              style={styles.modalInput}
              placeholder={`Enter amount in ${currency}`}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setAddMoneyModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddMoney}>
                <Text style={styles.modalSubmitText}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: SEND MONEY */}
      <Modal visible={sendMoneyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Send / Transfer Money</Text>
            <Text style={styles.modalSub}>Instant payment to contacts or wallet address</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Recipient name or Wallet ID"
              placeholderTextColor="#94A3B8"
              value={recipientInput}
              onChangeText={setRecipientInput}
            />

            <TextInput
              style={styles.modalInput}
              placeholder={`Amount (${currency})`}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={sendAmountInput}
              onChangeText={setSendAmountInput}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setSendMoneyModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalSubmitBtn, { backgroundColor: '#5B52F6' }]} onPress={handleSendMoney}>
                <Text style={styles.modalSubmitText}>Confirm & Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: QR CODE SCANNER */}
      <Modal visible={qrModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { alignItems: 'center' }]}>
            <Text style={styles.modalTitle}>My QR Code</Text>
            <Text style={styles.modalSub}>Scan this code to receive instant payments</Text>

            <View style={styles.qrCodePlaceholder}>
              <Text style={styles.qrBigIcon}>⛶</Text>
              <Text style={styles.qrWalletIdText}>{walletId}</Text>
            </View>

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={() => setQrModalVisible(false)}>
              <Text style={styles.modalSubmitText}>Close QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: PROFILE */}
      <Modal visible={profileModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Account & Wallet Settings</Text>
            <View style={styles.profileDetailBox}>
              <Text style={styles.profileLabel}>Account Holder</Text>
              <Text style={styles.profileValue}>{userName}</Text>

              <Text style={styles.profileLabel}>Wallet ID</Text>
              <Text style={styles.profileValue}>{walletId}</Text>

              <Text style={styles.profileLabel}>Linked Card Expiry</Text>
              <Text style={styles.profileValue}>{cardExpiry}</Text>

              <Text style={styles.profileLabel}>Email</Text>
              <Text style={styles.profileValue}>{email}</Text>
            </View>

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={() => setProfileModalVisible(false)}>
              <Text style={styles.modalSubmitText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FD',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  /* Top Header Bar */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FD',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  menuIconBox: {
    width: 18,
    height: 12,
    justifyContent: 'space-between',
  },
  menuLineLong: {
    width: 18,
    height: 2.5,
    backgroundColor: '#1E293B',
    borderRadius: 2,
  },
  menuLineShort: {
    width: 12,
    height: 2.5,
    backgroundColor: '#1E293B',
    borderRadius: 2,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  plusIconText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#0F172A',
  },

  /* 3D Visual Wallet Styling */
  wallet3DContainer: {
    marginTop: 15,
    marginBottom: 24,
    alignItems: 'center',
  },
  tuckedCard: {
    width: width - 70,
    height: 120,
    backgroundColor: '#B580FF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    justifyContent: 'space-between',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 1,
    transform: [{ translateY: 15 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  visaText: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardNumberText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1,
  },
  cardExpiryText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },

  /* Front Pocket Layer */
  pocketFrontLayer: {
    width: width - 40,
    backgroundColor: '#52149E',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    zIndex: 2,
    shadowColor: '#3B0764',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pocketRimHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  totalBalanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E9D5FF',
    marginBottom: 6,
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  balanceAmountText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  currencyBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D8B4FE',
    marginLeft: 8,
  },
  pocketActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBalanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  addBalancePlus: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 6,
  },
  addBalanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pocketMiniIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pocketMiniButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  pocketMiniIconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  /* Sections */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Quick Top Up Horizontal List */
  contactsScroll: {
    marginBottom: 20,
  },
  addContactCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  addContactDashedCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
  },
  addContactPlus: {
    fontSize: 24,
    color: '#8B5CF6',
    fontWeight: '400',
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarCircleOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  avatarInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 8,
  },

  /* Latest Transactions Scroll Cards */
  txCardsScroll: {
    marginBottom: 16,
  },
  txHorizontalCard: {
    width: 125,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  txAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  txAvatarInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  txCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  txCardDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 8,
  },
  txCardAmount: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* Vertical List */
  verticalTxList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  txListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txListAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txListInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  txListTextCol: {
    justifyContent: 'center',
  },
  txListName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  txListSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  txListAmount: {
    fontSize: 14,
    fontWeight: '700',
  },

  /* Bottom Navigation Bar */
  bottomBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    color: '#94A3B8',
  },
  navIconActive: {
    color: '#5B52F6',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#5B52F6',
  },

  /* Center Floating Scan QR Button */
  floatingScanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B52F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -28,
    shadowColor: '#5B52F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  scanFrameIcon: {
    width: 22,
    height: 22,
    position: 'relative',
  },
  scanCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 7,
    height: 7,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#FFFFFF',
  },
  scanCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 7,
    height: 7,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#FFFFFF',
  },
  scanCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 7,
    height: 7,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#FFFFFF',
  },
  scanCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 7,
    height: 7,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#FFFFFF',
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  modalInput: {
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 14,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  modalSubmitBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#52149E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* QR Modal */
  qrCodePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#C084FC',
    borderStyle: 'dashed',
  },
  qrBigIcon: {
    fontSize: 60,
    color: '#6B21A8',
  },
  qrWalletIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B21A8',
    marginTop: 10,
  },

  /* Profile Details */
  profileDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  profileLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 8,
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
});
