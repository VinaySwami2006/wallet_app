import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import {
  BankIcon,
  CreditCardIcon,
  TransferIcon,
  DocumentIcon,
} from '../components/icons';

import { apiService } from '../services/api';

interface Bank {
  id: number;
  bank_name: string;
  bank_code: string | null;
}

interface BankAccount {
  id: number;
  user_id: number;
  bank_id: number;
  bank_name: string;
  bank_code: string | null;
  account_holder_name: string;
  account_reference: string;
  verification_status: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const BankScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [addingBank, setAddingBank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bankModalVisible, setBankModalVisible] = useState(false);

  // Bank verification state
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const [verificationRequestId, setVerificationRequestId] =
    useState<number | null>(null);

  const [ifsc, setIfsc] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Temporary user ID until authentication is implemented.
  const USER_ID = 1;

  // --------------------------------------------------
  // LOAD BANK DATA
  // --------------------------------------------------

  const loadBankData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🏦 Loading bank data...');

      const [accountsResponse, banksResponse] = await Promise.all([
        apiService.getUserBankAccounts(USER_ID),
        apiService.getBanks(),
      ]);

      console.log('💳 Accounts:', accountsResponse);
      console.log('🏦 Banks:', banksResponse);

      setAccounts(accountsResponse.accounts || []);
      setBanks(banksResponse.banks || []);
    } catch (error) {
      console.log('❌ Bank API Error:', error);
      setError('Unable to load bank data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBankData();
  }, []);

  // --------------------------------------------------
  // OPEN BANK SELECTION
  // --------------------------------------------------

  const handleAddBank = () => {
    if (banks.length === 0) {
      Alert.alert(
        'No Banks Available',
        'No active banks are currently available.'
      );
      return;
    }

    setBankModalVisible(true);
  };

  // --------------------------------------------------
  // SELECT BANK
  // --------------------------------------------------

  const handleSelectBank = async (bank: Bank) => {
    try {
      setAddingBank(true);

      const response = await apiService.createBankLinkRequest(
        USER_ID,
        bank.id
      );

      if (response.success) {
        setBankModalVisible(false);

        setSelectedBank(bank);
        setVerificationRequestId(response.request.id);

        setIfsc('');
        setAccountNumber('');

        setVerificationModalVisible(true);
      } else {
        Alert.alert(
          'Unable to Link Bank',
          response.message || 'Something went wrong.'
        );
      }
    } catch (err: any) {
      console.error('Bank linking error:', err);

      const message =
        err?.response?.data?.message ||
        'Unable to start bank linking. Please try again.';

      Alert.alert('Bank Linking Failed', message);
    } finally {
      setAddingBank(false);
    }
  };

  // --------------------------------------------------
  // VERIFY BANK ACCOUNT
  // --------------------------------------------------

  const handleVerifyBankAccount = async () => {
    const cleanIfsc = ifsc.trim().toUpperCase();
    const cleanAccountNumber = accountNumber.trim();

    if (!verificationRequestId) {
      Alert.alert(
        'Verification Error',
        'Bank verification request is missing.'
      );
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      Alert.alert(
        'Invalid IFSC',
        'Please enter a valid 11-character IFSC code.'
      );
      return;
    }

    if (!/^[0-9]{9,18}$/.test(cleanAccountNumber)) {
      Alert.alert(
        'Invalid Account Number',
        'Please enter a valid bank account number.'
      );
      return;
    }

    try {
      setVerifying(true);

      console.log('🏦 Starting bank verification...');

      const response = await apiService.verifyBankAccount(
        verificationRequestId,
        cleanIfsc,
        cleanAccountNumber
      );

      console.log('🏦 Verification response:', response);

      if (response.success) {
        setVerificationModalVisible(false);

        setIfsc('');
        setAccountNumber('');
        setVerificationRequestId(null);

        Alert.alert(
          'Bank Account Verified',
          `${
            selectedBank?.bank_name || 'Bank'
          } account has been verified successfully.`,
          [
            {
              text: 'OK',
              onPress: () => {
                loadBankData();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Verification Failed',
          response.message || 'Bank account verification failed.'
        );
      }
    } catch (err: any) {
      console.error('Bank verification error:', err);

      const message =
        err?.response?.data?.message ||
        'Unable to verify the bank account.';

      Alert.alert('Bank Verification Failed', message);
    } finally {
      setVerifying(false);
    }
  };

  // --------------------------------------------------
  // ACCOUNT REFERENCE
  // --------------------------------------------------

  const formatAccountReference = (reference: string) => {
    if (!reference) {
      return 'Account pending verification';
    }

    if (reference.length <= 4) {
      return `•••• ${reference}`;
    }

    return `•••• •••• ${reference.slice(-4)}`;
  };

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // --------------------------------------------------
  // VERIFICATION LABEL
  // --------------------------------------------------

  const getVerificationLabel = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'Verified';

      case 'PENDING':
        return 'Verification Pending';

      case 'REJECTED':
        return 'Verification Rejected';

      case 'DISABLED':
        return 'Account Disabled';

      default:
        return status;
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Bank</Text>

              <Text style={styles.headerSubtitle}>
                Manage your bank accounts
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddBank}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Account</Text>
            </TouchableOpacity>
          </View>

          {/* LOADING */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="#F5C451"
              />

              <Text style={styles.loadingText}>
                Loading bank information...
              </Text>
            </View>
          )}

          {/* ERROR */}
          {!loading && error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>
                Unable to load banks
              </Text>

              <Text style={styles.errorText}>
                {error}
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadBankData}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* MAIN CONTENT */}
          {!loading && !error && (
            <>
              {/* LINKED ACCOUNTS */}
              {accounts.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardsRow}
                >
                  {accounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      activeOpacity={0.85}
                      onPress={() =>
                        setActiveCard(account.id)
                      }
                      style={[
                        styles.card,
                        activeCard === account.id &&
                          styles.cardActive,
                      ]}
                    >
                      {/* Decorative background */}
                      <View
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      >
                        <Svg
                          height="100%"
                          width="100%"
                          viewBox="0 0 240 140"
                        >
                          <Circle
                            cx="200"
                            cy="20"
                            r="80"
                            fill="rgba(255,255,255,0.04)"
                          />

                          <Circle
                            cx="20"
                            cy="110"
                            r="60"
                            fill="rgba(255,255,255,0.03)"
                          />
                        </Svg>
                      </View>

                      <Text style={styles.cardName}>
                        {account.bank_name}
                      </Text>

                      <Text style={styles.cardNumber}>
                        {formatAccountReference(
                          account.account_reference
                        )}
                      </Text>

                      <Text style={styles.cardBalance}>
                        {getVerificationLabel(
                          account.verification_status
                        )}
                      </Text>

                      <View style={styles.cardFooter}>
                        <Text style={styles.cardLabel}>
                          {account.is_primary
                            ? 'Primary Account'
                            : 'Bank Account'}
                        </Text>

                        {activeCard === account.id && (
                          <View style={styles.activeDot} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                /* EMPTY ACCOUNT */
                <View style={styles.emptyAccountCard}>
                  <View style={styles.emptyIcon}>
                    <BankIcon
                      size={30}
                      color="#60A5FA"
                    />
                  </View>

                  <Text style={styles.emptyTitle}>
                    No bank account linked
                  </Text>

                  <Text style={styles.emptyDescription}>
                    Connect your bank account to use it
                    with Wallet.
                  </Text>

                  <TouchableOpacity
                    style={styles.emptyAddButton}
                    onPress={handleAddBank}
                    activeOpacity={0.85}
                  >
                    <BankIcon
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text
                      style={styles.emptyAddButtonText}
                    >
                      Add Bank Account
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* QUICK ACTIONS */}
              <View style={styles.quickRow}>
                <TouchableOpacity
                  style={styles.quickBtn}
                  onPress={handleAddBank}
                  activeOpacity={0.8}
                >
                  <View style={styles.quickIcon}>
                    <BankIcon
                      size={22}
                      color="#60A5FA"
                    />
                  </View>

                  <Text style={styles.quickLabel}>
                    Add Bank
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickBtn}
                  onPress={() =>
                    Alert.alert(
                      'Add Card',
                      'Card linking will be added later.'
                    )
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.quickIcon}>
                    <CreditCardIcon
                      size={22}
                      color="#A78BFA"
                    />
                  </View>

                  <Text style={styles.quickLabel}>
                    Add Card
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickBtn}
                  onPress={() =>
                    Alert.alert(
                      'Self Transfer',
                      'Self transfer will be added after bank verification.'
                    )
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.quickIcon}>
                    <TransferIcon
                      size={22}
                      color="#4ADE80"
                    />
                  </View>

                  <Text style={styles.quickLabel}>
                    Self Transfer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickBtn}
                  onPress={() =>
                    Alert.alert(
                      'Statement',
                      'Statement generation will be added later.'
                    )
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.quickIcon}>
                    <DocumentIcon
                      size={22}
                      color="#FBBF24"
                    />
                  </View>

                  <Text style={styles.quickLabel}>
                    Statement
                  </Text>
                </TouchableOpacity>
              </View>

              {/* BANK INFORMATION */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>
                  Bank connection
                </Text>

                <View style={styles.infoCard}>
                  <View style={styles.infoIcon}>
                    <BankIcon
                      size={22}
                      color="#60A5FA"
                    />
                  </View>

                  <View style={styles.infoContent}>
                    <Text style={styles.infoCardTitle}>
                      Secure bank linking
                    </Text>

                    <Text
                      style={styles.infoCardDescription}
                    >
                      Your account will only appear here
                      after verification through the
                      authorized banking/payment
                      infrastructure.
                    </Text>
                  </View>
                </View>
              </View>

              {/* BANK ACTIVITY */}
              <View style={styles.sheet}>
                <View style={styles.sheetHandle} />

                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>
                    Bank Activity
                  </Text>

                  <Text style={styles.sheetViewAll}>
                    {accounts.length} linked
                  </Text>
                </View>

                {accounts.length === 0 ? (
                  <View style={styles.noActivity}>
                    <Text style={styles.noActivityText}>
                      No bank account activity yet.
                    </Text>
                  </View>
                ) : (
                  accounts.map((account) => (
                    <View
                      key={account.id}
                      style={styles.activityRow}
                    >
                      <View style={styles.activityIcon}>
                        <BankIcon
                          size={20}
                          color="#3B82F6"
                        />
                      </View>

                      <View style={styles.activityInfo}>
                        <Text
                          style={styles.activityTitle}
                        >
                          {account.bank_name}
                        </Text>

                        <Text
                          style={styles.activityDate}
                        >
                          {getVerificationLabel(
                            account.verification_status
                          )}

                          {account.created_at
                            ? ` • ${formatDate(
                                account.created_at
                              )}`
                            : ''}
                        </Text>
                      </View>

                      <Text style={styles.activityStatus}>
                        {account.verification_status ===
                        'VERIFIED'
                          ? 'Verified'
                          : 'Pending'}
                      </Text>
                    </View>
                  ))
                )}

                <View style={{ height: 110 }} />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* ================================================== */}
      {/* BANK SELECTION MODAL */}
      {/* ================================================== */}

      <Modal
        visible={bankModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!addingBank) {
            setBankModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Add Bank Account
                </Text>

                <Text style={styles.modalSubtitle}>
                  Select your bank to begin
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setBankModalVisible(false)
                }
                disabled={addingBank}
              >
                <Text style={styles.closeButton}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.bankList}
            >
              {banks.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={styles.bankOption}
                  activeOpacity={0.8}
                  disabled={addingBank}
                  onPress={() =>
                    handleSelectBank(bank)
                  }
                >
                  <View style={styles.bankOptionIcon}>
                    <BankIcon
                      size={22}
                      color="#60A5FA"
                    />
                  </View>

                  <View
                    style={styles.bankOptionContent}
                  >
                    <Text
                      style={styles.bankOptionName}
                    >
                      {bank.bank_name}
                    </Text>

                    {bank.bank_code && (
                      <Text
                        style={styles.bankOptionCode}
                      >
                        {bank.bank_code}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.bankOptionArrow}>
                    ›
                  </Text>
                </TouchableOpacity>
              ))}

              {addingBank && (
                <View style={styles.modalLoading}>
                  <ActivityIndicator
                    size="small"
                    color="#F5C451"
                  />

                  <Text
                    style={styles.modalLoadingText}
                  >
                    Creating secure link request...
                  </Text>
                </View>
              )}

              <View style={{ height: 30 }} />
            </ScrollView>

            <Text style={styles.modalDisclaimer}>
              No banking password, UPI PIN, or OTP is
              collected by this screen.
            </Text>
          </View>
        </View>
      </Modal>

      {/* ================================================== */}
      {/* BANK VERIFICATION MODAL */}
      {/* ================================================== */}

      <Modal
        visible={verificationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!verifying) {
            setVerificationModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verificationContainer}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  Verify Bank Account
                </Text>

                <Text style={styles.modalSubtitle}>
                  {selectedBank?.bank_name ||
                    'Selected Bank'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setVerificationModalVisible(false)
                }
                disabled={verifying}
              >
                <Text style={styles.closeButton}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* SECURITY NOTICE */}
            <View style={styles.securityNotice}>
              <BankIcon
                size={22}
                color="#2563EB"
              />

              <Text
                style={styles.securityNoticeText}
              >
                Enter your bank account details.
                Your banking password, UPI PIN and
                OTP are never collected here.
              </Text>
            </View>

            {/* ACCOUNT NUMBER */}
            <Text style={styles.inputLabel}>
              Account Number
            </Text>

            <TextInput
              style={styles.input}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Enter account number"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              secureTextEntry
              editable={!verifying}
              maxLength={18}
            />

            {/* IFSC */}
            <Text style={styles.inputLabel}>
              IFSC Code
            </Text>

            <TextInput
              style={styles.input}
              value={ifsc}
              onChangeText={(value) =>
                setIfsc(value.toUpperCase())
              }
              placeholder="Example: HDFC0001234"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!verifying}
              maxLength={11}
            />

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                verifying &&
                  styles.verifyButtonDisabled,
              ]}
              onPress={handleVerifyBankAccount}
              disabled={verifying}
              activeOpacity={0.85}
            >
              {verifying ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.verifyButtonText}
                  >
                    Verifying...
                  </Text>
                </>
              ) : (
                <Text
                  style={styles.verifyButtonText}
                >
                  Verify Bank Account
                </Text>
              )}
            </TouchableOpacity>

            <Text
              style={styles.verificationDisclaimer}
            >
              Your account number is sent only to
              the authorized verification provider
              through our secure backend.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },

  scrollContent: {
    paddingTop: 4,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },

  addBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F5C451',
  },

  // --------------------------------------------------
  // LOADING / ERROR
  // --------------------------------------------------

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#94A3B8',
  },

  errorCard: {
    marginHorizontal: 22,
    marginTop: 25,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#2A1720',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  errorText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 20,
  },

  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#EF4444',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // --------------------------------------------------
  // BANK CARDS
  // --------------------------------------------------

  cardsRow: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    gap: 14,
  },

  card: {
    width: 240,
    height: 140,
    backgroundColor: '#1A1A3E',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },

  cardActive: {
    borderColor: '#F5C451',
    borderWidth: 1.5,
  },

  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },

  cardNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },

  cardBalance: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },

  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5C451',
  },

  // --------------------------------------------------
  // EMPTY ACCOUNT
  // --------------------------------------------------

  emptyAccountCard: {
    marginHorizontal: 22,
    marginTop: 12,
    padding: 25,
    borderRadius: 24,
    backgroundColor: '#1A1A3E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(96,165,250,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  emptyDescription: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 280,
  },

  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 18,
  },

  emptyAddButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // --------------------------------------------------
  // QUICK ACTIONS
  // --------------------------------------------------

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  quickBtn: {
    alignItems: 'center',
    gap: 6,
  },

  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // --------------------------------------------------
  // BANK INFORMATION
  // --------------------------------------------------

  infoSection: {
    paddingHorizontal: 22,
    marginTop: 12,
    marginBottom: 16,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151735',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  infoIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: 'rgba(96,165,250,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  infoCardDescription: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 17,
    marginTop: 4,
  },

  // --------------------------------------------------
  // BANK ACTIVITY
  // --------------------------------------------------

  sheet: {
    backgroundColor: '#FAF9F5',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 22,
    marginTop: 8,
  },

  sheetHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  sheetViewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7E74',
  },

  noActivity: {
    paddingVertical: 30,
    alignItems: 'center',
  },

  noActivityText: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityInfo: {
    flex: 1,
    marginLeft: 13,
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  activityStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },

  // --------------------------------------------------
  // COMMON MODAL
  // --------------------------------------------------

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FAF9F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 25,
    maxHeight: '80%',
  },

  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 18,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111827',
  },

  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },

  closeButton: {
    fontSize: 20,
    color: '#6B7280',
    padding: 5,
  },

  // --------------------------------------------------
  // BANK LIST
  // --------------------------------------------------

  bankList: {
    maxHeight: 430,
  },

  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  bankOptionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bankOptionContent: {
    flex: 1,
    marginLeft: 12,
  },

  bankOptionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  bankOptionCode: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },

  bankOptionArrow: {
    fontSize: 25,
    color: '#9CA3AF',
    marginLeft: 10,
  },

  modalLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },

  modalLoadingText: {
    fontSize: 12,
    color: '#6B7280',
  },

  modalDisclaimer: {
    fontSize: 10,
    lineHeight: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 10,
  },

  // --------------------------------------------------
  // VERIFICATION MODAL
  // --------------------------------------------------

  verificationContainer: {
    backgroundColor: '#FAF9F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 28,
  },

  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },

  securityNoticeText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 11,
    lineHeight: 17,
    color: '#475569',
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#111827',
    marginBottom: 10,
  },

  verifyButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    marginTop: 18,
  },

  verifyButtonDisabled: {
    opacity: 0.65,
  },

  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  verificationDisclaimer: {
    fontSize: 10,
    lineHeight: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 13,
  },
});