import React from 'react';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';

// Lightweight vector icon set to replace emoji in high-visibility chrome.
// All icons: 24x24 viewBox, currentColor.

export const HomeIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.2 10.6L12 3.4l8.8 7.2"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.5 9.8V20.5h13V9.8"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M9.8 20.5v-6h4.4v6" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const StatsIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 20v-7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 20V5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M17 20v-9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M3.5 20.5h17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const CardsIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke={color} strokeWidth="1.8" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.8" />
    <Line x1="6.5" y1="14.5" x2="10.5" y2="14.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

export const ActivityIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2.5 12.5h4.2l3-7 4.4 14 3.2-7h4.2" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3.1" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.7 5.7l1.9 1.9M16.4 16.4l1.9 1.9M18.3 5.7l-1.9 1.9M7.6 16.4l-1.9 1.9"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </Svg>
);

export const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#64748B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9.5l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#F59E0B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.2l7 2.6v4.1c0 4.3-2.9 7.9-7 9.9-4.1-2-7-5.6-7-9.9V5.8l7-2.6z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M9 11.6l2.1 2.1L15.2 9.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const DocumentIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#2563EB',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 3.5h8l4 4V20.5H6z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    <Path d="M14 3.5V8h4" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Line x1="9" y1="15.5" x2="15" y2="15.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>
);

export const BankIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#2563EB',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3.5 9.5L12 4.5l8.5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M5 10v6.5M9 10v6.5M15 10v6.5M19 10v6.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Line x1="3.5" y1="19" x2="20.5" y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const GearIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#2563EB',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3.1" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.7 5.7l1.9 1.9M16.4 16.4l1.9 1.9M18.3 5.7l-1.9 1.9M7.6 16.4l-1.9 1.9"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </Svg>
);

export const PersonIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.6" fill={color} opacity="0.92" />
    <Path
      d="M4.5 20.5c.4-4.2 3.4-6.4 7.5-6.4s7.1 2.2 7.5 6.4"
      stroke={color}
      opacity="0.92"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export const BellIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4a5.5 5.5 0 00-5.5 5.5V15l-1.8 2.6a.6.6 0 00.5.95h13.6a.6.6 0 00.5-.95L17.5 15V9.5A5.5 5.5 0 0012 4z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M9.6 20a2.6 2.6 0 004.8 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
  </Svg>
);

export const EyeIcon: React.FC<{ size?: number; color?: string; off?: boolean }> = ({
  size = 24,
  color = '#FFFFFF',
  off = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
      fill="none"
    />
    <Circle cx="12" cy="12" r="2.8" stroke={color} strokeWidth="1.7" fill="none" />
    {off && <Line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth="1.7" strokeLinecap="round" />}
  </Svg>
);

export const PaperPlaneIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#2563EB',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.5 2.5l-8.7 17.4-3.4-8.2L1.5 8.2l20-5.7z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M21.5 2.5L9.4 11.7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const WalletPlusIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.5 7.5A2 2 0 015.5 5.5h11a2 2 0 012 2V9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M5.5 5.5V8a1.5 1.5 0 001.5 1.5h12A1.5 1.5 0 0120.5 11v7.5a2 2 0 01-2 2h-13a2 2 0 01-2-2v-13z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    <Line x1="11" y1="12.5" x2="11" y2="17.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="8.5" y1="15" x2="13.5" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const PlusIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </Svg>
);

export const LockIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="10.5" width="14" height="9.5" rx="2.2" stroke={color} strokeWidth="1.8" fill="none" />
    <Path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <Circle cx="12" cy="15.2" r="1.4" fill={color} />
  </Svg>
);

export const RepeatIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="m17 2 4 4-4 4" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M3 11v-1a4 4 0 0 1 4-4h14" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="m7 22-4-4 4-4" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M21 13v1a4 4 0 0 1-4 4H3" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const SearchIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10.5" cy="10.5" r="6.1" stroke={color} strokeWidth="1.8" />
    <Line x1="15.1" y1="15.1" x2="20" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const CloseIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

