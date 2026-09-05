import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Android Emulator
  static const String baseUrl = 'http://10.132.248.185:3000';

  // Get user by ID
  static Future<Map<String, dynamic>> getUser(int userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/users'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load users');
    }
  }

  // Get user by Wallet ID
  static Future<Map<String, dynamic>> getUserByWalletId(
    String walletId,
  ) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/users/wallet/$walletId'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('User not found');
    }
  }

  // Get transactions for a user
  static Future<Map<String, dynamic>> getUserTransactions(
    int userId,
  ) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/transactions/user/$userId'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load transactions');
    }
  }

  // Wallet to Wallet payment
  static Future<Map<String, dynamic>> walletTransfer({
  required String senderWalletId,
  required String receiverWalletId,
  required double amount,
  String? description,
}) async {

  
  final response = await http.post(
    Uri.parse(
      '$baseUrl/api/transactions/wallet-transfer',
    ),
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'senderWalletId': senderWalletId,
      'receiverWalletId': receiverWalletId,
      'amount': amount,
      'description': description,
    }),
  );

  final data = jsonDecode(response.body);

  if (response.statusCode == 201) {
    return data;
  } else {
    throw Exception(
      data['message'] ?? 'Wallet transfer failed',
    );
  }
}}