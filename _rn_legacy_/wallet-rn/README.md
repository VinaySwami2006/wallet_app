# 💳 Modern Wallet App - React Native

A modern digital wallet application built with **React Native/Expo**, **Node.js/Express**, and **PostgreSQL**.

![Tech Stack](https://img.shields.io/badge/React%20Native-Expo-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-orange)

---

## 📱 Project Overview

Modern Wallet App is a beautifully designed digital wallet prototype focused on making peer-to-peer payments simple, fast, and visually stunning. Built with the exact UI specifications from the design mockups.

### Core Payment Flow

User → Wallet ID → Recipient Wallet → Balance Update → Transaction History

---

## ✨ Features

### 💰 Wallet Management
- Real-time wallet balance
- Unique Wallet ID system
- User profile management
- Balance privacy toggle
- QR code receiving

### 💸 Wallet-to-Wallet Payments
- Pay friends via Wallet ID
- Quick top-up avatars
- Amount validation
- Backend transaction processing
- Real-time balance updates
- Transaction confirmation

### 📊 Transaction History
- Complete transaction history
- Income/Expense filtering
- Monthly spending overview bar chart
- Filter chips (All, Income, Expense)
- Categorized transaction list
- Transaction details modal

### 💳 Virtual Cards
- Virtual card carousel with page indicators
- VISA and Mastercard support
- Card holder information
- Masked card numbers
- Expiry dates
- Real-time balance display

### 🎨 Modern UI Design System
- Vibrant Blue primary palette (`#2563EB`, `#3B82F6`)
- Hero gradient containers
- Directional transaction arrows
- Smooth animations
- Clean Material Design 3 aesthetics
- Upgrade account banner
- Quick action tiles

---

## 🛠️ Technology Stack

### Frontend
- **React Native** with **Expo**
- **TypeScript**
- **Expo Linear Gradient**
- **React Native SVG**
- **AsyncStorage**

### Backend
- **Node.js**
- **Express.js**
- **REST API**

### Database
- **PostgreSQL**

### Key Packages
- `expo-linear-gradient` - Hero gradient containers
- `@react-native-async-storage/async-storage` - Local persistence
- `axios` - HTTP client
- `expo-camera` - QR scanning
- `react-native-svg` - Vector graphics

---

## 🏗️ Project Structure

```
wallet-rn/
├── App.tsx                          # Main app with navigation & modals
├── src/
│   ├── theme/
│   │   └── colors.ts                # Design tokens & theme
│   ├── models/
│   │   └── types.ts                 # TypeScript interfaces
│   ├── services/
│   │   └── api.ts                   # Backend API integration
│   ├── components/
│   │   ├── VirtualCard.tsx          # Virtual card component
│   │   └── WalletComponents.tsx     # Reusable UI components
│   └── screens/
│       ├── OnboardingWelcomeScreen.tsx
│       ├── FinanceHomeScreen.tsx
│       ├── CardsAndWalletScreen.tsx
│       └── TransactionHistoryScreen.tsx
└── backend/                         # Node.js backend (existing)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator
- PostgreSQL database running

### Installation

1. **Install dependencies:**
```bash
cd wallet-rn
npm install
```

2. **Configure backend URL:**
Edit `src/services/api.ts` and update `BASE_URL`:
```typescript
const BASE_URL = 'http://YOUR_IP:3000';
```

3. **Start the backend:**
```bash
cd ../backend
npm install
npm start
```

4. **Start Expo:**
```bash
cd ../wallet-rn
npm start
```

5. **Run on device:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

---

## 🎨 Design System

The app implements the exact design specifications from the mockup:

### Color Palette
- **Primary Blue**: `#2563EB` / `#3B82F6`
- **Hero Gradients**: `#3B82F6` → `#1E40AF`
- **Background**: `#F8FAFC` (Slate 50)
- **Success Green**: `#10B981` / `#ECFDF5`
- **Expense Red**: `#EF4444` / `#FEF2F2`
- **Warning Amber**: `#F59E0B` / `#FFFBEB`

### Typography
- **Display Large**: 32px, weight 800
- **Headline Medium**: 22px, weight 700
- **Body Primary**: 14-15px, weight 600
- **Caption**: 11px, weight 500

### Components
- **Border Radius**: 16-28px for cards, 10-14px for pills
- **Shadows**: Soft elevation with primary glow for cards
- **Directional Arrows**: ↙ for income (green), ↗ for expense (red)

---

## 📱 Screens

### 1. **Onboarding Welcome**
- Hero card preview with mock balance
- Page indicators
- "Manage and Organize Your Finance" headline
- Get Started CTA button
- Sign In link

### 2. **Finance Home**
- Blue hero container with balance
- Eye toggle for balance privacy
- Send Money / Add Money pill buttons
- Upgrade Account banner
- Quick Actions grid (Topup, Bills, Savings, Cards)
- Recent Transactions list

### 3. **Cards & Wallet**
- Virtual card carousel with VISA/Mastercard
- Page dot indicators
- Quick Top-Up avatar row with Add button
- Latest Transactions horizontal scroll

### 4. **Transaction History**
- Blue header with Income/Expense summary cards
- Monthly spending bar chart overview
- Filter chips (All, Income, Expense)
- Grouped transaction list with directional arrows

---

## 🔌 Backend Integration

The app integrates with the existing Node.js/PostgreSQL backend:

### API Endpoints
- `GET /api/users/wallet/:walletId` - Fetch user by Wallet ID
- `GET /api/transactions/user/:userId` - Get user transactions
- `POST /api/transactions/wallet-transfer` - Execute wallet transfer

### Features
- Automatic backend sync on app launch
- Graceful fallback to mock data if backend offline
- Real-time balance updates after transactions
- Transaction history from PostgreSQL

---

## 📝 Notes

- The app uses mock data enriched with backend sync for a rich preview experience
- Backend URL configured for local network testing
- QR scanner feature uses `expo-camera` (camera permissions required)
- All 4 core screens match the exact UI mockup specifications
- Bottom navigation with 5 tabs (Home, Stats, Cards, Activity, Settings)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Development

Built with the Modern Wallet Design System specification (`design.md`) - implementing vibrant blue gradients, directional transaction semantics, and fluid micro-interactions for a premium fintech experience.
