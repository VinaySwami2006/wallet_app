import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOALS = [
  {
    id: '1', title: 'Emergency Fund', icon: '🛡️',
    target: 10000, saved: 6800, color: '#4ADE80', deadline: 'Dec 2026',
  },
  {
    id: '2', title: 'Vacation to Japan', icon: '🗾',
    target: 3500, saved: 1200, color: '#60A5FA', deadline: 'Mar 2027',
  },
  {
    id: '3', title: 'New Laptop', icon: '💻',
    target: 1500, saved: 1500, color: '#F5C451', deadline: 'Completed!',
  },
];

const TIPS = [
  { id: '1', title: 'Auto-save 10%', desc: 'Set aside 10% of every income automatically', icon: '⚡' },
  { id: '2', title: 'Round-up savings', desc: 'Round up every transaction to the nearest dollar', icon: '🔄' },
];

export const SaverScreen: React.FC = () => {
  const totalSaved = GOALS.reduce((s, g) => s + g.saved, 0);
  const totalTarget = GOALS.reduce((s, g) => s + g.target, 0);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Saver</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => Alert.alert('New Goal', 'Goal creation coming soon!')}
            >
              <Text style={styles.addBtnText}>+ New Goal</Text>
            </TouchableOpacity>
          </View>

          {/* Summary hero */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Total Saved</Text>
            <Text style={styles.heroAmount}>${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            <View style={styles.heroProgress}>
              <View style={styles.heroTrack}>
                <View style={[styles.heroFill, { width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }]} />
              </View>
              <Text style={styles.heroPercent}>{Math.round((totalSaved / totalTarget) * 100)}%</Text>
            </View>
            <Text style={styles.heroSub}>of ${totalTarget.toLocaleString()} total target</Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{GOALS.length}</Text>
                <Text style={styles.statLabel}>Goals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>$240</Text>
                <Text style={styles.statLabel}>This month</Text>
              </View>
            </View>
          </View>

          {/* White Sheet */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            {/* Goals */}
            <Text style={styles.sectionTitle}>Your Goals</Text>
            {GOALS.map((goal) => {
              const pct = Math.min((goal.saved / goal.target) * 100, 100);
              const done = goal.saved >= goal.target;
              return (
                <TouchableOpacity key={goal.id} style={styles.goalCard} activeOpacity={0.8}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalIconWrap}>
                      <Text style={styles.goalIcon}>{goal.icon}</Text>
                    </View>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalDeadline}>{done ? '✅ Completed!' : `🗓 ${goal.deadline}`}</Text>
                    </View>
                    <View style={styles.goalAmounts}>
                      <Text style={styles.goalSaved}>${goal.saved.toLocaleString()}</Text>
                      <Text style={styles.goalTarget}>of ${goal.target.toLocaleString()}</Text>
                    </View>
                  </View>
                  <View style={styles.goalTrack}>
                    <View style={[styles.goalFill, { width: `${pct}%`, backgroundColor: done ? '#F5C451' : goal.color }]} />
                  </View>
                  <View style={styles.goalFooter}>
                    <Text style={[styles.goalPct, { color: done ? '#F5C451' : goal.color }]}>{Math.round(pct)}% reached</Text>
                    {!done && (
                      <TouchableOpacity
                        style={[styles.addMoneyBtn, { borderColor: goal.color }]}
                        onPress={() => Alert.alert('Add Money', `Adding to "${goal.title}" coming soon!`)}
                      >
                        <Text style={[styles.addMoneyText, { color: goal.color }]}>+ Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Auto-save tips */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Smart Tips</Text>
            {TIPS.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <View style={styles.tipIcon}><Text style={styles.tipIconText}>{tip.icon}</Text></View>
                <View style={styles.tipInfo}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDesc}>{tip.desc}</Text>
                </View>
                <TouchableOpacity style={styles.enableBtn} onPress={() => Alert.alert('Enable', 'Feature coming soon!')}>
                  <Text style={styles.enableText}>Enable</Text>
                </TouchableOpacity>
              </View>
            ))}

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
  addBtn: {
    backgroundColor: '#F5C451', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#0B0D29' },

  heroCard: {
    marginHorizontal: 22, backgroundColor: '#1A1A3E',
    borderRadius: 28, padding: 22, marginBottom: 0,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  heroLabel: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  heroAmount: { fontSize: 40, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1, marginBottom: 16 },
  heroProgress: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  heroTrack: {
    flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4, overflow: 'hidden',
  },
  heroFill: { height: '100%', backgroundColor: '#4ADE80', borderRadius: 4 },
  heroPercent: { fontSize: 14, fontWeight: '800', color: '#4ADE80' },
  heroSub: { fontSize: 12, color: '#64748B', marginBottom: 20 },

  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18, padding: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 3 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  sheet: {
    backgroundColor: '#FAF9F5', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 22, marginTop: 20,
  },
  sheetHandle: {
    width: 44, height: 4, backgroundColor: '#D1D5DB',
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 20,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 14 },

  goalCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22,
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  goalIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  goalIcon: { fontSize: 22 },
  goalInfo: { flex: 1, marginLeft: 12 },
  goalTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  goalDeadline: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  goalAmounts: { alignItems: 'flex-end' },
  goalSaved: { fontSize: 15, fontWeight: '800', color: '#111827' },
  goalTarget: { fontSize: 11, color: '#9CA3AF' },
  goalTrack: {
    height: 7, backgroundColor: '#F3F4F6', borderRadius: 4,
    marginBottom: 10, overflow: 'hidden',
  },
  goalFill: { height: '100%', borderRadius: 4 },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalPct: { fontSize: 12, fontWeight: '700' },
  addMoneyBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 12, borderWidth: 1.5,
  },
  addMoneyText: { fontSize: 12, fontWeight: '700' },

  tipCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  tipIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  tipIconText: { fontSize: 20 },
  tipInfo: { flex: 1, marginLeft: 12 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  tipDesc: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  enableBtn: {
    backgroundColor: '#0B0D29', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  enableText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
});
