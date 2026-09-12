import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';
import { UserProfile } from '../models/types';

// A fake QR code grid drawn with SVG
const FakeQRCode: React.FC = () => (
  <Svg width={200} height={200} viewBox="0 0 50 50">
    {/* Outer finder patterns */}
    <Rect x="2" y="2" width="14" height="14" rx="2" fill="none" stroke="#0B0D29" strokeWidth="2" />
    <Rect x="5" y="5" width="8" height="8" rx="1" fill="#0B0D29" />
    <Rect x="34" y="2" width="14" height="14" rx="2" fill="none" stroke="#0B0D29" strokeWidth="2" />
    <Rect x="37" y="5" width="8" height="8" rx="1" fill="#0B0D29" />
    <Rect x="2" y="34" width="14" height="14" rx="2" fill="none" stroke="#0B0D29" strokeWidth="2" />
    <Rect x="5" y="37" width="8" height="8" rx="1" fill="#0B0D29" />
    {/* Data dots */}
    {[
      [18,4],[20,4],[22,4],[26,4],[28,4],
      [18,8],[24,8],[28,8],
      [20,10],[22,10],[26,10],
      [18,14],[20,14],[24,14],[28,14],
      [4,18],[8,18],[12,18],[18,18],[22,18],[28,18],[32,18],[36,18],[40,18],[44,18],
      [4,20],[10,20],[16,20],[24,20],[30,20],[34,20],[38,20],[42,20],[46,20],
      [6,22],[12,22],[20,22],[26,22],[32,22],[44,22],
      [4,24],[8,24],[14,24],[22,24],[28,24],[36,24],[40,24],[46,24],
      [6,26],[10,26],[18,26],[24,26],[30,26],[34,26],[42,26],
      [4,28],[12,28],[20,28],[26,28],[38,28],[44,28],[46,28],
      [18,32],[22,32],[26,32],[30,32],[36,32],[40,32],[44,32],
      [20,34],[28,34],[32,34],[38,34],[46,34],
      [18,36],[24,36],[30,36],[34,36],[42,36],
      [20,38],[26,38],[28,38],[32,38],[36,38],[40,38],[44,38],
      [18,40],[22,40],[30,40],[38,40],[46,40],
      [20,42],[24,42],[28,42],[34,42],[40,42],[44,42],
      [18,46],[24,46],[30,46],[36,46],[42,46],[46,46],
    ].map(([x, y], i) => (
      <Rect key={i} x={x} y={y} width="2" height="2" rx="0.3" fill="#0B0D29" />
    ))}
    {/* Logo circle in center */}
    <Circle cx="25" cy="25" r="5" fill="white" />
    <Circle cx="25" cy="25" r="3.5" fill="#0B0D29" />
    <Circle cx="25" cy="25" r="2" fill="#F5C451" />
  </Svg>
);

interface ScanScreenProps {
  user?: UserProfile;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ user }) => {
  const [amount, setAmount] = useState('250.00');
  const displayName = user?.name || 'Guest';
  const displayHandle = `@${displayName.toLowerCase().replace(/\s+/g, '')}.pay`;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan to Pay</Text>
          <TouchableOpacity style={styles.historyBtn}>
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={styles.tabTextActive}>My QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Scan QR</Text>
          </TouchableOpacity>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.subtitle}>Show this code to receive payment</Text>

          {/* QR Card */}
          <View style={styles.qrCard}>
            <View style={styles.qrTop}>
              <View style={styles.userBadge}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarLetter}>{initial}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{displayName}</Text>
                  <Text style={styles.userId}>{displayHandle}</Text>
                </View>
              </View>
            </View>
            <View style={styles.qrCodeWrap}>
              <FakeQRCode />
            </View>
            <View style={styles.walletIdRow}>
              <Text style={styles.walletIdLabel}>Wallet ID</Text>
              <Text style={styles.walletId}>WLT-7703948264</Text>
            </View>
          </View>

          {/* Amount row */}
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amount to receive</Text>
            <View style={styles.amountInput}>
              <Text style={styles.amountCurrency}>$</Text>
              <Text style={styles.amountValue}>{amount}</Text>
            </View>
          </View>

          {/* Quick amounts */}
          <View style={styles.quickRow}>
            {['10', '25', '50', '100'].map((a) => (
              <TouchableOpacity key={a} onPress={() => setAmount(a + '.00')} style={styles.quickChip}>
                <Text style={styles.quickChipText}>${a}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Share button */}
          <TouchableOpacity onPress={() => Alert.alert('Share', 'QR code sharing coming soon!')} style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Share QR Code</Text>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0D29' },
  safeArea: { flex: 1, backgroundColor: '#0B0D29' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingTop: 12, paddingBottom: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  historyBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  historyText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },

  tabRow: {
    flexDirection: 'row', marginHorizontal: 22, marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20, padding: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
  tabActive: { backgroundColor: '#F5C451' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { fontSize: 13, fontWeight: '700', color: '#0B0D29' },

  sheet: {
    flex: 1, backgroundColor: '#FAF9F5',
    borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 22,
  },
  sheetHandle: {
    width: 44, height: 4, backgroundColor: '#D1D5DB',
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 10,
  },
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 20 },

  qrCard: {
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20,
    alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  qrTop: { width: '100%', marginBottom: 16 },
  userBadge: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0B0D29', alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: 18, fontWeight: '800', color: '#F5C451' },
  userName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  userId: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  qrCodeWrap: {
    padding: 12, backgroundColor: '#FFFFFF',
    borderRadius: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  walletIdRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  walletIdLabel: { fontSize: 12, color: '#9CA3AF' },
  walletId: { fontSize: 12, fontWeight: '700', color: '#0B0D29', letterSpacing: 0.5 },

  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  amountLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  amountInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E5E7EB', gap: 4,
  },
  amountCurrency: { fontSize: 16, fontWeight: '700', color: '#9CA3AF' },
  amountValue: { fontSize: 18, fontWeight: '800', color: '#111827' },

  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  quickChip: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 14,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  quickChipText: { fontSize: 14, fontWeight: '700', color: '#374151' },

  shareBtn: {
    backgroundColor: '#0B0D29', borderRadius: 18,
    height: 56, justifyContent: 'center', alignItems: 'center',
  },
  shareBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
