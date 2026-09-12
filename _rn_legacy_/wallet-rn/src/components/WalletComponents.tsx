import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors, Typography, BorderRadius } from '../theme/colors';

interface QuickTopUpAvatarProps {
  name: string;
  imageUrl?: string;
  isAddButton?: boolean;
  onPress: () => void;
}

export const QuickTopUpAvatar: React.FC<QuickTopUpAvatarProps> = ({
  name,
  imageUrl,
  isAddButton = false,
  onPress,
}) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.avatar,
          isAddButton
            ? styles.addButtonAvatar
            : styles.normalAvatar,
        ]}
      >
        {isAddButton ? (
          <Text style={styles.addIcon}>+</Text>
        ) : (
          <Text style={styles.initial}>{initial}</Text>
        )}
      </View>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

interface TransactionListTileProps {
  name: string;
  amount: number;
  date: string;
  category: string;
  isIncome: boolean;
  onPress: () => void;
}

export const TransactionListTile: React.FC<TransactionListTileProps> = ({
  name,
  amount,
  date,
  category,
  isIncome,
  onPress,
}) => {
  const formattedAmount = `${isIncome ? '+' : '-'}$${amount.toFixed(2)}`;
  const timeString = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.tile}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isIncome ? AppColors.successBg : AppColors.expenseBg },
        ]}
      >
        <Text style={[styles.arrow, { color: isIncome ? '#10B981' : '#EF4444' }]}>
          {isIncome ? '↓' : '↑'}
        </Text>
      </View>
      <View style={styles.tileContent}>
        <Text style={styles.tileName}>{name}</Text>
        <Text style={styles.tileTime}>{timeString}</Text>
      </View>
      <View style={styles.tileRight}>
        <Text
          style={[
            styles.tileAmount,
            { color: isIncome ? AppColors.success : AppColors.expense },
          ]}
        >
          {formattedAmount}
        </Text>
        <Text style={styles.tileCategory}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface UpgradeAccountBannerProps {
  onPress?: () => void;
}

export const UpgradeAccountBanner: React.FC<UpgradeAccountBannerProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.banner}>
      <View style={styles.bannerIcon}>
        <Text style={styles.shieldIcon}>🛡️</Text>
      </View>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>Upgrade Account</Text>
        <Text style={styles.bannerSubtitle}>
          Upgrade your account for more features
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // QuickTopUpAvatar styles
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  addButtonAvatar: {
    backgroundColor: AppColors.primaryContainer,
    borderColor: AppColors.primaryLight,
  },
  normalAvatar: {
    backgroundColor: AppColors.primaryContainer,
    borderColor: AppColors.border,
  },
  addIcon: {
    fontSize: 26,
    color: AppColors.primary,
    fontWeight: '600',
  },
  initial: {
    fontSize: 18,
    color: AppColors.primary,
    fontWeight: '700',
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },

  // TransactionListTile styles
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.large,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    fontWeight: '600',
  },
  tileContent: {
    flex: 1,
    marginLeft: 14,
  },
  tileName: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  tileTime: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 3,
  },
  tileRight: {
    alignItems: 'flex-end',
  },
  tileAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  tileCategory: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 3,
  },

  // UpgradeAccountBanner styles
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.warningBg,
    borderRadius: BorderRadius.large,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.warningBorder,
  },
  bannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIcon: {
    fontSize: 20,
  },
  bannerContent: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: AppColors.textSecondary,
  },
});
