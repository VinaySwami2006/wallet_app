import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const REWARDS = [
  { id: '1', title: '5% Cashback on Food', desc: 'Every dining & food delivery', points: 200, icon: '🍕', tag: 'Popular' },
  { id: '2', title: 'Free Movie Tickets', desc: 'Spend $500 this month', points: 750, icon: '🎬', tag: 'Limited' },
  { id: '3', title: '$10 Amazon Voucher', desc: '3 transactions in a week', points: 400, icon: '🛒', tag: null },
  { id: '4', title: 'Airport Lounge Access', desc: 'For Premium members', points: 1200, icon: '✈️', tag: 'Premium' },
];

const HISTORY = [
  { id: '1', title: 'Cashback earned', date: 'Today', points: +50, icon: '💵' },
  { id: '2', title: 'Movie ticket redeemed', date: 'Yesterday', points: -750, icon: '🎬' },
  { id: '3', title: 'Referral bonus', date: 'Sep 10', points: +200, icon: '👥' },
];

export const RewardsScreen: React.FC = () => {
  const totalPoints = 1480;
  const [activeTab, setActiveTab] = useState<'explore' | 'history'>('explore');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rewards</Text>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsEmoji}>⭐</Text>
              <Text style={styles.pointsCount}>{totalPoints.toLocaleString()} pts</Text>
            </View>
          </View>

          {/* Points hero card */}
          <View style={styles.heroCard}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>Total Points</Text>
              <Text style={styles.heroPoints}>{totalPoints.toLocaleString()}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(totalPoints / 2000) * 100}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{2000 - totalPoints} pts to Gold tier</Text>
            </View>
            <View style={styles.heroRight}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.tierLabel}>Silver</Text>
            </View>
          </View>

          {/* Tier progress */}
          <View style={styles.tiersRow}>
            {[
              { label: 'Bronze', min: 0, color: '#CD7F32' },
              { label: 'Silver', min: 500, color: '#94A3B8' },
              { label: 'Gold', min: 2000, color: '#F5C451' },
              { label: 'Platinum', min: 5000, color: '#A5B4FC' },
            ].map(({ label, min, color }) => (
              <View key={label} style={styles.tierItem}>
                <View style={[styles.tierDot, { backgroundColor: color }, totalPoints >= min && styles.tierDotActive]} />
                <Text style={[styles.tierName, totalPoints >= min && { color: '#FFFFFF' }]}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Tab row */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'explore' && styles.tabActive]}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={activeTab === 'explore' ? styles.tabTextActive : styles.tabText}>Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.tabActive]}
              onPress={() => setActiveTab('history')}
            >
              <Text style={activeTab === 'history' ? styles.tabTextActive : styles.tabText}>History</Text>
            </TouchableOpacity>
          </View>

          {/* White Sheet */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            {activeTab === 'explore' ? (
              <>
                <Text style={styles.sheetTitle}>Available Rewards</Text>
                {REWARDS.map((r) => (
                  <View key={r.id} style={styles.rewardCard}>
                    <View style={styles.rewardIcon}><Text style={styles.rewardIconText}>{r.icon}</Text></View>
                    <View style={styles.rewardInfo}>
                      <View style={styles.rewardTitleRow}>
                        <Text style={styles.rewardTitle}>{r.title}</Text>
                        {r.tag && (
                          <View style={[styles.tag, r.tag === 'Premium' && styles.tagPremium, r.tag === 'Limited' && styles.tagLimited]}>
                            <Text style={styles.tagText}>{r.tag}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.rewardDesc}>{r.desc}</Text>
                    </View>
                    <View style={styles.rewardRight}>
                      <Text style={styles.rewardPoints}>{r.points}</Text>
                      <Text style={styles.rewardPtsLabel}>pts</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.sheetTitle}>Points History</Text>
                {HISTORY.map((h) => (
                  <View key={h.id} style={styles.rewardCard}>
                    <View style={styles.rewardIcon}><Text style={styles.rewardIconText}>{h.icon}</Text></View>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardTitle}>{h.title}</Text>
                      <Text style={styles.rewardDesc}>{h.date}</Text>
                    </View>
                    <Text style={[styles.historyPts, { color: h.points > 0 ? '#16A34A' : '#EF4444' }]}>
                      {h.points > 0 ? '+' : ''}{h.points} pts
                    </Text>
                  </View>
                ))}
              </>
            )}

            <View style={{ height: 110 }} />
          </View>

        </ScrollView>
      </SafeAreaView>
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
  pointsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(245,196,81,0.15)', borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(245,196,81,0.3)',
  },
  pointsEmoji: { fontSize: 14 },
  pointsCount: { fontSize: 13, fontWeight: '700', color: '#F5C451' },

  heroCard: {
    marginHorizontal: 22, backgroundColor: '#1A1A3E',
    borderRadius: 24, padding: 20, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  heroLeft: { flex: 1 },
  heroLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  heroPoints: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  progressTrack: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3, marginTop: 12, marginBottom: 6, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#F5C451', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: '#64748B' },
  heroRight: { alignItems: 'center', gap: 4 },
  trophyIcon: { fontSize: 40 },
  tierLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },

  tiersRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginHorizontal: 22, marginBottom: 20,
  },
  tierItem: { alignItems: 'center', gap: 6 },
  tierDot: { width: 12, height: 12, borderRadius: 6, opacity: 0.4 },
  tierDotActive: { opacity: 1 },
  tierName: { fontSize: 10, fontWeight: '600', color: '#64748B' },

  tabRow: {
    flexDirection: 'row', marginHorizontal: 22, marginBottom: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20, padding: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
  tabActive: { backgroundColor: '#F5C451' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { fontSize: 13, fontWeight: '700', color: '#0B0D29' },

  sheet: {
    backgroundColor: '#FAF9F5', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 22, marginTop: 16,
  },
  sheetHandle: {
    width: 44, height: 4, backgroundColor: '#D1D5DB',
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 14 },

  rewardCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  rewardIcon: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  rewardIconText: { fontSize: 22 },
  rewardInfo: { flex: 1, marginLeft: 13 },
  rewardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  rewardTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  rewardDesc: { fontSize: 12, color: '#9CA3AF' },
  tag: { backgroundColor: '#DCFCE7', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  tagPremium: { backgroundColor: '#EDE9FE' },
  tagLimited: { backgroundColor: '#FEF3C7' },
  tagText: { fontSize: 10, fontWeight: '700', color: '#374151' },
  rewardRight: { alignItems: 'center' },
  rewardPoints: { fontSize: 18, fontWeight: '800', color: '#0B0D29' },
  rewardPtsLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600' },
  historyPts: { fontSize: 14, fontWeight: '700' },
});
