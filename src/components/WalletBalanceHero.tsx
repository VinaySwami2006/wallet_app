import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useReducedMotion,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { UserProfile, BankCard } from '../models/types';
import { WalletCard } from './WalletCard';
import { EyeIcon, PlusIcon, RepeatIcon, LockIcon } from './icons';
import { formatINR } from '../utils/currency';

interface WalletBalanceHeroProps {
  user: UserProfile;
  cards: BankCard[];
  onSendMoney: () => void;
  onAddMoney: () => void;
  onProfileTap: () => void;
  onNotificationTap?: () => void;
  onLockedCardTap?: (card: BankCard) => void; // optional bounce/block feedback
}

const SPRING = { damping: 18, stiffness: 180, mass: 1, restDisplacementThreshold: 0.01, restSpeedThreshold: 0.01 };
const EXIT_DURATION = 180; // exit faster than enter (~70% of enter)

/**
 * 3D Wallet & Card Stack hero.
 *
 * A leather pocket in deep royal purple holds the front-pocket "Total Balance",
 * while a deck of payment cards peeks out through the curved slot at the top.
 * Cards LIVE inside the wallet: tapping a user-added card shuffles it out of
 * the deck into a front-facing view (spring lift + soft scrim); tapping again
 * shuffles it back. Locked (not user-added) cards do not expand.
 */
