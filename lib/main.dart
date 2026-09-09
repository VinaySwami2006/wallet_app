import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'services/api_service.dart';

void main() {
  runApp(const WalletApp());
}

// ============================================================
// APP
// ============================================================

class WalletApp extends StatelessWidget {
  const WalletApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Wallet',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF673AB7),
        ),
        scaffoldBackgroundColor:
            const Color(0xFFF9F7FC),
      ),
      home: const HomeScreen(),
    );
  }
}

// ============================================================
// HOME SCREEN
// ============================================================

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() =>
      _HomeScreenState();
}

class _HomeScreenState
    extends State<HomeScreen> {
  double balance = 0.0;

  List<Map<String, dynamic>> transactions =
      [];

  String userName = '';
  String email = '';
  String phone = '';
  String profilePhoto = '';

  @override
  void initState() {
    super.initState();
    loadData();
  }

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  Future<void> loadData() async {
  try {
    // Get user + wallet balance from backend
    final userData =
        await ApiService.getUserByWalletId(
      'WLT-7703948264',
    );

    // Get transactions from backend
    final transactionData =
        await ApiService.getUserTransactions(1);

    final user =
        userData['user'] ?? {};

    final backendTransactions =
        List<Map<String, dynamic>>.from(
      transactionData['transactions'] ?? [],
    );

    setState(() {
      // REAL BALANCE FROM POSTGRESQL
      balance = double.tryParse(
            user['balance']?.toString() ?? '0',
          ) ??
          0.0;

      // USER DATA FROM BACKEND
      userName =
          user['name']?.toString() ?? '';

      email =
          user['email']?.toString() ?? '';

      phone =
          user['phone']?.toString() ?? '';

      // TRANSACTIONS FROM POSTGRESQL
      transactions =
          backendTransactions.map((transaction) {
        final bool received =
            transaction['receiver_user_id']
                    ?.toString() ==
                '1';

        return {
          'type':
              received ? 'Received' : 'Paid',

          'amount':
              double.tryParse(
                    transaction['amount']
                            ?.toString() ??
                        '0',
                  ) ??
                  0.0,

          'name': received
              ? transaction['sender_name']
              : transaction['receiver_name'],

          'date':
              transaction['created_at'],

          'reference':
              transaction['reference_number'],

          'status':
              transaction['status'],

          'description':
              transaction['description'],
        };
      }).toList();
    });
  } catch (error) {
    debugPrint(
      'Error loading data: $error',
    );

    if (!mounted) return;

    ScaffoldMessenger.of(context)
        .showSnackBar(
      const SnackBar(
        content: Text(
          'Unable to load wallet data.',
        ),
      ),
    );
  }
}

  // ==========================================================
  // REFERENCE NUMBER
  // ==========================================================

  String generateReferenceNumber() {
    final random = Random();

    final timestamp =
        DateTime.now().millisecondsSinceEpoch;

    final randomNumber =
        random.nextInt(9000) + 1000;

    return 'WLT$timestamp$randomNumber';
  }

  // ==========================================================
  // ADD MONEY
  // ==========================================================

  void addMoney(double amount) {
    final now = DateTime.now();

    setState(() {
      balance += amount;

      transactions.insert(
        0,
        {
          'type': 'Received',
          'amount': amount,
          'name': 'Wallet Top-up',
          'date': now.toIso8601String(),
          'reference':
              generateReferenceNumber(),
        },
      );
    });

  }

 // ==========================================================
// PAY FRIEND
// ==========================================================

void openPayFriend() {
  final nameController =
      TextEditingController();

  final walletIdController =
      TextEditingController();

  final amountController =
      TextEditingController();

  showDialog(
    context: context,
    builder: (dialogContext) {
      return AlertDialog(
        title: const Text(
          'Pay Friend',
        ),

        content: SingleChildScrollView(
          child: Column(
            mainAxisSize:
                MainAxisSize.min,
            children: [

              // FRIEND NAME
              TextField(
                controller:
                    nameController,
                textCapitalization:
                    TextCapitalization.words,
                decoration:
                    const InputDecoration(
                  labelText:
                      'Friend Name',
                  prefixIcon:
                      Icon(
                    Icons.person_outline,
                  ),
                  border:
                      OutlineInputBorder(),
                ),
              ),

              const SizedBox(
                height: 12,
              ),

              // WALLET ID
              TextField(
                controller:
                    walletIdController,
                textCapitalization:
                    TextCapitalization.characters,
                decoration:
                    const InputDecoration(
                  labelText:
                      'Wallet ID',
                  hintText:
                      'WLT-XXXXXXXXXX',
                  prefixIcon:
                      Icon(
                    Icons
                        .account_balance_wallet_outlined,
                  ),
                  border:
                      OutlineInputBorder(),
                ),
              ),

              const SizedBox(
                height: 12,
              ),

              // AMOUNT
              TextField(
                controller:
                    amountController,
                keyboardType:
                    const TextInputType
                        .numberWithOptions(
                  decimal: true,
                ),
                decoration:
                    const InputDecoration(
                  labelText:
                      'Amount',
                  prefixText:
                      '₹ ',
                  prefixIcon:
                      Icon(
                    Icons
                        .currency_rupee,
                  ),
                  border:
                      OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),

        actions: [

          // CANCEL
          TextButton(
            onPressed: () {
              Navigator.pop(
                dialogContext,
              );
            },
            child:
                const Text(
              'Cancel',
            ),
          ),

          // PAY
          ElevatedButton(
            onPressed: () async {
              final name =
                  nameController
                      .text
                      .trim();

              final walletId =
                  walletIdController
                      .text
                      .trim();

              final amount =
                  double.tryParse(
                amountController
                    .text
                    .trim(),
              );

              // VALIDATION
              if (name.isEmpty ||
                  walletId.isEmpty ||
                  amount == null ||
                  amount <= 0) {
                ScaffoldMessenger
                    .of(context)
                    .showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Please enter Friend Name, Wallet ID and a valid amount.',
                    ),
                  ),
                );

                return;
              }

              // Close Pay Friend dialog
              Navigator.pop(
                dialogContext,
              );

              // Send payment to backend
              await payMoney(
                amount,
                walletId,
                receiverName: name,
              );
            },
            child:
                const Text(
              'Pay',
            ),
          ),
        ],
      );
    },
  );
}
  // ==========================================================
  // MESSAGE
  // ==========================================================

  void showMessage(String message) {
    if (!mounted) {
      return;
    }

    ScaffoldMessenger.of(context)
        .showSnackBar(
      SnackBar(
        content: Text(message),
        behavior:
            SnackBarBehavior.floating,
      ),
    );
  }

  // ==========================================================
  // OPEN ADD MONEY SCREEN
  // ==========================================================

  void openAddMoney() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => AddMoneyScreen(
          onAddMoney: addMoney,
        ),
      ),
    );
  }

// ==========================================================
// PAY MONEY - BACKEND
// ==========================================================

