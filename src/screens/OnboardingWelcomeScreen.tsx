import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { SparkleIcon, ChartUpIcon, RepeatIcon, PaperPlaneIcon } from '../components/icons';
import { formatINR } from '../utils/currency';

const { width } = Dimensions.get('window');

interface OnboardingWelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  return (
    <View style={styles.container}>
      {/* Background concentric circles */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg height="100%" width="100%" viewBox="0 0 400 500">
          <Circle cx="200" cy="220" r="130" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          <Circle cx="200" cy="220" r="190" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
          <Circle cx="200" cy="220" r="260" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top: logo pill */}
        <View style={styles.topRow}>
          <View style={styles.logoPill}>
            <SparkleIcon size={16} color="#F5C451" />
            <Text style={styles.logoText}>WalletApp</Text>
          </View>
        </View>

        {/* Hero mock card preview */}
        <View style={styles.heroArea}>
          <View style={styles.mockPhone}>
            {/* Mock greeting */}
            <View style={styles.mockHeaderRow}>
              <View style={styles.mockAvatarCircle}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' }}
                  style={styles.mockAvatarImg}
                />
              </View>
              <Text style={styles.mockHi}>Hi, Tomasz.</Text>
            </View>

            {/* Mock balance */}
            <Text style={styles.mockBalLabel}>Your Balance</Text>
            <Text style={styles.mockBal}>{formatINR(0)}</Text>

            {/* Mock action row */}
            <View style={styles.mockActionRow}>
              {[
                { label: 'Invest', Icon: ChartUpIcon, gold: true },
                { label: 'Swap', Icon: RepeatIcon, gold: false },
                { label: 'Send', Icon: PaperPlaneIcon, gold: false },
              ].map(({ label, Icon, gold }) => (
                <View key={label} style={styles.mockAction}>
                  <View style={[styles.mockActionCircle, gold && styles.mockActionCircleGold]}>
                    <Icon size={16} color={gold ? '#0B0D29' : '#FFFFFF'} />
                  </View>
                  <Text style={styles.mockActionLabel}>{label}</Text>
                </View>
              ))}
            </View>

            {/* Mock banner */}
            <View style={styles.mockBanner}>
              <SparkleIcon size={16} color="#F5C451" />
              <Text style={styles.mockBannerText}>Smart investing with AI!</Text>
            </View>
          </View>

          {/* Floating badge */}
          <View style={styles.floatingBadge}>
            <Text style={styles.floatingBadgeValue}>+12.4%</Text>
            <Text style={styles.floatingBadgeLabel}>This month</Text>
          </View>
        </View>

        {/* Bottom white sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />

          {/* Headline */}
          <Text style={styles.headline}>
            Manage Your{'\n'}
            <Text style={styles.headlineAccent}>Finances Smarter</Text>
          </Text>

          <Text style={styles.subtitle}>
            Track spending, invest with AI, and send money — all in one beautiful app.
          </Text>

          {/* Dot indicators */}
          <View style={styles.indicators}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* CTA */}
          <TouchableOpacity onPress={onGetStarted} activeOpacity={0.85} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>

          {/* Sign In link */}
          <TouchableOpacity onPress={onSignIn} style={styles.signInRow}>
            <Text style={styles.signInText}>
              Already have an account?{'  '}
              <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0D29',
  },

  // Top logo pill
  topRow: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Hero area
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 28,
  },
  mockPhone: {
    width: width - 72,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 14,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  mockAvatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 8,
  },
  mockAvatarImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  mockHi: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mockBalLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
    textAlign: 'center',
  },
  mockBal: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  mockActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  mockAction: {
    alignItems: 'center',
  },
  mockActionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockActionCircleGold: {
    backgroundColor: '#F5C451',
    borderWidth: 0,
  },
  mockActionLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  mockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B2B5C',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  mockBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Floating badge
  floatingBadge: {
    position: 'absolute',
    top: '22%',
    right: 20,
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingBadgeValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16A34A',
  },
  floatingBadgeLabel: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '600',
  },

  // Bottom white sheet
  bottomSheet: {
    backgroundColor: '#FAF9F5',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  headlineAccent: {
    color: '#5B4FCF',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    marginTop: 10,
  },
  indicators: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#F5C451',
    borderRadius: 3,
  },
  primaryBtn: {
    backgroundColor: '#0B0D29',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signInRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  signInText: {
    fontSize: 13,
    color: '#6B7280',
  },
  signInLink: {
    color: '#0B0D29',
    fontWeight: '700',
  },
});
