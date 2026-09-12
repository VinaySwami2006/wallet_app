# Card ⇄ Wallet Shuffle Interaction — Design

## Goal
The virtual cards **live inside the 3D wallet**. Tapping a card slides it out of the
deck (front-facing) and back, with a smooth spring shuffle. Cards the user has **not
added** are shown as locked/empty and do not expand.

## Interaction model
- **Wallet state (default):** stacked deck of cards peeking at the top of the leather
  pouch. Cards are tappable. `pointerEvents` on the deck is enabled only for cards the
  user owns.
- **Front state (on tap):** the tapped card animates out of the deck toward the viewer
  (scale + translate + z-order), opening "above" the leather. A scrim softens the
  background; the card shows its full details (number, holder, expiry, status).
- **Return:** tap the front card again (or scrim) → it shuffles back into the deck.
  Exit is faster than enter (~70% duration).
- **No card / lock:** if the user owns no cards, the deck slot shows an empty/wallet
  slot with "No cards yet · Add one" affordance. Tapping a locked (not-owned) card
  does nothing visually except a gentle "bounce-block" micro-interaction + toast
  "This card is locked".

## Cards model
```ts
export interface BankCard {
  id: string;
  holderName: string;
  last4: string;
  brand: 'VISA';            // (future: Mastercard, Amex)
  expiry: string;           // '05/29'
  color: [string, string];  // gradient top/bottom
  isUserAdded: boolean;     // gating flag
  status: 'active' | 'locked';
}
```
Card colors cycle a palette built from the app tokens (violet `#8B5CF6`, blue
`#2563EB`, etc.) so the deck stays on-brand.

## Animation spec (Reanimated)
| Property | Enter | Exit |
|---|---|---|
| timing | spring (280ms, damping 18) | timing (180ms, ease-out) |
| translateY | deck → above-leather | reverse |
| scale | 1 → 1.06 (subtle) | back to 1 |
| z-order | card lifts above pouch | returns under pouch |
| opacity scrim | 0 → 0.45 | → 0 |
- **Reduced motion:** `useReducedMotion()` (Reanimated) → skip transform animation,
  snap to final state (`lift.value = 1` / `0` immediately).
- **Interruptible:** tapping mid-motion cancels and completes to the new state
  (`cancelAnimation`, shared values latch).
- **No layout shift:** all motion via transform (translate/scale) + zIndex, never
  width/height — CLS-free per skill.
- **Touch targets:** cards ≥44pt tall in deck; dedicated expand handle. Deck cards get
  `accessibilityRole="button"`, `accessibilityLabel` per card, and `accessibilityState`
  for selected/expanded.

## Integration
- New `BankCard` model in `src/models/types.ts`.
- New `WalletCard` component (decorative card face, reused by deck + front view).
- `WalletBalanceHero` gains `cards: BankCard[]` prop; deck + scrim + front-overlay live
  here (spatial continuity: card stays in same viewport, no navigation).
- Mock data + user-added gating wired through `App.tsx` (2 of 3 cards default user-added).
- Cards & Wallet tab keeps its own card; hero shuffle is the primary showcase.

## Accessibility
- `useReducedMotion()` (Reanimated) respects the OS reduce-motion setting.
- Deck `TouchableOpacity`+`onPress` gives full tap area; locked cards read their label
  and do not expand.
- `accessibilityRole="button"` + `accessibilityState` (selected/disabled) on deck cards;
  open/close buttons labelled; locked cards advertise "locked".
- Live balance/eyetoggle unaffected.

## Skill rules applied
- Reanimated (stack rule) + spring physics + exit-faster + shared-element continuity.
- Reduced-motion (`AccessibilityInfo`), touch ≥44pt, vector icons, interactive state.
- Palette stays on existing app tokens (search returned only a mismatched web palette;
  per skill guidance, keeping the app's established master).