Future<void> payMoney(
  double amount,
  String receiverWalletId, {
  String receiverName = 'Friend',
}) async {
  if (amount <= 0) {
    return;
  }

  if (amount > balance) {
    showMessage(
      'Insufficient wallet balance.',
    );
    return;
  }

  // Show loading
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (_) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    },
  );

  try {
    final result =
        await ApiService.walletTransfer(
      senderWalletId:
          'WLT-7703948264',
      receiverWalletId:
          receiverWalletId,
      amount: amount,
      description:
          'Payment to $receiverName',
    );

    // Close loading dialog
    if (mounted) {
      Navigator.pop(context);
    }

    // Get latest balance and transactions
    await loadData();

    if (!mounted) return;

    ScaffoldMessenger.of(context)
        .showSnackBar(
      SnackBar(
        content: Text(
          '₹${amount.toStringAsFixed(2)} paid to $receiverName successfully.',
        ),
      ),
    );

    debugPrint(
      'Payment successful: $result',
    );
  } catch (error) {
    // Close loading dialog
    if (mounted) {
      Navigator.pop(context);
    }

    if (!mounted) return;

    ScaffoldMessenger.of(context)
        .showSnackBar(
      SnackBar(
        content: Text(
          error.toString(),
        ),
      ),
    );
  }
}

  // ==========================================================
  // SCANNER
  // ==========================================================

  void openScanner() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ScannerScreen(
          onPayment: (
            name,
            amount, {
            String? upiId,
          }) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) =>
                    PaymentConfirmationScreen(
                  receiverName: name,
                  amount: amount,
                  upiId: upiId,
                  onConfirm: () async {
  if (amount > balance) {
    showMessage(
      'Insufficient wallet balance.',
    );
    return false;
  }

  // For Wallet QR, upiId contains the receiver Wallet ID.
  final receiverWalletId =
      (upiId != null &&
              upiId.startsWith('WLT-'))
          ? upiId
          : name;

  await payMoney(
    amount,
    receiverWalletId,
    receiverName: name,
  );

  return true;
},
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ==========================================================
  // PROFILE
  // ==========================================================

  void openProfile() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ProfileScreen(
          userName: userName,
          email: email,
          phone: phone,
          profilePhoto: profilePhoto,
        ),
      ),
    ).then((_) {
      loadData();
    });
  }

  // ==========================================================
  // TRANSACTION DETAILS
  // ==========================================================

  void openTransactionDetails(
    Map<String, dynamic> transaction,
  ) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) =>
            TransactionDetailsScreen(
          transaction: transaction,
        ),
      ),
    );
  }

  // ==========================================================
  // HOME UI
  // ==========================================================

  @override
  Widget build(BuildContext context) {
    final displayName =
        userName.trim().isEmpty
            ? 'Welcome'
            : userName.trim();

    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child:
                  SingleChildScrollView(
                physics:
                    const BouncingScrollPhysics(),
                padding:
                    const EdgeInsets.fromLTRB(
                  20,
                  18,
                  20,
                  100,
                ),
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    // HEADER
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment:
                                CrossAxisAlignment
                                    .start,
                            children: [
                              const Text(
                                'Hello 👋',
                                style: TextStyle(
                                  color:
                                      Colors.grey,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(
                                height: 4,
                              ),
                              Text(
                                displayName,
                                maxLines: 1,
                                overflow:
                                    TextOverflow
                                        .ellipsis,
                                style:
                                    const TextStyle(
                                  fontSize: 25,
                                  fontWeight:
                                      FontWeight
                                          .w800,
                                ),
                              ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap:
                              openProfile,
                          child:
                              profileAvatar(
                            size: 48,
                            photo:
                                profilePhoto,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(
                      height: 24,
                    ),

                    // BALANCE CARD
                    Container(
                      width: double.infinity,
                      padding:
                          const EdgeInsets.all(
                        24,
                      ),
                      decoration:
                          BoxDecoration(
                        gradient:
                            const LinearGradient(
                          begin:
                              Alignment
                                  .topLeft,
                          end:
                              Alignment
                                  .bottomRight,
                          colors: [
                            Color(
                                0xFF5B2FB5),
                            Color(
                                0xFF8E5BD5),
                          ],
                        ),
                        borderRadius:
                            BorderRadius
                                .circular(
                          28,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment
                                .start,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration:
                                    BoxDecoration(
                                  color: Colors
                                      .white
                                      .withValues(
                                    alpha: 0.14,
                                  ),
                                  borderRadius:
                                      BorderRadius
                                          .circular(
                                    13,
                                  ),
                                ),
                                child:
                                    const Icon(
                                  Icons
                                      .account_balance_wallet_outlined,
                                  color:
                                      Colors.white,
                                ),
                              ),
                              const SizedBox(
                                width: 10,
                              ),
                              const Text(
                                'Available Balance',
                                style:
                                    TextStyle(
                                  color:
                                      Colors.white70,
                                  fontSize:
                                      14,
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(
                            height: 17,
                          ),

                          FittedBox(
                            fit: BoxFit
                                .scaleDown,
                            alignment:
                                Alignment
                                    .centerLeft,
                            child: Text(
                              '₹ ${balance.toStringAsFixed(2)}',
                              style:
                                  const TextStyle(
                                color:
                                    Colors.white,
                                fontSize: 37,
                                fontWeight:
                                    FontWeight
                                        .w800,
                              ),
                            ),
                          ),

                          const SizedBox(
                            height: 20,
                          ),

                          Container(
                            height: 1,
                            color: Colors
                                .white
                                .withValues(
                              alpha: 0.15,
                            ),
                          ),

                          const SizedBox(
                            height: 13,
                          ),

                          const Row(
                            children: [
                              Icon(
                                Icons
                                    .verified_outlined,
                                color:
                                    Colors.white70,
                                size: 16,
                              ),
                              SizedBox(
                                width: 6,
                              ),
                              Text(
                                'Wallet ID',
                                style:
                                    TextStyle(
                                  color:
                                      Colors.white70,
                                  fontSize:
                                      12,
                                ),
                              ),
                              Spacer(),
                              Text(
                                '•••• 8264',
                                style:
                                    TextStyle(
                                  color:
                                      Colors.white,
                                  fontWeight:
                                      FontWeight
                                          .w700,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(
                      height: 28,
                    ),

                    // QUICK ACTION HEADER
                    Row(
                      mainAxisAlignment:
                          MainAxisAlignment
                              .spaceBetween,
                      children: [
                        const Text(
                          'Quick Actions',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight:
                                FontWeight.w800,
                          ),
                        ),
                        Text(
                          'Fast & easy',
                          style: TextStyle(
                            color: Colors
                                .grey
                                .shade500,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(
                      height: 14,
                    ),

                    // QUICK ACTIONS
                    Row(
                      children: [
                        Expanded(
                          child:
                              quickActionCard(
                            icon: Icons
                                .add_rounded,
                            title:
                                'Add Money',
                            subtitle:
                                'Top up wallet',
                            onTap:
                                openAddMoney,
                          ),
                        ),
                        const SizedBox(
                          width: 12,
                        ),
                        Expanded(
                          child:
                              quickActionCard(
                            icon: Icons
                                .person_outline_rounded,
                            title:
                                'Pay Friend',
                            subtitle:
                                'Send money',
                            onTap:
                                openPayFriend,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(
                      height: 28,
                    ),

                    // TRANSACTIONS HEADER
                    Row(
                      mainAxisAlignment:
                          MainAxisAlignment
                              .spaceBetween,
                      children: [
                        const Text(
                          'Recent Transactions',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight:
                                FontWeight.w800,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) =>
                                    TransactionsScreen(
                                  transactions:
                                      transactions,
                                ),
                              ),
                            );
                          },
                          child:
                              const Text(
                            'View all',
                            style:
                                TextStyle(
                              color:
                                  Color(
                                      0xFF673AB7),
                              fontWeight:
                                  FontWeight
                                      .w700,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(
                      height: 12,
                    ),

                    transactions.isEmpty
                        ? emptyTransactions()
                        : Column(
                            children:
                                List.generate(
                              min(
                                transactions
                                    .length,
                                4,
                              ),
                              (index) {
                                final transaction =
                                    transactions[
                                        index];

                                return GestureDetector(
                                  onTap: () {
                                    openTransactionDetails(
                                      transaction,
                                    );
                                  },
                                  child:
                                      transactionTile(
                                    transaction,
                                  ),
                                );
                              },
                            ),
                          ),
                  ],
                ),
              ),
            ),

            // BOTTOM NAVIGATION
            Container(
              height: 82,
              decoration:
                  const BoxDecoration(
                color:
                    Color(0xFFF1EAF6),
                border: Border(
                  top: BorderSide(
                    color:
                        Color(0xFFE9E0EF),
                  ),
                ),
              ),
              child: Stack(
                clipBehavior:
                    Clip.none,
                children: [
                  Row(
                    mainAxisAlignment:
                        MainAxisAlignment
                            .spaceAround,
                    children: [
                      bottomItem(
                        Icons
                            .home_rounded,
                        'Home',
                        true,
                        () {},
                      ),
                      const SizedBox(
                        width: 90,
                      ),
                      bottomItem(
                        Icons
                            .receipt_long_rounded,
                        'Transactions',
                        false,
                        () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  TransactionsScreen(
                                transactions:
                                    transactions,
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),

                  Positioned(
                    top: -32,
                    left: 0,
                    right: 0,
                    child: Center(
                      child:
                          GestureDetector(
                        onTap:
                            openScanner,
                        child:
                            Container(
                          width: 66,
                          height: 66,
                          decoration:
                              BoxDecoration(
                            shape:
                                BoxShape
                                    .circle,
                            gradient:
                                const LinearGradient(
                              colors: [
                                Color(
                                    0xFF673AB7),
                                Color(
                                    0xFF803ED0),
                              ],
                            ),
                            border:
                                Border.all(
                              color:
                                  const Color(
                                0xFFF1EAF6,
                              ),
                              width: 5,
                            ),
                          ),
                          child:
                              const Icon(
                            Icons
                                .qr_code_scanner_rounded,
                            color:
                                Colors.white,
                            size: 29,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================================
  // QUICK ACTION CARD
  // ==========================================================

  Widget quickActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 125,
        padding:
            const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 13,
        ),
        decoration:
            BoxDecoration(
          color: Colors.white,
          borderRadius:
              BorderRadius.circular(
            22,
          ),
          border: Border.all(
            color:
                Colors.grey.shade200,
          ),
        ),
        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            Container(
              width: 42,
              height: 42,
              decoration:
                  BoxDecoration(
                color:
                    const Color(
                  0xFFF0E9FA,
                ),
                borderRadius:
                    BorderRadius.circular(
                  13,
                ),
              ),
              child: Icon(
                icon,
                color:
                    const Color(
                  0xFF673AB7,
                ),
              ),
            ),
            const SizedBox(
              height: 7,
            ),
            Text(
              title,
              maxLines: 1,
              overflow:
                  TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                fontWeight:
                    FontWeight.bold,
              ),
            ),
            const SizedBox(
              height: 2,
            ),
            Text(
              subtitle,
              maxLines: 1,
              overflow:
                  TextOverflow.ellipsis,
              style: TextStyle(
                color:
                    Colors.grey.shade500,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================================
  // EMPTY TRANSACTIONS
  // ==========================================================

  Widget emptyTransactions() {
    return Container(
      width: double.infinity,
      height: 160,
      decoration:
          BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(
          22,
        ),
        border: Border.all(
          color:
              Colors.grey.shade200,
        ),
      ),
      child: const Center(
        child: Column(
          mainAxisAlignment:
              MainAxisAlignment.center,
          children: [
            Icon(
              Icons
                  .receipt_long_outlined,
              size: 42,
              color: Colors.grey,
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              'No transactions yet',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================================
  // TRANSACTION TILE
  // ==========================================================

  Widget transactionTile(
    Map<String, dynamic>
        transaction,
  ) {
    final received =
        transaction['type'] ==
            'Received';

    final amount =
        (transaction['amount']
                as num)
            .toDouble();

    final date =
        DateTime.tryParse(
              transaction['date']
                      ?.toString() ??
                  '',
            ) ??
            DateTime.now();

    return Container(
      width: double.infinity,
      margin:
          const EdgeInsets.only(
        bottom: 10,
      ),
      padding:
          const EdgeInsets.symmetric(
        horizontal: 15,
        vertical: 12,
      ),
      decoration:
          BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(
          19,
        ),
        border: Border.all(
          color:
              Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration:
                BoxDecoration(
              color: received
                  ? Colors.green.shade50
                  : Colors.red.shade50,
              shape:
                  BoxShape.circle,
            ),
            child: Icon(
              received
                  ? Icons
                      .arrow_downward_rounded
                  : Icons
                      .arrow_upward_rounded,
              color: received
                  ? Colors.green
                  : Colors.red,
            ),
          ),
          const SizedBox(
            width: 13,
          ),
          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,
              children: [
                Text(
                  transaction[
                          'name'] ??
                      'Transaction',
                  maxLines: 1,
                  overflow:
                      TextOverflow
                          .ellipsis,
                  style:
                      const TextStyle(
                    fontWeight:
                        FontWeight
                            .w700,
                  ),
                ),
                const SizedBox(
                  height: 4,
                ),
                Text(
                  received
                      ? 'Money received'
                      : 'Money paid',
                  style:
                      TextStyle(
                    color: Colors
                        .grey
                        .shade500,
                    fontSize: 11,
                  ),
                ),
                const SizedBox(
                  height: 2,
                ),
                Text(
                  formatShortDate(
                    date,
                  ),
                  style:
                      TextStyle(
                    color: Colors
                        .grey
                        .shade500,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(
            width: 5,
          ),
          Text(
            '${received ? '+' : '-'}₹${amount.toStringAsFixed(2)}',
            style:
                TextStyle(
              fontWeight:
                  FontWeight.bold,
              color: received
                  ? Colors.green
                  : Colors.red,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================================
  // DATE
  // ==========================================================

  String formatShortDate(
    DateTime date,
  ) {
    final now = DateTime.now();

    final today = DateTime(
      now.year,
      now.month,
      now.day,
    );

    final transactionDay =
        DateTime(
      date.year,
      date.month,
      date.day,
    );

    final difference =
        transactionDay
            .difference(today)
            .inDays;

    final time =
        '${date.hour.toString().padLeft(2, '0')}:'
        '${date.minute.toString().padLeft(2, '0')}';

    if (difference == 0) {
      return 'Today, $time';
    }

    if (difference == -1) {
      return 'Yesterday, $time';
    }

    if (difference == 1) {
      return 'Tomorrow, $time';
    }

    return '${date.day.toString().padLeft(2, '0')}/'
        '${date.month.toString().padLeft(2, '0')}/'
        '${date.year}, $time';
  }

  // ==========================================================
  // BOTTOM ITEM
  // ==========================================================

  Widget bottomItem(
    IconData icon,
    String title,
    bool selected,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: 110,
        height: 82,
        child: Column(
          mainAxisAlignment:
              MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: selected
                  ? const Color(
                      0xFF673AB7)
                  : Colors.grey
                      .shade700,
            ),
            const SizedBox(
              height: 4,
            ),
            Text(
              title,
              style:
                  TextStyle(
                fontSize: 12,
                color: selected
                    ? const Color(
                        0xFF673AB7)
                    : Colors.grey
                        .shade700,
                fontWeight: selected
                    ? FontWeight
                        .w600
                    : FontWeight
                        .normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================
// ADD MONEY SCREEN
// ============================================================

class AddMoneyScreen
    extends StatefulWidget {
  final Function(double amount)
      onAddMoney;

  const AddMoneyScreen({
    super.key,
    required this.onAddMoney,
  });

  @override
  State<AddMoneyScreen> createState() =>
      _AddMoneyScreenState();
}

class _AddMoneyScreenState
    extends State<AddMoneyScreen> {
  final amountController =
      TextEditingController();

  bool adding = false;

  @override
  void dispose() {
    amountController.dispose();
    super.dispose();
  }

  Future<void> addMoney() async {
    final amount =
        double.tryParse(
      amountController.text.trim(),
    );

    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context)
          .showSnackBar(
        const SnackBar(
          content: Text(
            'Enter a valid amount.',
          ),
        ),
      );
      return;
    }

    setState(() {
      adding = true;
    });

    // Small processing delay for UI feedback.
    await Future.delayed(
      const Duration(
        milliseconds: 300,
      ),
    );

    if (!mounted) {
      return;
    }

    widget.onAddMoney(amount);

    if (!mounted) {
      return;
    }

    Navigator.of(context).pop();
  }

  void setAmount(double amount) {
    amountController.text =
        amount.toStringAsFixed(0);

    amountController.selection =
        TextSelection.fromPosition(
      TextPosition(
        offset:
            amountController.text.length,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      appBar: AppBar(
        title: const Text(
          'Add Money',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding:
            const EdgeInsets.all(22),
        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            const SizedBox(
              height: 20,
            ),

            Center(
              child: Container(
                width: 90,
                height: 90,
                decoration:
                    const BoxDecoration(
                  color:
                      Color(0xFFE9DFFF),
                  shape:
                      BoxShape.circle,
                ),
                child: const Icon(
                  Icons
                      .account_balance_wallet_rounded,
                  size: 45,
                  color:
                      Color(0xFF673AB7),
                ),
              ),
            ),

            const SizedBox(
              height: 22,
            ),

            const Center(
              child: Text(
                'Add money to your wallet',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight:
                      FontWeight.bold,
                ),
              ),
            ),

            const SizedBox(
              height: 8,
            ),

            Center(
              child: Text(
                'Enter the amount you want to add.',
                textAlign:
                    TextAlign.center,
                style: TextStyle(
                  color:
                      Colors.grey.shade600,
                ),
              ),
            ),

            const SizedBox(
              height: 30,
            ),

            Container(
              padding:
                  const EdgeInsets.all(
                20,
              ),
              decoration:
                  BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(
                  22,
                ),
                border: Border.all(
                  color: Colors
                      .grey.shade200,
                ),
              ),
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment
                        .start,
                children: [
                  const Text(
                    'Amount',
                    style:
                        TextStyle(
                      fontSize: 15,
                      fontWeight:
                          FontWeight.w600,
                    ),
                  ),

                  const SizedBox(
                    height: 12,
                  ),

                  TextField(
                    controller:
                        amountController,
                    autofocus: true,
                    keyboardType:
                        const TextInputType
                            .numberWithOptions(
                      decimal: true,
                    ),
                    decoration:
                        InputDecoration(
                      prefixText:
                          '₹ ',
                      prefixStyle:
                          const TextStyle(
                        fontSize: 24,
                        fontWeight:
                            FontWeight.bold,
                      ),
                      hintText:
                          '0.00',
                      border:
                          OutlineInputBorder(
                        borderRadius:
                            BorderRadius
                                .circular(
                          16,
                        ),
                      ),
                    ),
                    style:
                        const TextStyle(
                      fontSize: 24,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),

                  const SizedBox(
                    height: 20,
                  ),

                  const Text(
                    'Quick amount',
                    style:
                        TextStyle(
                      fontWeight:
                          FontWeight.w600,
                    ),
                  ),

                  const SizedBox(
                    height: 12,
                  ),

                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      amountChip(
                        100,
                      ),
                      amountChip(
                        500,
                      ),
                      amountChip(
                        1000,
                      ),
                      amountChip(
                        5000,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(
              height: 24,
            ),

            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: adding
                    ? null
                    : addMoney,
                style:
                    ElevatedButton.styleFrom(
                  backgroundColor:
                      const Color(
                    0xFF673AB7,
                  ),
                  foregroundColor:
                      Colors.white,
                  shape:
                      RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(
                      17,
                    ),
                  ),
                ),
                child: adding
                    ? const SizedBox(
                        width: 23,
                        height: 23,
                        child:
                            CircularProgressIndicator(
                          strokeWidth: 2,
                          color:
                              Colors.white,
                        ),
                      )
                    : const Text(
                        'Add Money',
                        style:
                            TextStyle(
                          fontSize: 17,
                          fontWeight:
                              FontWeight
                                  .bold,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget amountChip(
    double amount,
  ) {
    return GestureDetector(
      onTap: () {
        setAmount(amount);
      },
      child: Container(
        padding:
            const EdgeInsets.symmetric(
          horizontal: 17,
          vertical: 10,
        ),
        decoration:
            BoxDecoration(
          color:
              const Color(0xFFF0E9FA),
          borderRadius:
              BorderRadius.circular(
            12,
          ),
        ),
        child: Text(
          '₹${amount.toStringAsFixed(0)}',
          style:
              const TextStyle(
            color:
                Color(0xFF673AB7),
            fontWeight:
                FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

// ============================================================
// PAY FRIEND SCREEN
// ============================================================

class PayFriendScreen
    extends StatefulWidget {
  final Function(
    String name,
    double amount,
  ) onPayment;

  const PayFriendScreen({
    super.key,
    required this.onPayment,
  });

  @override
  State<PayFriendScreen> createState() =>
      _PayFriendScreenState();

  void onPay(double amount) {}
}

class _PayFriendScreenState
    extends State<PayFriendScreen> {
  final nameController =
      TextEditingController();

  final amountController =
      TextEditingController();

  @override
  void dispose() {
    nameController.dispose();
    amountController.dispose();
    super.dispose();
  }

  void continuePayment() {
  final amount = double.tryParse(
    amountController.text.trim(),
  );

  if (amount == null || amount <= 0) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Enter a valid amount.'),
      ),
    );
    return;
  }

  // Let the parent handle the next screen.
  // Do NOT pop this screen here.
  widget.onPay(amount);
}

  void showMessage(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(
      SnackBar(
        content: Text(message),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      appBar: AppBar(
        title: const Text(
          'Pay Friend',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding:
            const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(
              height: 20,
            ),

            const CircleAvatar(
              radius: 42,
              backgroundColor:
                  Color(0xFFE9DFFF),
              child: Icon(
                Icons.person,
                size: 45,
                color:
                    Color(0xFF673AB7),
              ),
            ),

            const SizedBox(
              height: 18,
            ),

            const Text(
              'Send money to your friend',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),

            const SizedBox(
              height: 30,
            ),

            TextField(
              controller:
                  nameController,
              decoration:
                  InputDecoration(
                labelText:
                    'Friend Name',
                prefixIcon:
                    const Icon(
                  Icons
                      .person_outline,
                ),
                border:
                    OutlineInputBorder(
                  borderRadius:
                      BorderRadius.circular(
                    16,
                  ),
                ),
              ),
            ),

            const SizedBox(
              height: 16,
            ),

            TextField(
              controller:
                  amountController,
              keyboardType:
                  const TextInputType
                      .numberWithOptions(
                decimal: true,
              ),
              decoration:
                  InputDecoration(
                labelText: 'Amount',
                prefixText: '₹ ',
                prefixIcon:
                    const Icon(
                  Icons.currency_rupee,
                ),
                border:
                    OutlineInputBorder(
                  borderRadius:
                      BorderRadius.circular(
                    16,
                  ),
                ),
              ),
            ),

            const SizedBox(
              height: 24,
            ),

            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed:
                    continuePayment,
                style:
                    ElevatedButton.styleFrom(
                  backgroundColor:
                      const Color(
                    0xFF673AB7,
                  ),
                  foregroundColor:
                      Colors.white,
                  shape:
                      RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(
                      16,
                    ),
                  ),
                ),
                child: const Text(
                  'Continue',
                  style:
                      TextStyle(
                    fontSize: 17,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================
// PAYMENT CONFIRMATION
// ============================================================

class PaymentConfirmationScreen
    extends StatefulWidget {
  final String receiverName;
  final double amount;
  final String? upiId;

  final Future<bool> Function()
      onConfirm;

  const PaymentConfirmationScreen({
    super.key,
    required this.receiverName,
    required this.amount,
    required this.onConfirm,
    this.upiId,
  });

  @override
  State<PaymentConfirmationScreen>
      createState() =>
          _PaymentConfirmationScreenState();
}

class _PaymentConfirmationScreenState
    extends State<
        PaymentConfirmationScreen> {
  bool processing = false;

  Future<void> confirm() async {
    if (processing) {
      return;
    }

    setState(() {
      processing = true;
    });

    final navigator =
        Navigator.of(context);

    final success =
        await widget.onConfirm();

    if (!mounted) {
      return;
    }

    if (!success) {
      setState(() {
        processing = false;
      });
      return;
    }

    if (!navigator.mounted) {
      return;
    }

    navigator.pushReplacement(
      MaterialPageRoute(
        builder: (_) =>
            PaymentSuccessScreen(
          receiverName:
              widget.receiverName,
          amount: widget.amount,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      appBar: AppBar(
        title: const Text(
          'Confirm Payment',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Padding(
        padding:
            const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(
              height: 25,
            ),

            Container(
              width: double.infinity,
              padding:
                  const EdgeInsets.all(
                24,
              ),
              decoration:
                  BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(
                  25,
                ),
                border: Border.all(
                  color:
                      Colors.grey.shade200,
                ),
              ),
              child: Column(
                children: [
                  const CircleAvatar(
                    radius: 40,
                    backgroundColor:
                        Color(0xFFE9DFFF),
                    child: Icon(
                      Icons.person,
                      size: 42,
                      color:
                          Color(0xFF673AB7),
                    ),
                  ),

                  const SizedBox(
                    height: 18,
                  ),

                  const Text(
                    'You are paying',
                    style:
                        TextStyle(
                      color: Colors.grey,
                    ),
                  ),

                  const SizedBox(
                    height: 5,
                  ),

                  Text(
                    widget.receiverName,
                    textAlign:
                        TextAlign.center,
                    style:
                        const TextStyle(
                      fontSize: 22,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),

                  if (widget.upiId !=
                          null &&
                      widget.upiId!
                          .isNotEmpty)
                    Padding(
                      padding:
                          const EdgeInsets
                              .only(
                        top: 6,
                      ),
                      child: Text(
                        widget.upiId!,
                        style:
                            TextStyle(
                          color: Colors
                              .grey
                              .shade600,
                          fontSize: 13,
                        ),
                      ),
                    ),

                  const SizedBox(
                    height: 25,
                  ),

                  Text(
                    '₹${widget.amount.toStringAsFixed(2)}',
                    style:
                        const TextStyle(
                      fontSize: 36,
                      fontWeight:
                          FontWeight.w800,
                      color:
                          Color(0xFF673AB7),
                    ),
                  ),
                ],
              ),
            ),

            const Spacer(),

            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed:
                    processing
                        ? null
                        : confirm,
                style:
                    ElevatedButton.styleFrom(
                  backgroundColor:
                      const Color(
                    0xFF673AB7,
                  ),
                  foregroundColor:
                      Colors.white,
                  shape:
                      RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(
                      16,
                    ),
                  ),
                ),
                child: processing
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child:
                            CircularProgressIndicator(
                          strokeWidth: 2,
                          color:
                              Colors.white,
                        ),
                      )
                    : const Text(
                        'Confirm & Pay',
                        style:
                            TextStyle(
                          fontSize: 16,
                          fontWeight:
                              FontWeight
                                  .bold,
                        ),
                      ),
              ),
            ),

            const SizedBox(
              height: 12,
            ),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed:
                    processing
                        ? null
                        : () {
                            Navigator.pop(
                              context,
                            );
                          },
                child:
                    const Text('Cancel'),
              ),
            ),

            const SizedBox(
              height: 20,
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================
// PAYMENT SUCCESS
// ============================================================

class PaymentSuccessScreen
    extends StatelessWidget {
  final String receiverName;
  final double amount;

  const PaymentSuccessScreen({
    super.key,
    required this.receiverName,
    required this.amount,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding:
                const EdgeInsets.all(
              24,
            ),
            child: Column(
              mainAxisAlignment:
                  MainAxisAlignment
                      .center,
              children: [
                Container(
                  width: 95,
                  height: 95,
                  decoration:
                      const BoxDecoration(
                    color:
                        Color(0xFFE8F7ED),
                    shape:
                        BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    color: Colors.green,
                    size: 60,
                  ),
                ),

                const SizedBox(
                  height: 25,
                ),

                const Text(
                  'Payment Successful',
                  textAlign:
                      TextAlign.center,
                  style: TextStyle(
                    fontSize: 27,
                    fontWeight:
                        FontWeight.w800,
                  ),
                ),

                const SizedBox(
                  height: 10,
                ),

                Text(
                  '₹${amount.toStringAsFixed(2)} paid to $receiverName',
                  textAlign:
                      TextAlign.center,
                  style: TextStyle(
                    color:
                        Colors.grey.shade600,
                    fontSize: 15,
                  ),
                ),

                const SizedBox(
                  height: 35,
                ),

                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child:
                      ElevatedButton(
                    onPressed: () {
                      Navigator.popUntil(
                        context,
                        (route) =>
                            route.isFirst,
                      );
                    },
                    style:
                        ElevatedButton
                            .styleFrom(
                      backgroundColor:
                          const Color(
                        0xFF673AB7,
                      ),
                      foregroundColor:
                          Colors.white,
                      shape:
                          RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius
                                .circular(
                          16,
                        ),
                      ),
                    ),
                    child: const Text(
                      'Done',
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================
// SCANNER
// ============================================================

class ScannerScreen
    extends StatefulWidget {
  final Function(
    String name,
    double amount, {
    String? upiId,
  }) onPayment;

  const ScannerScreen({
    super.key,
    required this.onPayment,
  });

  @override
  State<ScannerScreen> createState() =>
      _ScannerScreenState();
}

class _ScannerScreenState
    extends State<ScannerScreen> {
  bool alreadyScanned = false;

  void handleScan(String value) {
    if (alreadyScanned) {
      return;
    }

    if (value.trim().isEmpty) {
      return;
    }

    alreadyScanned = true;

    // ========================================================
    // UPI QR
    // ========================================================

    if (value
        .trim()
        .toLowerCase()
        .startsWith('upi://pay')) {
      try {
        final uri =
            Uri.parse(value);

        final upiId =
            uri.queryParameters['pa'] ??
                '';

        final payeeName =
            uri.queryParameters['pn'] ??
                'UPI User';

        final fixedAmount =
            uri.queryParameters['am'];

        double? amount;

        if (fixedAmount != null &&
            fixedAmount.isNotEmpty) {
          amount =
              double.tryParse(
            fixedAmount,
          );
        }

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) =>
                PaymentScreen(
              receiverName:
                  payeeName.isEmpty
                      ? 'UPI User'
                      : payeeName,
              upiId: upiId,
              initialAmount:
                  amount,
              onPay: (value) {
                widget.onPayment(
                  payeeName.isEmpty
                      ? 'UPI User'
                      : payeeName,
                  value,
                  upiId: upiId,
                );
              },
            ),
          ),
        );

        return;
      } catch (_) {}
    }

    // ==========================================================
// WALLET QR
// ==========================================================

try {
  final data = jsonDecode(value);

  if (data is Map &&
      data['type'] == 'wallet_payment') {

    final name =
        data['name']
                ?.toString()
                .trim()
                .isNotEmpty ==
            true
        ? data['name'].toString().trim()
        : 'Wallet User';

    final walletId =
        data['walletId']
            ?.toString()
            .trim();

    // Wallet ID is required for Wallet → Wallet payment
    if (walletId == null || walletId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Invalid Wallet QR: Wallet ID not found.',
          ),
        ),
      );

      return;
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentScreen(
          receiverName: name,
          onPay: (amount) {
            widget.onPayment(
              name,
              amount,
              upiId: walletId,
            );
          },
        ),
      ),
    );

    return;
  }
} catch (_) {}
    // ========================================================
    // ANY OTHER QR
    // ========================================================

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) =>
            QRResultScreen(
          qrData: value,
          onPayment:
              widget.onPayment,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor:
            Colors.black,
        foregroundColor:
            Colors.white,
        title:
            const Text('Scan QR'),
      ),
      body: Stack(
        children: [
          MobileScanner(
            onDetect:
                (capture) {
              for (final barcode
                  in capture.barcodes) {
                final value =
                    barcode.rawValue;

                if (value != null &&
                    value.trim()
                        .isNotEmpty) {
                  handleScan(
                    value,
                  );
                  break;
                }
              }
            },
          ),

          Center(
            child: Container(
              width: 270,
              height: 270,
              decoration:
                  BoxDecoration(
                border:
                    Border.all(
                  color:
                      Colors.white,
                  width: 3,
                ),
                borderRadius:
                    BorderRadius
                        .circular(
                  22,
                ),
              ),
            ),
          ),

          const Positioned(
            top: 35,
            left: 20,
            right: 20,
            child: Text(
              'Scan any QR code',
              textAlign:
                  TextAlign.center,
              style: TextStyle(
                color:
                    Colors.white,
                fontSize: 18,
                fontWeight:
                    FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// PAYMENT SCREEN
// ============================================================

class PaymentScreen extends StatefulWidget {
  final String receiverName;
  final String? upiId;
  final double? initialAmount;

  final Function(double amount) onPay;

  const PaymentScreen({
    super.key,
    required this.receiverName,
    required this.onPay,
    this.upiId,
    this.initialAmount,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  late TextEditingController amountController;

  @override
  void initState() {
    super.initState();

    amountController = TextEditingController(
      text: widget.initialAmount != null
          ? widget.initialAmount!.toStringAsFixed(2)
          : '',
    );
  }

  @override
  void dispose() {
    amountController.dispose();
    super.dispose();
  }

  void continuePayment() {
    final amount = double.tryParse(
      amountController.text.trim(),
    );

    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Enter a valid amount.'),
        ),
      );
      return;
    }

    // Send the amount back to the parent.
    // The parent will open the confirmation screen.
    widget.onPay(amount);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F7FC),

      appBar: AppBar(
        title: const Text(
          'Pay',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),

        child: Column(
          children: [
            const SizedBox(height: 25),

            const CircleAvatar(
              radius: 43,
              backgroundColor: Color(0xFFE9DFFF),

              child: Icon(
                Icons.person,
                size: 47,
                color: Color(0xFF673AB7),
              ),
            ),

            const SizedBox(height: 15),

            const Text(
              'Pay To',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),

            const SizedBox(height: 5),

            Text(
              widget.receiverName,
              textAlign: TextAlign.center,

              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),

            if (widget.upiId != null &&
                widget.upiId!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(
                  top: 7,
                ),

                child: Text(
                  widget.upiId!,

                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 13,
                  ),
                ),
              ),

            const SizedBox(height: 30),

            TextField(
              controller: amountController,

              readOnly: widget.initialAmount != null,

              keyboardType:
                  const TextInputType.numberWithOptions(
                decimal: true,
              ),

              decoration: InputDecoration(
                labelText: 'Amount',

                prefixText: '₹ ',

                prefixIcon: const Icon(
                  Icons.currency_rupee,
                ),

                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(
                    16,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 55,

              child: ElevatedButton(
                onPressed: continuePayment,

                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      const Color(0xFF673AB7),

                  foregroundColor: Colors.white,

                  shape: RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(16),
                  ),
                ),

                child: const Text(
                  'Continue',

                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================
// QR RESULT
// ============================================================

class QRResultScreen
    extends StatelessWidget {
  final String qrData;

  final Function(
    String name,
    double amount, {
    String? upiId,
  }) onPayment;

  const QRResultScreen({
    super.key,
    required this.qrData,
    required this.onPayment,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      appBar: AppBar(
        title: const Text(
          'QR Result',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding:
            const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(
              height: 25,
            ),

            const Icon(
              Icons
                  .qr_code_scanner_rounded,
              size: 70,
              color:
                  Color(0xFF673AB7),
            ),

            const SizedBox(
              height: 18,
            ),

            const Text(
              'QR Code Detected',
              style: TextStyle(
                fontSize: 23,
                fontWeight:
                    FontWeight.bold,
              ),
            ),

            const SizedBox(
              height: 8,
            ),

            const Text(
              'The QR code was scanned successfully.',
              textAlign:
                  TextAlign.center,
              style: TextStyle(
                color: Colors.grey,
              ),
            ),

            const SizedBox(
              height: 25,
            ),

            Container(
              width: double.infinity,
              padding:
                  const EdgeInsets.all(
                20,
              ),
              decoration:
                  BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(
                  22,
                ),
              ),
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment
                        .start,
                children: [
                  const Text(
                    'QR Content',
                    style:
                        TextStyle(
                      fontSize: 20,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),
                  const SizedBox(
                    height: 15,
                  ),
                  Container(
                    width:
                        double.infinity,
                    padding:
                        const EdgeInsets.all(
                      16,
                    ),
                    decoration:
                        BoxDecoration(
                      color:
                          const Color(
                        0xFFF5F3F8,
                      ),
                      borderRadius:
                          BorderRadius
                              .circular(
                        16,
                      ),
                    ),
                    child:
                        SelectableText(
                      qrData,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(
              height: 20,
            ),

            SizedBox(
              width: double.infinity,
              height: 52,
              child:
                  OutlinedButton.icon(
                onPressed: () {
                  Navigator
                      .pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) =>
                          ScannerScreen(
                        onPayment:
                            onPayment,
                      ),
                    ),
                  );
                },
                icon: const Icon(
                  Icons
                      .qr_code_scanner_rounded,
                ),
                label:
                    const Text(
                  'Scan Another QR',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================
// PROFILE SCREEN
// ============================================================

class ProfileScreen
    extends StatefulWidget {
  final String userName;
  final String email;
  final String phone;
  final String profilePhoto;

  const ProfileScreen({
    super.key,
    required this.userName,
    required this.email,
    required this.phone,
    required this.profilePhoto,
  });

  @override
  State<ProfileScreen> createState() =>
      _ProfileScreenState();
}

class _ProfileScreenState
    extends State<ProfileScreen> {
  late TextEditingController
      nameController;

  late TextEditingController
      emailController;

  late TextEditingController
      phoneController;

  String photoPath = '';

  bool isEditing = false;
  bool profileSaved = false;
  bool saving = false;

  final ImagePicker picker =
      ImagePicker();

  @override
  void initState() {
    super.initState();

    nameController =
        TextEditingController(
      text: widget.userName,
    );

    emailController =
        TextEditingController(
      text: widget.email,
    );

    phoneController =
        TextEditingController(
      text: widget.phone,
    );

    photoPath =
        widget.profilePhoto;

    loadProfileStatus();
  }

  Future<void>
      loadProfileStatus() async {
    final prefs =
        await SharedPreferences
            .getInstance();

    final saved =
        prefs.getBool(
              'profileSaved',
            ) ??
            false;

    if (!mounted) {
      return;
    }

    setState(() {
      profileSaved = saved;
      isEditing = !saved;
    });
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    super.dispose();
  }

  Future<void> pickPhoto() async {
    try {
      final image =
          await picker.pickImage(
        source:
            ImageSource.gallery,
        imageQuality: 80,
      );

      if (!mounted) {
        return;
      }

      if (image == null) {
        return;
      }

      setState(() {
        photoPath = image.path;
      });
    } catch (_) {
      if (!mounted) {
        return;
      }

      showMessage(
        'Unable to select photo.',
      );
    }
  }

  Future<void> saveProfile() async {
    final name =
        nameController.text.trim();

    final email =
        emailController.text.trim();

    final phone =
        phoneController.text.trim();

    if (name.isEmpty) {
      showMessage(
        'Please enter your name.',
      );
      return;
    }

    if (email.isEmpty ||
        !email.contains('@')) {
      showMessage(
        'Please enter a valid email.',
      );
      return;
    }

    if (phone.isEmpty ||
        phone.length < 10) {
      showMessage(
        'Please enter a valid phone number.',
      );
      return;
    }

    setState(() {
      saving = true;
    });

    final prefs =
        await SharedPreferences
            .getInstance();

    await prefs.setString(
      'userName',
      name,
    );

    await prefs.setString(
      'email',
      email,
    );

    await prefs.setString(
      'phone',
      phone,
    );

    await prefs.setString(
      'profilePhoto',
      photoPath,
    );

    await prefs.setBool(
      'profileSaved',
      true,
    );

    if (!mounted) {
      return;
    }

    setState(() {
      profileSaved = true;
      isEditing = false;
      saving = false;
    });

    showMessage(
      'Profile saved successfully!',
    );
  }

  void editProfile() {
    setState(() {
      isEditing = true;
    });
  }

  void showMessage(String message) {
    if (!mounted) {
      return;
    }

    ScaffoldMessenger.of(context)
        .showSnackBar(
      SnackBar(
        content: Text(message),
        behavior:
            SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      appBar: AppBar(
        title: const Text(
          'Profile',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          if (profileSaved &&
              !isEditing)
            TextButton.icon(
              onPressed:
                  editProfile,
              icon: const Icon(
                Icons.edit_outlined,
                size: 19,
              ),
              label:
                  const Text('Edit'),
              style:
                  TextButton.styleFrom(
                foregroundColor:
                    const Color(
                  0xFF673AB7,
                ),
              ),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding:
            const EdgeInsets.fromLTRB(
          20,
          10,
          20,
          30,
        ),
        child: Column(
          children: [
            GestureDetector(
              onTap: isEditing
                  ? pickPhoto
                  : null,
              child:
                  profileAvatar(
                size: 105,
                photo: photoPath,
              ),
            ),

            if (isEditing)
              TextButton(
                onPressed:
                    pickPhoto,
                child: Text(
                  photoPath.isEmpty
                      ? 'Add Profile Photo'
                      : 'Change Photo',
                ),
              ),

            const SizedBox(
              height: 15,
            ),

            isEditing
                ? buildEditSection()
                : buildSavedSection(),

            const SizedBox(
              height: 24,
            ),

            buildWalletQR(),
          ],
        ),
      ),
    );
  }

  Widget buildEditSection() {
    return Container(
      width: double.infinity,
      padding:
          const EdgeInsets.all(20),
      decoration:
          BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(
          24,
        ),
        border: Border.all(
          color:
              Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment
                .start,
        children: [
          const Text(
            'Personal Information',
            style:
                TextStyle(
              fontSize: 20,
              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(
            height: 20,
          ),

          profileField(
            'User Name',
            nameController,
            Icons.person_outline,
          ),

          const SizedBox(
            height: 16,
          ),

          profileField(
            'Email',
            emailController,
            Icons.email_outlined,
          ),

          const SizedBox(
            height: 16,
          ),

          profileField(
            'Phone Number',
            phoneController,
            Icons.phone_outlined,
          ),

          const SizedBox(
            height: 20,
          ),

          SizedBox(
            width: double.infinity,
            height: 52,
            child:
                ElevatedButton(
              onPressed:
                  saving
                      ? null
                      : saveProfile,
              style:
                  ElevatedButton
                      .styleFrom(
                backgroundColor:
                    const Color(
                  0xFF673AB7,
                ),
                foregroundColor:
                    Colors.white,
                shape:
                    RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius
                          .circular(
                    16,
                  ),
                ),
              ),
              child: saving
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child:
                          CircularProgressIndicator(
                        strokeWidth: 2,
                        color:
                            Colors.white,
                      ),
                    )
                  : Text(
                      profileSaved
                          ? 'Save Changes'
                          : 'Save Profile',
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget buildSavedSection() {
    return Container(
      width: double.infinity,
      padding:
          const EdgeInsets.all(22),
      decoration:
          BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(
          24,
        ),
        border: Border.all(
          color:
              Colors.grey.shade200,
        ),
      ),
      child: Column(
        children: [
          Text(
            nameController.text,
            textAlign:
                TextAlign.center,
            style:
                const TextStyle(
              fontSize: 25,
              fontWeight:
                  FontWeight.bold,
            ),
          ),
          const SizedBox(
            height: 9,
          ),
          Text(
            emailController.text,
            textAlign:
                TextAlign.center,
            style:
                const TextStyle(
              color: Colors.grey,
            ),
          ),
          const SizedBox(
            height: 7,
          ),
          Text(
            phoneController.text,
            style:
                const TextStyle(
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget buildWalletQR() {
    return Container(
      width: double.infinity,
      padding:
          const EdgeInsets.all(22),
      decoration:
          BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(
          28,
        ),
        border: Border.all(
          color:
              Colors.grey.shade200,
        ),
      ),
      child: Column(
        children: [
          const Text(
            'Your Wallet',
            style:
                TextStyle(
              fontSize: 23,
              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(
            height: 6,
          ),

          const Text(
            'Scan this QR code to pay me',
            style:
                TextStyle(
              color: Colors.grey,
            ),
          ),

          const SizedBox(
            height: 20,
          ),

          QrImageView(
            data: jsonEncode({
              'type':
                  'wallet_payment',
              'walletId':
                  'WLT-7703948264',
              'name':
                  nameController
                      .text
                      .trim(),
            }),
            version:
                QrVersions.auto,
            size: 230,
            backgroundColor:
                Colors.white,
          ),

          const SizedBox(
            height: 15,
          ),

          const Text(
            'WLT-7703948264',
            style:
                TextStyle(
              fontWeight:
                  FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget profileField(
    String label,
    TextEditingController
        controller,
    IconData icon,
  ) {
    return TextField(
      controller: controller,
      decoration:
          InputDecoration(
        labelText: '$label *',
        prefixIcon:
            Icon(icon),
        border:
            OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(
            15,
          ),
        ),
      ),
    );
  }
}

// ============================================================
// PROFILE AVATAR
// ============================================================

Widget profileAvatar({
  required double size,
  required String photo,
}) {
  final hasPhoto =
      photo.isNotEmpty &&
      File(photo).existsSync();

  return Container(
    width: size,
    height: size,
    decoration:
        BoxDecoration(
      shape:
          BoxShape.circle,
      color:
          const Color(0xFFE9DFFF),
      border: Border.all(
        color:
            const Color(0xFF673AB7),
        width: 2,
      ),
      image: hasPhoto
          ? DecorationImage(
              image:
                  FileImage(
                File(photo),
              ),
              fit: BoxFit.cover,
            )
          : null,
    ),
    child: hasPhoto
        ? null
        : Icon(
            Icons.person,
            size: size * .52,
            color:
                const Color(
              0xFF673AB7,
            ),
          ),
  );
}

// ============================================================
// TRANSACTION DETAILS
// ============================================================

class TransactionDetailsScreen
    extends StatelessWidget {
  final Map<String, dynamic>
      transaction;

  const TransactionDetailsScreen({
    super.key,
    required this.transaction,
  });

  @override
  Widget build(BuildContext context) {
    final received =
        transaction['type'] ==
            'Received';

    final amount =
        (transaction['amount']
                as num)
            .toDouble();

    final date =
        DateTime.tryParse(
              transaction['date']
                      ?.toString() ??
                  '',
            ) ??
            DateTime.now();

    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      appBar: AppBar(
        title: const Text(
          'Transaction Details',
          style: TextStyle(
            fontWeight:
                FontWeight.bold,
          ),
        ),
      ),
      body:
          SingleChildScrollView(
        padding:
            const EdgeInsets.all(
          20,
        ),
        child: Column(
          children: [
            const SizedBox(
              height: 10,
            ),

            Icon(
              received
                  ? Icons
                      .arrow_downward_rounded
                  : Icons
                      .arrow_upward_rounded,
              size: 70,
              color: received
                  ? Colors.green
                  : Colors.red,
            ),

            const SizedBox(
              height: 15,
            ),

            Text(
              received
                  ? 'Money Received'
                  : 'Money Paid',
              style:
                  const TextStyle(
                fontSize: 22,
                fontWeight:
                    FontWeight.bold,
              ),
            ),

            const SizedBox(
              height: 8,
            ),

            Text(
              '${received ? '+' : '-'}₹${amount.toStringAsFixed(2)}',
              style:
                  TextStyle(
                fontSize: 34,
                fontWeight:
                    FontWeight.bold,
                color: received
                    ? Colors.green
                    : Colors.red,
              ),
            ),

            const SizedBox(
              height: 25,
            ),

            Container(
              width: double.infinity,
              padding:
                  const EdgeInsets.all(
                22,
              ),
              decoration:
                  BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(
                  24,
                ),
              ),
              child: Column(
                children: [
                  detailRow(
                    'Person',
                    transaction[
                            'name'] ??
                        'Unknown',
                    Icons.person_outline,
                  ),

                  const Divider(
                    height: 30,
                  ),

                  detailRow(
                    'Amount',
                    '₹${amount.toStringAsFixed(2)}',
                    Icons.currency_rupee,
                  ),

                  const Divider(
                    height: 30,
                  ),

                  detailRow(
                    'Date',
                    '${date.day.toString().padLeft(2, '0')}/'
                    '${date.month.toString().padLeft(2, '0')}/'
                    '${date.year}',
                    Icons
                        .calendar_today_outlined,
                  ),

                  const Divider(
                    height: 30,
                  ),

                  detailRow(
                    'Time',
                    '${date.hour.toString().padLeft(2, '0')}:'
                    '${date.minute.toString().padLeft(2, '0')}:'
                    '${date.second.toString().padLeft(2, '0')}',
                    Icons.access_time,
                  ),

                  const Divider(
                    height: 30,
                  ),

                  detailRow(
                    'Reference Number',
                    transaction[
                            'reference'] ??
                        'N/A',
                    Icons.tag,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget detailRow(
    String title,
    String value,
    IconData icon,
  ) {
    return Row(
      crossAxisAlignment:
          CrossAxisAlignment
              .start,
      children: [
        Container(
          width: 42,
          height: 42,
          decoration:
              BoxDecoration(
            color:
                const Color(
              0xFFF3EFF8,
            ),
            borderRadius:
                BorderRadius.circular(
              12,
            ),
          ),
          child: Icon(
            icon,
            color:
                const Color(
              0xFF673AB7,
            ),
          ),
        ),

        const SizedBox(
          width: 14,
        ),

        Expanded(
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment
                    .start,
            children: [
              Text(
                title,
                style:
                    const TextStyle(
                  color: Colors.grey,
                  fontSize: 13,
                ),
              ),
              const SizedBox(
                height: 4,
              ),
              Text(
                value,
                style:
                    const TextStyle(
                  fontSize: 16,
                  fontWeight:
                      FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ============================================================
// TRANSACTIONS SCREEN
// ============================================================

class TransactionsScreen
    extends StatelessWidget {
  final List<Map<String, dynamic>>
      transactions;

  const TransactionsScreen({
    super.key,
    required this.transactions,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF9F7FC),
      appBar: AppBar(
        title: const Text(
          'Transactions',
          style:
              TextStyle(
            fontWeight:
                FontWeight.bold,
          ),
        ),
      ),
      body: transactions.isEmpty
          ? const Center(
              child: Text(
                'No transactions yet',
                style:
                    TextStyle(
                  color: Colors.grey,
                  fontSize: 16,
                ),
              ),
            )
          : ListView.builder(
              padding:
                  const EdgeInsets.all(
                20,
              ),
              itemCount:
                  transactions.length,
              itemBuilder:
                  (context, index) {
                final transaction =
                    transactions[
                        index];

                final received =
                    transaction[
                            'type'] ==
                        'Received';

                final amount =
                    (transaction[
                                'amount']
                            as num)
                        .toDouble();

                final date =
                    DateTime.tryParse(
                          transaction[
                                      'date']
                                  ?.toString() ??
                              '',
                        ) ??
                        DateTime.now();

                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) =>
                            TransactionDetailsScreen(
                          transaction:
                              transaction,
                        ),
                      ),
                    );
                  },
                  child:
                      Container(
                    margin:
                        const EdgeInsets
                            .only(
                      bottom: 12,
                    ),
                    padding:
                        const EdgeInsets
                            .symmetric(
                      horizontal: 16,
                      vertical: 13,
                    ),
                    decoration:
                        BoxDecoration(
                      color:
                          Colors.white,
                      borderRadius:
                          BorderRadius
                              .circular(
                        19,
                      ),
                      border:
                          Border.all(
                        color: Colors
                            .grey
                            .shade200,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          received
                              ? Icons
                                  .arrow_downward_rounded
                              : Icons
                                  .arrow_upward_rounded,
                          color:
                              received
                                  ? Colors.green
                                  : Colors.red,
                        ),

                        const SizedBox(
                          width: 13,
                        ),

                        Expanded(
                          child:
                              Column(
                            crossAxisAlignment:
                                CrossAxisAlignment
                                    .start,
                            children: [
                              Text(
                                transaction[
                                        'name'] ??
                                    'Transaction',
                                maxLines:
                                    1,
                                overflow:
                                    TextOverflow
                                        .ellipsis,
                                style:
                                    const TextStyle(
                                  fontWeight:
                                      FontWeight
                                          .bold,
                                ),
                              ),
                              const SizedBox(
                                height: 4,
                              ),
                              Text(
                                formatFullDate(
                                  date,
                                ),
                                style:
                                    TextStyle(
                                  color: Colors
                                      .grey
                                      .shade500,
                                  fontSize:
                                      11,
                                ),
                              ),
                            ],
                          ),
                        ),

                        Text(
                          '${received ? '+' : '-'}₹${amount.toStringAsFixed(2)}',
                          style:
                              TextStyle(
                            color:
                                received
                                    ? Colors.green
                                    : Colors.red,
                            fontWeight:
                                FontWeight
                                    .bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}

// ============================================================
// FULL DATE
// ============================================================

String formatFullDate(
  DateTime date,
) {
  return '${date.day.toString().padLeft(2, '0')}/'
      '${date.month.toString().padLeft(2, '0')}/'
      '${date.year} '
      '${date.hour.toString().padLeft(2, '0')}:'
      '${date.minute.toString().padLeft(2, '0')}:'
      '${date.second.toString().padLeft(2, '0')}';
}