/** Four-pointed filled sparkle (Invest badge, AI banner). */
export const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2.5C13.5 6.5 17.5 10.5 21.5 12C17.5 13.5 13.5 17.5 12 21.5C10.5 17.5 6.5 13.5 2.5 12C6.5 10.5 10.5 6.5 12 2.5Z"
      fill={color}
    />
  </Svg>
);

/** Three horizontal dots — the "More" action. */
export const MoreIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="4.8" cy="12" r="1.7" fill={color} />
    <Circle cx="12" cy="12" r="1.7" fill={color} />
    <Circle cx="19.2" cy="12" r="1.7" fill={color} />
  </Svg>
);

/** Ascending trend line with arrow — the Invest action. */
export const ChartUpIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 17.5l5-5 3.4 3.4L20 8"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M15 8h5v5" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

/** Candlestick bars — the Market tab. */
export const CandlestickIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 4.5v3.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Rect x="4.7" y="7.9" width="2.6" height="7" rx="0.7" stroke={color} strokeWidth="1.7" />
    <Path d="M6 14.9V19.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M12 3v5.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Rect x="10.7" y="8.4" width="2.6" height="8.2" rx="0.7" stroke={color} strokeWidth="1.7" />
    <Path d="M12 16.6V21" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M18 5.5v3.6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Rect x="16.7" y="9.1" width="2.6" height="5.6" rx="0.7" stroke={color} strokeWidth="1.7" />
    <Path d="M18 14.7V18.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>
);

/** ₿ monogram — Bitcoin market card. */
export const BitcoinIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#F7931A',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9.5 3.5v17" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path
      d="M9.5 3.5c3.6 0 6 1.7 6 4 0 1.5-.8 2.7-2.1 3.3L9.5 11M9.5 12.9c3.8 0 6.2 1.8 6.2 4.2 0 2.2-1.6 3.9-4.3 3.9H9.5"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

/** Ξ monogram — Ether market card. */
export const EtherIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#A5B4FC',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="6" y1="5" x2="18" y2="5" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    <Line x1="8.5" y1="12" x2="15.5" y2="12" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    <Line x1="6" y1="19" x2="18" y2="19" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
  </Svg>
);

export const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

/** 🏦 Bank – columns + roof */
export const BankNavIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9.5L12 4l9 5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 10v6.5M9 10v6.5M15 10v6.5M19 10v6.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M3 19h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

/** 📷 QR / Scan to Pay */
export const ScanIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* top-left corner */}
    <Path d="M3 9V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* top-right corner */}
    <Path d="M21 9V5a2 2 0 0 0-2-2h-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* bottom-left corner */}
    <Path d="M3 15v4a2 2 0 0 0 2 2h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* bottom-right corner */}
    <Path d="M21 15v4a2 2 0 0 1-2 2h-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* inner scan line */}
    <Path d="M7 12h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

/** 🎁 Rewards – gift box */
export const RewardsIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 12v9H4v-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 7H2v5h20V7z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <Path d="M12 22V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M12 7c0 0-2-4 0-4s2 4 0 4z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <Path d="M12 7c0 0 2-4 4-3s-2 3-4 3z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
  </Svg>
);

/** 🐷 Saver – piggy bank */
export const SaverIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 11a7 7 0 0 1-7 7H8a7 7 0 1 1 0-14h4a7 7 0 0 1 7 7z"
      stroke={color} strokeWidth="1.8" strokeLinejoin="round"
    />
    <Path d="M19 11h2l.5 3H19" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 17.5V20M13 17.5V20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="15.5" cy="9.5" r="0.8" fill={color} />
    <Path d="M8 3.5c1-.8 3-1 4 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

export const CreditCardIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="3" stroke={color} strokeWidth="1.8" />
    <Line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="1.8" />
    <Line x1="6" y1="15" x2="10" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const TransferIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 4l4 4-4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 8h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M7 20l-4-4 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 16H3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const TvIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#3B82F6',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="7" width="20" height="13" rx="2" stroke={color} strokeWidth="1.8" />
    <Path d="M17 2l-5 5-5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BriefcaseIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#10B981',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8" />
    <Path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 12v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const PackageIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#F59E0B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16.5 9.4L7.5 4.21M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 22.08V12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const LaptopIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#8B5CF6',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.8" />
    <Path d="M2 20h20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const ZapIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#EAB308',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);