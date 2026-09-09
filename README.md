# 💳 Wallet App

A modern digital wallet application built with **Flutter**, **Node.js/Express**, and **PostgreSQL**.

The application is designed around a simple Wallet ID-based payment system where users can send money directly from one Wallet account to another.

---

## 📱 Project Overview

Wallet App is a digital wallet prototype focused on making peer-to-peer payments simple, fast, and easy to understand.

The core payment flow is:

User → Wallet ID → Recipient Wallet → Balance Update → Transaction History

The project currently focuses on building the complete **Wallet-to-Wallet payment experience** before integrating external banking/UPI services.

---

## ✨ Current Features

### 💰 Wallet

- Wallet balance
- Unique Wallet ID
- User profile
- Wallet information
- Receiving QR code

### 💸 Wallet-to-Wallet Payments

- Pay Friend
- Recipient Name
- Recipient Wallet ID
- Enter payment amount
- Insufficient balance validation
- Backend transaction processing
- Real-time wallet balance update

### 📷 QR Payments

- QR code scanner
- Wallet QR recognition
- Wallet ID extraction from QR
- Payment confirmation
- Wallet-to-Wallet QR payments

### 📊 Transactions

- Transaction history
- Received / Paid transactions
- Search transactions
- Amount filters
- Date filters
- Transaction details
- Transaction reference numbers

### 👤 Profile

- User information
- Email
- Phone number
- Wallet ID
- Receiving QR

---

## 🛠️ Technology Stack

### Frontend

- Flutter
- Dart

### Backend

- Node.js
- Express.js
- REST API

### Database

- PostgreSQL

### Packages

- `http`
- `shared_preferences`
- `qr_flutter`
- `mobile_scanner`

---

## 🏗️ Architecture

```text
┌──────────────────────────┐
│      Flutter App         │
│          Dart            │
└────────────┬─────────────┘
             │
             │ HTTP / REST API
             ▼
┌──────────────────────────┐
│    Node.js + Express     │
│        Backend           │
└────────────┬─────────────┘
             │
             │ SQL
             ▼
┌──────────────────────────┐
│       PostgreSQL         │
│       wallet_db          │
└──────────────────────────┘
