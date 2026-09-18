import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { UserProfile } from '../models/types';

interface ScanScreenProps {
  user?: UserProfile;
  // Called when a valid wallet QR is scanned (receiver detected)
  onRecipientDetected: (name: string, walletId: string) => void;
}

type QRPayload = { type: string; walletId: string; name: string };

function parseQRData(data: string): QRPayload | null {
  try {
    const parsed = JSON.parse(data);
    if (
      parsed &&
      parsed.type === 'wallet_payment' &&
      typeof parsed.walletId === 'string' &&
      typeof parsed.name === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  user,
  onRecipientDetected,
}) => {
  const [tab, setTab] = useState<'myqr' | 'scan'>('myqr');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);

  const displayName = user?.name || 'Guest';
  const walletId = user?.walletId || 'WLT-GUEST000';
  const initial = displayName.charAt(0).toUpperCase();

  const qrValue = JSON.stringify({
    type: 'wallet_payment',
    walletId,
    name: displayName,
  });

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scanning) return;
    const payload = parseQRData(data);
    if (!payload) {
      Alert.alert('Invalid QR', 'This QR code is not a wallet payment code.');
      return;
    }
    // Stop scanning so we don't fire repeatedly
    setScanning(false);
    onRecipientDetected(payload.name, payload.walletId);
  };

  const renderMyQr = () => (
    <>
      <Text style={styles.subtitle}>Show this code to receive money</Text>

      <View style={styles.qrCard}>
        <View style={styles.userBadge}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userId}>@wallet.pay</Text>
          </View>
        </View>

        <View style={styles.qrCodeWrap}>
          <QRCode value={qrValue} size={190} color="#000000" backgroundColor="#FFFFFF" />
        </View>

        <View style={styles.walletIdRow}>
          <Text style={styles.walletIdLabel}>Wallet ID</Text>
          <Text style={styles.walletId}>{walletId}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => Alert.alert('Share', 'QR code sharing coming soon!')}
        style={styles.shareBtn}
      >
        <Text style={styles.shareBtnText}>Share QR Code</Text>
      </TouchableOpacity>
    </>
  );

  const renderScan = () => {
    if (!permission) {
      // Permissions still loading
      return (
        <View style={styles.centered}>
          <Text style={styles.permissionText}>Loading camera…</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.centered}>
          <Text style={styles.permissionText}>
            We need camera access to scan QR codes.
          </Text>
          <TouchableOpacity style={styles.shareBtn} onPress={requestPermission}>
            <Text style={styles.shareBtnText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanHint}>Point camera at a wallet QR code</Text>
        </View>
        {!scanning && (
          <TouchableOpacity
            style={styles.rescanBtn}
            onPress={() => setScanning(true)}
          >
            <Text style={styles.rescanText}>Tap to scan again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan to Pay</Text>
        </View>

        {/* Segmented Control */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === 'myqr' && styles.tabActive]}
            onPress={() => setTab('myqr')}
          >
            <Text style={tab === 'myqr' ? styles.tabTextActive : styles.tabText}>
              My QR Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'scan' && styles.tabActive]}
            onPress={() => setTab('scan')}
          >
            <Text style={tab === 'scan' ? styles.tabTextActive : styles.tabText}>
              Scan QR
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>{tab === 'myqr' ? renderMyQr() : renderScan()}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },

  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  tabTextActive: { fontSize: 14, fontWeight: '600', color: '#111827' },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  subtitle: { fontSize: 15, color: '#6B7280', marginBottom: 24 },

  qrCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 18, fontWeight: '700', color: '#111827' },
  userName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  userId: { fontSize: 14, color: '#6B7280', marginTop: 2 },

  qrCodeWrap: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  walletIdRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  walletIdLabel: { fontSize: 13, color: '#6B7280' },
  walletId: { fontSize: 13, fontWeight: '600', color: '#111827' },

  shareBtn: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  // Camera scanning
  cameraContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: { flex: 1 },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 24,
  },
  scanHint: {
    position: 'absolute',
    bottom: 48,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rescanBtn: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rescanText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  centered: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
});