import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  HomeIcon,
  BankNavIcon,
  ScanIcon,
  RewardsIcon,
  SaverIcon,
  PersonIcon,
} from './icons';

export type TabKey = 'home' | 'bank' | 'scan' | 'rewards' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

type NavItem = {
  key: TabKey;
  label: string;
  Icon: React.FC<{ size?: number; color?: string }>;
};

const LEFT_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'bank', label: 'Bank', Icon: BankNavIcon },
];

const RIGHT_ITEMS: NavItem[] = [
  { key: 'rewards', label: 'Rewards', Icon: RewardsIcon },
  { key: 'profile', label: 'Profile', Icon: PersonIcon },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChange }) => {
  return (
    // The outer container sits above everything. pointerEvents="box-none" lets
    // touches pass through the transparent gap between the FAB and the dock,
    // while the dock itself and all buttons still receive touches normally.
    <View style={styles.outerContainer} pointerEvents="box-none">

      {/* Raised scan FAB — sits above the dock */}
      <TouchableOpacity
        onPress={() => onChange('scan')}
        activeOpacity={0.85}
        style={[styles.scanFab, activeTab === 'scan' && styles.scanFabActive]}
      >
        <ScanIcon size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[styles.scanLabel, activeTab === 'scan' && styles.scanLabelActive]}>
        Scan
      </Text>

      {/* Dock row */}
      <View style={styles.dock}>
        {/* Left tabs */}
        {LEFT_ITEMS.map(({ key, label, Icon }) => {
          const isActive = key === activeTab;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              activeOpacity={0.7}
              style={styles.item}
            >
              {isActive ? (
                <View style={styles.activePill}>
                  <Icon size={18} color="#0B0D29" />
                  <Text style={styles.activeLabel}>{label}</Text>
                </View>
              ) : (
                <>
                  <Icon size={22} color="#94A3B8" />
                  <Text style={styles.label}>{label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Centre spacer for the FAB */}
        <View style={styles.scanSpacer} />

        {/* Right tabs */}
        {RIGHT_ITEMS.map(({ key, label, Icon }) => {
          const isActive = key === activeTab;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              activeOpacity={0.7}
              style={styles.item}
            >
              {isActive ? (
                <View style={styles.activePill}>
                  <Icon size={18} color="#0B0D29" />
                  <Text style={styles.activeLabel}>{label}</Text>
                </View>
              ) : (
                <>
                  <Icon size={22} color="#94A3B8" />
                  <Text style={styles.label}>{label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const FAB_SIZE = 62;
const DOCK_HEIGHT = 70;
const FAB_OVERHANG = 18; // how many px the FAB lifts above the dock top

const styles = StyleSheet.create({
  // Outer wrapper — tall enough to include the raised FAB
  outerContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 20,
    height: DOCK_HEIGHT + FAB_OVERHANG + 18, // 18 for the label text below FAB
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // Dock
  dock: {
    width: '100%',
    height: DOCK_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },

  // Tab items
  item: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5C451',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B0D29',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 3,
  },

  // Centre spacer – reserves space for the FAB in the dock row
  scanSpacer: {
    width: FAB_SIZE + 12, // FAB diameter + some breathing room
  },

  // Scan FAB – absolutely positioned over the dock's top edge
  scanFab: {
    position: 'absolute',
    top: 0,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#0B0D29',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B0D29',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 14,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  scanFabActive: {
    backgroundColor: '#F5C451',
    shadowColor: '#F5C451',
  },
  scanLabel: {
    position: 'absolute',
    bottom: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  scanLabelActive: {
    color: '#0B0D29',
    fontWeight: '700',
  },
});