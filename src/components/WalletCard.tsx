import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { BankCard } from '../models/types';

interface WalletCardProps {
  card: BankCard;
  width?: number; // card width (defaults to 100% of parent)
  height?: number; // card height (defaults to proportional)
  style?: any;
  focused?: boolean; // front-facing (full details) vs deck-peek
}

/**
 * Renders a single payment-card face (VISA). Used both in the wallet deck
 * (peek) and as the front-facing expanded card. Vector-only, token-safe.
 */
export const WalletCard: React.FC<WalletCardProps> = ({
  card,
  width,
  height,
  style,
  focused = false,
}) => {
  return (
    <View style={[styles.wrap, width !== undefined && { width }, height !== undefined && { height }, style]}>
      <LinearGradient
        colors={card.status === 'locked' ? ['#4B5563', '#374151'] : [card.color[0], card.color[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* gloss */}
        <View pointerEvents="none" style={styles.gloss}>
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.05)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View pointerEvents="none" style={styles.glossBlob} />

        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.cardHolder}>{card.holderName}</Text>
              <Text style={styles.cardNumber}>
                {card.status === 'locked' ? '•••• •••• •••• ••••' : `**** **** **** ${card.last4}`}
              </Text>
            </View>
            <Text style={styles.cardBrand}>VISA</Text>
          </View>

          <View style={styles.cardBottomRow}>
            {focused ? (
              <View>
                <Text style={styles.cardLabel}>Card Holder</Text>
                <Text style={styles.cardValue}>{card.holderName}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.cardLabel}>Valid</Text>
                <Text style={styles.cardValue}>{card.expiry}</Text>
              </View>
            )}
            <SvgContactless color="rgba(255,255,255,0.85)" size={20} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const SvgContactless: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <Path d="M8.5 8.5a5 5 0 0 1 0 7" />
    <Path d="M12 6.5a8.5 8.5 0 0 1 0 11" />
    <Circle cx="15" cy="12" r="1" fill={color} stroke="none" />
  </Svg>
);

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#3B0764',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 22,
    elevation: 8,
  },
  card: {
    flex: 1,
    padding: 18,
    overflow: 'hidden',
  },
  gloss: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  glossBlob: {
    position: 'absolute',
    top: -40,
    left: '33%',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform: [{ rotate: '45deg' }],
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHolder: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '700',
    textShadowColor: 'rgba(80,30,150,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.6,
    marginTop: 4,
    textShadowColor: 'rgba(80,30,150,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(80,30,150,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  cardValue: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});