export const WalletBalanceHero: React.FC<WalletBalanceHeroProps> = ({
  user,
  cards,
  onSendMoney,
  onAddMoney,
  onLockedCardTap,
}) => {
  const { width } = useWindowDimensions();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // ---- animation state (shared values) ----
  const lift = useSharedValue(0); // 0 = in deck, 1 = front-facing
  const scrimOpacity = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  const activeCard = useMemo(
    () => cards.find((c) => c.id === activeCardId) ?? null,
    [cards, activeCardId],
  );

  const balanceAmount = isBalanceVisible ? formatINR(user.balance) : '••••••••';
  const maskedAccount =
    user.walletId.length > 4 ? `*** *** ${user.walletId.slice(-4)}` : '*** *** 3569';

  // Real card geometry. The host screen gives the hero (width - 40) and the
  // deckSlot is inset 20 on each side, so the rendered card width is (width - 80).
  const POUCH_TOP = 118; // computed from pouchMarginTop below
  const cardWidth = Math.min(width - 80, 380);
  const cardShortSide = Math.round(cardWidth * 0.63);
  const peek = 60;
  const deckSlotTop = 46;
  const frontCardTop = deckSlotTop + 12;   // 58
  const pouchMarginTop = frontCardTop + peek; // 118 → front-cover / pocket top

  const owned = useMemo(() => cards.filter((c) => c.isUserAdded), [cards]);
  // The deck fans like cards tucked in a real wallet: front card straight,
  // cards behind it rotate slightly (back-most = most rotated) so the stack
  // reads as a shuffled pile poking out of the compartment.
  const deck = useMemo(
    () =>
      cards.slice(0, 3).map((card, i) => {
        const isFront = i === 0;
        return {
          card,
          top: isFront ? 0 : -7 * i, // back cards sit HIGHER → classic layered peek
          z: 3 - i,
          angle: isFront ? 0 : (i === 1 ? 3 : 6), // 0 / +3 / +6 degrees fan
        };
      }),
    [cards],
  );

  const openCard = (card: BankCard) => {
    // interruptible: cancel any in-flight anim and latch to new state
    setActiveCardId(card.id);
    if (reduceMotion) {
      lift.value = 1;
      scrimOpacity.value = 1;
      return;
    }
    lift.value = withSpring(1, SPRING);
    scrimOpacity.value = withTiming(0.45, { duration: 220 });
  };

  const closeCard = () => {
    const finish = () => setActiveCardId(null);
    if (reduceMotion) {
      lift.value = 0;
      scrimOpacity.value = 0;
      finish();
      return;
    }
    scrimOpacity.value = withTiming(0, { duration: EXIT_DURATION });
    // exit faster than enter
    lift.value = withTiming(0, { duration: EXIT_DURATION }, (finished) => {
      if (finished) runOnJS(finish)();
    });
  };

  const handleCardTap = (card: BankCard) => {
    if (!card.isUserAdded) {
      onLockedCardTap?.(card);
      return; // do NOT expand locked cards
    }
    if (activeCardId === card.id) {
      closeCard();
    } else if (activeCardId) {
      // switching to another open card: snap the old rest position, lift the new
      openCard(card);
    } else {
      openCard(card);
    }
  };

  // ---- animated styles ----
  const scrimStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  // front-facing card lifts toward viewer above the pouch.
  // At rest (progress 0) the card sits peeking at its deck position; when
  // opened (progress 1) it translates UP (negative) so it clears the pouch
  // and grows slightly. Exit reverses this faster than enter.
  const frontCardStyle = useAnimatedStyle(() => {
    const progress = lift.value;
    const liftUp = cardShortSide * 0.34;
    const translateY = (1 - progress) * 0 - progress * liftUp; // -liftUp when open
    const scale = 1 + progress * 0.04; // subtle grow, no layout shift
    const zIndex = progress > 0.5 ? 30 : 2;
    return {
      transform: [{ translateY }, { scale }],
      zIndex,
    };
  });

  // deck cards stay put, front one slightly dims when another is active.
  // Driven from the shared value so it animates with open/close (not state).
  const deckDimStyle = useAnimatedStyle(() => ({
    opacity: 1 - lift.value * 0.35, // dim slightly as a card lifts
  }));

  return (
    <View>
      {/* ============ WALLET BACK COVER = dark leather body the cards live in ============ */}
      <View style={[styles.backCover, { top: 36 }]} pointerEvents="none">
        <LinearGradient
          colors={['#41208A', '#331564', '#270F4E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={styles.backStitch} />
        {/* lip highlight along the top edge where the cards slide out */}
        <View pointerEvents="none" style={styles.backLip} />
      </View>

      {/* ============ CARD COMPARTMENT = the dark sleeve the deck lives in ============ */}
      <View
        style={[styles.compartment, { top: 44, height: cardShortSide + 26 }]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['rgba(6,3,18,0.94)', 'rgba(22,11,48,0.5)', 'rgba(6,3,18,0.92)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* mouth of the pocket: dark slit just above the card tips */}
        <View style={styles.slitMouth} />
      </View>

      {/* ============ CARD DECK (fanned, peeking up out of the compartment) ============ */}
      <View style={[styles.deckSlot, { top: deckSlotTop, height: cardShortSide }]}>
        <View style={[styles.deckArea, { height: cardShortSide }]}>
          {deck.map(({ card, top, z, angle }, i) => {
            const isActive = activeCard?.id === card.id;
            return (
              <TouchableOpacity
                key={card.id}
                activeOpacity={0.9}
                onPress={() => handleCardTap(card)}
                style={[styles.deckCardBtn, { top, zIndex: isActive ? 20 : z }]}
                accessibilityRole="button"
                accessibilityLabel={`${card.brand} card ending ${card.last4}${card.isUserAdded ? ', tap to view' : ', locked'}`}
                accessibilityState={{ selected: isActive, disabled: !card.isUserAdded }}
              >
                <Animated.View
                  style={[
                    styles.deckCard,
                    { height: cardShortSide },
                    angle !== 0 && { transform: [{ rotate: `${angle}deg` }] },
                    isActive ? frontCardStyle : deckDimStyle,
                  ]}
                >
                  <WalletCard card={card} />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
          {/* if no user-added cards, fall back to the locked deck */}
          {owned.length === 0 && deck.length === 0 && (
            <View style={[styles.noCards, { height: cardShortSide * 0.55 }]}>
              <Text style={styles.noCardsText}>No cards yet · Add one</Text>
            </View>
          )}
        </View>
      </View>

      {/* ============ SCENTED OVERLAY (when a card is lifted) ============ */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={activeCard ? 'auto' : 'none'}
      >
        <Animated.View style={[styles.scrim, scrimStyle]} />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={activeCard ? closeCard : undefined}
          accessibilityRole="button"
          accessibilityLabel="Close card"
        />
      </View>

      {/* ============ LEATHER FRONT POCKET (covers the deck's lower half) ============ */}
      <LinearGradient
        colors={['#6D28D9', '#5B2A99', '#4C1D95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.pouch, { marginTop: pouchMarginTop }]}
      >
        <View pointerEvents="none" style={styles.slitMouthFront} />
        <View pointerEvents="none" style={styles.slotHighlight} />
        <View pointerEvents="none" style={styles.stitch} />

        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>
            {activeCard ? `${activeCard.brand} Card` : 'Total Balance'}
          </Text>
          {activeCard && !activeCard.isUserAdded && (
            <View style={styles.lockedBadge}>
              <LockIcon size={14} color="#FFFFFF" />
              <Text style={styles.lockedBadgeText}>Locked</Text>
            </View>
          )}
        </View>

        {activeCard ? (
          <View style={styles.activeCardMeta}>
            <Text style={styles.balanceText} numberOfLines={1}>
              •••• •••• •••• {activeCard.last4}
            </Text>
            <Text style={styles.accountLine}>
              {activeCard.holderName} · Valid thru {activeCard.expiry}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount} numberOfLines={1}>
                {balanceAmount}
              </Text>
              <Text style={styles.balanceUnit}>₹</Text>
            </View>
            <Text style={styles.accountLine}>
              {isBalanceVisible ? `Account no: ${maskedAccount}` : '•••• •••• •••• ••••'}
            </Text>
          </>
        )}

        <View style={styles.actions}>
          {activeCard ? (
            <TouchableOpacity
              onPress={closeCard}
              activeOpacity={0.85}
              style={styles.pill}
              accessibilityRole="button"
              accessibilityLabel="Back to wallet"
            >
              <RepeatIcon size={17} color="#FFFFFF" />
              <Text style={styles.pillText}>Back to Wallet</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={onAddMoney}
                activeOpacity={0.85}
                style={styles.pill}
                accessibilityRole="button"
                accessibilityLabel="Add Balance"
              >
                <PlusIcon size={17} color="#FFFFFF" />
                <Text style={styles.pillText}>Add Balance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSendMoney}
                activeOpacity={0.85}
                style={styles.iconBtn}
                accessibilityRole="button"
                accessibilityLabel="Transfer"
              >
                <RepeatIcon size={21} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                activeOpacity={0.85}
                style={styles.iconBtn}
                accessibilityRole="button"
                accessibilityLabel={isBalanceVisible ? 'Hide balance' : 'Show balance'}
                accessibilityState={{ selected: !isBalanceVisible }}
              >
                <EyeIcon size={20} color="rgba(255,255,255,0.9)" off={!isBalanceVisible} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  // back cover: dark leather body that runs the full height of the wallet
  backCover: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    overflow: 'hidden',
    zIndex: 0,
    shadowColor: '#1E0A3C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 4,
  },
  backStitch: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 24,
  },
  backLip: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  // card compartment: the dark sleeve the deck lives in
  compartment: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 28,
    overflow: 'hidden',
    zIndex: 0,
  },
  slitMouth: {
    position: 'absolute',
    top: 4,
    left: 18,
    right: 18,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  slitMouthFront: {
    position: 'absolute',
    top: 2,
    left: 26,
    right: 26,
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(12,4,28,0.7)',
  },
  deckSlot: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1,
  },
  deckArea: {
    position: 'relative',
  },
  deckCardBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  deckCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#3B0764',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 22,
    elevation: 8,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  noCards: {
    ...StyleSheet.absoluteFill,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(139,92,246,0.5)',
  },
  noCardsText: {
    color: 'rgba(139,92,246,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  lockedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  activeCardMeta: {
    marginTop: 6,
  },
  pouch: {
    marginTop: 0,
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 46,
    paddingBottom: 22,
    overflow: 'hidden',
    zIndex: 2,
  },
  slotHighlight: {
    position: 'absolute',
    top: 22,
    left: 38,
    right: 38,
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  stitch: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 22,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
  },
  balanceLabel: {
    color: 'rgba(221,214,254,0.9)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    flex: 1,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  balanceUnit: {
    color: 'rgba(221,214,254,0.8)',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginLeft: 7,
    marginBottom: 4,
  },
  accountLine: {
    color: 'rgba(221,214,254,0.9)',
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 5,
    letterSpacing: 0.1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});