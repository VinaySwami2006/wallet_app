import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile } from '../models/types';
import {
  PersonIcon,
  ShieldIcon,
  BellIcon,
  LockIcon,
  ChevronRightIcon,
  BankIcon,
  CreditCardIcon,
} from '../components/icons';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onBackToHome?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateProfile,
  onBackToHome,
}) => {
  const isGuest = user.name === 'Guest' || user.id === 0;

  const [editModal, setEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(user.name === 'Guest' ? '' : user.name);
  const [emailInput, setEmailInput] = useState(user.email === 'guest@wallet.app' ? '' : user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone);

  const handleSaveProfile = () => {
    if (!nameInput.trim()) {
      Alert.alert('Error', 'Please enter a valid name.');
      return;
    }
    onUpdateProfile({
      name: nameInput.trim(),
      email: emailInput.trim() || 'user@wallet.app',
      phone: phoneInput.trim() || '+1 555 0199',
      walletId: user.walletId === 'WLT-GUEST000' ? `WLT-${Math.floor(1000000000 + Math.random() * 9000000000)}` : user.walletId,
    });
    setEditModal(false);
    Alert.alert('Account Updated', isGuest ? 'Welcome! Your account has been created.' : 'Profile updated successfully.');
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          onUpdateProfile({
            id: 0,
            name: 'Guest',
            email: 'guest@wallet.app',
            phone: '',
            walletId: 'WLT-GUEST000',
            balance: 0,
          });
          Alert.alert('Signed Out', 'You are now browsing as Guest.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditModal(true)}>
              <Text style={styles.editBtnText}>{isGuest ? 'Create Account' : 'Edit Profile'}</Text>
            </TouchableOpacity>
          </View>

          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarWrap}>
              {user.photoUrl ? (
                <Image source={{ uri: user.photoUrl }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <PersonIcon size={40} color="#0B0D29" />
                </View>
              )}
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            <View style={styles.walletBadge}>
              <Text style={styles.walletBadgeLabel}>Wallet ID</Text>
              <Text style={styles.walletBadgeId}>{user.walletId}</Text>
            </View>
          </View>

          {/* White Sheet Options */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetSectionTitle}>Account Settings</Text>

            <TouchableOpacity style={styles.menuItem} onPress={() => setEditModal(true)}>
              <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
                <PersonIcon size={20} color="#2563EB" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Personal Information</Text>
                <Text style={styles.menuSubtitle}>{isGuest ? 'Set up your details' : `${user.phone || 'Phone not set'}`}</Text>
              </View>
              <ChevronRightIcon size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Security', 'Biometrics and PIN protection enabled.')}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
                <ShieldIcon size={20} color="#16A34A" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Security & Privacy</Text>
                <Text style={styles.menuSubtitle}>2FA, Face ID, Passcode</Text>
              </View>
              <ChevronRightIcon size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Linked Accounts', 'Bank account connected.')}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
                <BankIcon size={20} color="#D97706" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Linked Bank Accounts</Text>
                <Text style={styles.menuSubtitle}>Main Wallet, Savings</Text>
              </View>
              <ChevronRightIcon size={20} color="#94A3B8" />
            </TouchableOpacity>

            {isGuest ? (
              <TouchableOpacity style={styles.actionBtn} onPress={() => setEditModal(true)}>
                <Text style={styles.actionBtnText}>Create Account / Sign In</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.actionBtn, styles.signOutBtn]} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            )}

            <View style={{ height: 110 }} />
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Edit/Create Account Modal */}
      <Modal visible={editModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{isGuest ? 'Create Your Account' : 'Edit Profile'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={nameInput}
              onChangeText={setNameInput}
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              value={emailInput}
              onChangeText={setEmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#9CA3AF"
              value={phoneInput}
              onChangeText={setPhoneInput}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveBtnText}>{isGuest ? 'Save Account' : 'Update Profile'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: '#F5C451' },

  userCard: {
    alignItems: 'center', paddingHorizontal: 22, paddingTop: 10, paddingBottom: 20,
  },
  avatarWrap: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarFallback: {
    width: '100%', height: '100%', backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },

  userName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  userEmail: { fontSize: 13, color: '#94A3B8', marginTop: 3 },

  walletBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 7, marginTop: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  walletBadgeLabel: { fontSize: 11, color: '#64748B' },
  walletBadgeId: { fontSize: 12, fontWeight: '700', color: '#F5C451' },

  sheet: {
    backgroundColor: '#FAF9F5', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 22, marginTop: 8, flex: 1, minHeight: 400,
  },
  sheetHandle: {
    width: 44, height: 4, backgroundColor: '#D1D5DB',
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 18,
  },
  sheetSectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 14 },

  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  menuIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  menuContent: { flex: 1, marginLeft: 13 },
  menuTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  menuSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },

  actionBtn: {
    backgroundColor: '#0B0D29', borderRadius: 18,
    height: 54, justifyContent: 'center', alignItems: 'center',
    marginTop: 18,
  },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  signOutBtn: { backgroundColor: '#FEE2E2' },
  signOutText: { fontSize: 15, fontWeight: '700', color: '#EF4444' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAF9F5', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    padding: 24, paddingBottom: 44,
  },
  modalHandle: {
    width: 44, height: 4, backgroundColor: '#D1D5DB',
    borderRadius: 2, alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 18 },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, padding: 14, fontSize: 15, color: '#111827', marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#0B0D29', borderRadius: 18, height: 54,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelBtn: { marginTop: 12, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { color: '#9CA3AF', fontSize: 14 },
});
