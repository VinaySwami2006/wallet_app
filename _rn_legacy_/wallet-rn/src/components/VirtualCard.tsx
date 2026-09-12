import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors, Typography, BorderRadius, Shadows } from '../theme/colors';

interface VirtualCardProps {
  cardHolder: string;
  cardNumberMasked: string;
  expiryDate: string;
  balance: number;
  cardType?: string;
  style?: ViewStyle;
}

export const VirtualCard: React.FC<VirtualCardProps> = ({
  cardHolder,
  cardNumberMasked,
  expiryDate,
  balance,
  cardType = 'VISA',
  style,
}) => {
  const formattedBalance = `$${balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  return (
    <LinearGradient
      colors={[AppColors.primaryLight, AppColors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, Shadows.primaryGlow, style]}
    >
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.cardLabel}>Card Holder</Text>
          <Text style={styles.cardHolder}>{cardHolder}</Text>
        </View>
        <Text style={styles.cardType}>{cardType}</Text>
      </View>

      <Text style={styles.cardNumber}>{cardNumberMasked}</Text>

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardLabel}>Total Balance</Text>
          <Text style={styles.balance}>{formattedBalance}</Text>
        </View>
        <View style={styles.expiryContainer}>
          <Text style={styles.expiryLabel}>Valid Thru</Text>
          <Text style={styles.expiryDate}>{expiryDate}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xlarge,
    padding: 24,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '500',
  },
  cardHolder: {
    color: AppColors.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  cardType: {
    color: AppColors.textOnPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2.5,
    marginVertical: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balance: {
    color: AppColors.textOnPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  expiryContainer: {
    alignItems: 'flex-end',
  },
  expiryLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
  },
  expiryDate: {
    color: AppColors.textOnPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
});
