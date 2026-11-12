<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $userId = $_GET['user_id'] ?? null;
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'user_id is required']);
            exit();
        }

        $stmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC");
        $stmt->execute([$userId]);
        $transactions = $stmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $transactions]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            exit();
        }

        $id = $input['id'] ?? ('tx_' . uniqid());
        $userId = $input['user_id'] ?? '';
        $type = $input['type'] ?? 'expense';
        $amount = floatval($input['amount'] ?? 0);
        $category = trim($input['category'] ?? 'General');
        $desc = trim($input['title'] ?? ($input['description'] ?? ''));
        $wallet = trim($input['wallet'] ?? ($input['payment_method'] ?? 'Other'));
        $txDate = $input['date'] ?? date('Y-m-d H:i:s');

        if (!$userId || $amount <= 0 || !$desc) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required transaction fields']);
            exit();
        }

        $stmt = $pdo->prepare("
            INSERT INTO transactions (id, user_id, type, amount, category, description, payment_method, transaction_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $userId, $type, $amount, $category, $desc, $wallet, $txDate]);

        echo json_encode([
            'success' => true,
            'data' => [
                'id' => $id,
                'user_id' => $userId,
                'type' => $type,
                'amount' => $amount,
                'category' => $category,
                'description' => $desc,
                'payment_method' => $wallet,
                'transaction_date' => $txDate
            ]
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $userId = $_GET['user_id'] ?? null;

        if (!$id || !$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'id and user_id are required for deletion']);
            exit();
        }

        $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);

        echo json_encode(['success' => true, 'message' => 'Transaction deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

