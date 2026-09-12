import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Container */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#EBF3FE', '#F8FAFC']}
            style={styles.heroGradient}
          >
            <View style={styles.mockCard}>
              <View style={styles.mockCardHeader}>
                <View style={styles.mockAvatar}>
                  <Text style={styles.mockAvatarText}>👤</Text>
                </View>
                <View style={styles.mockGreeting}>
                  <Text style={styles.mockGreetingText}>Good Day!</Text>
                  <Text style={styles.mockName}>Oliver Bennet</Text>
                </View>
                <View style={styles.mockNotification}>
                  <Text style={styles.mockBell}>🔔</Text>
                </View>
              </View>

              <Text style={styles.mockBalanceLabel}>Account Balance</Text>
              <Text style={styles.mockBalance}>$12,540,000</Text>

              <View style={styles.mockActions}>
                <View style={styles.mockActionBtn}>
                  <Text style={styles.mockActionText}>+ Add Money</Text>
                </View>
                <View style={[styles.mockActionBtn, styles.mockActionPrimary]}>
                  <Text style={styles.mockActionTextWhite}>Send Money</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Page Indicators */}
        <View style={styles.indicators}>
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.headline}>
            Manage and Organize{'\n'}
            <Text style={styles.headlineAccent}>Your Finance</Text>
          </Text>

          <Text style={styles.subtitle}>
            Use the possibilities of a personal account, save and invest smarter every day.
          </Text>

          <View style={styles.spacer} />

          {/* Primary CTA */}
          <TouchableOpacity onPress={onGetStarted} activeOpacity={0.8}>
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Link */}
          <TouchableOpacity onPress={onSignIn} style={styles.signInContainer}>
            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  heroContainer: {
    marginHorizontal: 24,
    marginTop: 20,
    height: 380,
  },
  heroGradient: {
    flex: 1,
    borderRadius: 32,
    padding: 24,
    justifyContent: 'center',
  },
  mockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  mockCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mockAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockAvatarText: {
    fontSize: 18,
  },
  mockGreeting: {
    flex: 1,
    marginLeft: 10,
  },
  mockGreetingText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  mockName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  mockNotification: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockBell: {
    fontSize: 14,
  },
  mockBalanceLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  mockBalance: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  mockActions: {
    flexDirection: 'row',
    gap: 10,
  },
  mockActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
  },
  mockActionPrimary: {
    backgroundColor: '#2563EB',
  },
  mockActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  mockActionTextWhite: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#2563EB',
  },
  contentContainer: {
    paddingHorizontal: 32,
    marginTop: 24,
    flex: 1,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    lineHeight: 36,
    textAlign: 'center',
  },
  headlineAccent: {
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signInContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  signInText: {
    fontSize: 13,
    color: '#475569',
  },
  signInLink: {
    color: '#2563EB',
    fontWeight: '700',
  },
});