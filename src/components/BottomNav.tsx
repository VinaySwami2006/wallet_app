import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import {
  HomeIcon,
  BankNavIcon,
  ScanIcon,
  RewardsIcon,
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

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'bank', label: 'Bank', Icon: BankNavIcon },
  { key: 'scan', label: 'Scan', Icon: ScanIcon },
  { key: 'rewards', label: 'Rewards', Icon: RewardsIcon },
  { key: 'profile', label: 'Profile', Icon: PersonIcon },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const isActive = key === activeTab;
          const color = isActive ? '#000000' : '#9CA3AF'; // Black for active, gray for inactive

          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              activeOpacity={0.7}
              style={styles.item}
            >
              <Icon size={24} color={color} />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {Platform.OS === 'ios' && <View style={styles.safeAreaBottom} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 4,
  },
  labelActive: {
    color: '#000000',
    fontWeight: '700',
  },
  safeAreaBottom: {
    height: 20, // rough estimate for iPhone home indicator area, but let SafeArea handle what it can if needed elsewhere
  }
});
